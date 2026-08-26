# ─── Feature 9: Review Service Layer ───────────────────────────────────────────
#
# What this file is:
#   Database query logic and statistics calculation for customer reviews.
#
# Which feature & part:
#   Feature 9 (Reviews & Ratings) — Service Layer
#
# Functions:
#   • `get_vehicle_reviews`: Fetches all reviews for a scooter, joins user names,
#     calculates average rating score (e.g. 4.8), and star distribution breakdown.
#   • `create_review`: Inserts new customer rating and comment into Supabase.
#
# ────────────────────────────────────────────────────────────────────────────

from typing import Optional, Dict
from fastapi import HTTPException
from models.review import ReviewCreate, ReviewResponse, VehicleReviewSummary
from services.vehicle_service import get_vehicle_by_id
from services.auth_service import get_user_by_id


def get_vehicle_reviews(supabase_client, vehicle_id: str) -> VehicleReviewSummary:
    """
    [Feature 9 - Part 2]
    Fetches customer reviews for a scooter and computes summary statistics.

    Args:
        supabase_client: Active Supabase client.
        vehicle_id: UUID of the scooter.

    Returns:
        VehicleReviewSummary: Average rating, star counts breakdown, and review cards list.
    """
    try:
        # Fetch all review rows for this scooter ordered by latest first
        res = (
            supabase_client
            .table("reviews")
            .select("*")
            .eq("vehicle_id", vehicle_id)
            .order("created_at", desc=True)
            .execute()
        )

        if not res.data or len(res.data) == 0:
            return VehicleReviewSummary(
                vehicle_id=vehicle_id,
                average_rating=0.0,
                total_reviews=0,
                rating_counts={5: 0, 4: 0, 3: 0, 2: 0, 1: 0},
                reviews=[]
            )

        reviews_list = []
        rating_counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
        total_score = 0

        # Process each review row
        for row in res.data:
            rating = int(row.get("rating", 5))
            total_score += rating

            if rating in rating_counts:
                rating_counts[rating] += 1

            # Fetch reviewer's full name
            reviewer = get_user_by_id(supabase_client, str(row["user_id"]))
            user_name = reviewer.full_name if reviewer else "Anonymous Rider"

            reviews_list.append(
                ReviewResponse(
                    id=str(row["id"]),
                    vehicle_id=str(row["vehicle_id"]),
                    user_id=str(row["user_id"]),
                    user_name=user_name,
                    rating=rating,
                    comment=row.get("comment", ""),
                    created_at=row.get("created_at")
                )
            )

        total_reviews = len(reviews_list)
        avg_rating = round(total_score / total_reviews, 1) if total_reviews > 0 else 0.0

        return VehicleReviewSummary(
            vehicle_id=vehicle_id,
            average_rating=avg_rating,
            total_reviews=total_reviews,
            rating_counts=rating_counts,
            reviews=reviews_list
        )

    except Exception as exc:
        print(f"[review_service] Error fetching vehicle reviews: {exc}")
        return VehicleReviewSummary(
            vehicle_id=vehicle_id,
            average_rating=0.0,
            total_reviews=0,
            rating_counts={5: 0, 4: 0, 3: 0, 2: 0, 1: 0},
            reviews=[]
        )


def create_review(
    supabase_client,
    user_id: str,
    vehicle_id: str,
    review_data: ReviewCreate
) -> ReviewResponse:
    """
    [Feature 9 - Part 2]
    Inserts a new customer rating and review for a scooter into Supabase.

    Args:
        supabase_client: Active Supabase client.
        user_id: UUID of the authenticated user posting the review.
        vehicle_id: UUID of the scooter being reviewed.
        review_data: Star rating (1-5) and feedback comment.

    Returns:
        ReviewResponse: Created review card data.
    """
    # 1. Verify scooter existence
    vehicle = get_vehicle_by_id(supabase_client, vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail=f"Scooter with ID '{vehicle_id}' not found."
        )

    # 2. Validate rating range
    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be an integer between 1 and 5 stars."
        )

    try:
        # 3. Insert review row into Supabase
        insert_payload = {
            "vehicle_id": vehicle_id,
            "user_id": user_id,
            "booking_id": review_data.booking_id,
            "rating": review_data.rating,
            "comment": review_data.comment.strip()
        }

        res = (
            supabase_client
            .table("reviews")
            .insert(insert_payload)
            .execute()
        )

        if not res.data or len(res.data) == 0:
            raise HTTPException(
                status_code=500,
                detail="Failed to record review in database."
            )

        row = res.data[0]
        reviewer = get_user_by_id(supabase_client, user_id)
        user_name = reviewer.full_name if reviewer else "Anonymous Rider"

        return ReviewResponse(
            id=str(row["id"]),
            vehicle_id=str(row["vehicle_id"]),
            user_id=str(row["user_id"]),
            user_name=user_name,
            rating=int(row["rating"]),
            comment=row["comment"],
            created_at=row.get("created_at")
        )

    except HTTPException:
        raise
    except Exception as exc:
        print(f"[review_service] Create review error: {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Could not submit review: {str(exc)}"
        )
