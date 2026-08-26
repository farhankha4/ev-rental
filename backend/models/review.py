# ─── Feature 9: Review Pydantic Schemas ────────────────────────────────────────
#
# What this file is:
#   Data contracts for customer ratings and written reviews.
#
# Which feature & part:
#   Feature 9 (Reviews & Ratings) — Models Layer
#
# Schemas:
#   • ReviewCreate          -> Incoming payload when a customer posts a review (1-5 stars).
#   • ReviewResponse        -> Public representation of a single review card.
#   • VehicleReviewSummary  -> Calculated average score, total count, star distribution, and list.
#
# ────────────────────────────────────────────────────────────────────────────

from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class ReviewCreate(BaseModel):
    """
    [Feature 9 - Part 2]
    Incoming request payload for posting a review on a scooter (POST /vehicles/{id}/reviews).
    """
    rating: int = Field(..., ge=1, le=5, description="Star rating between 1 and 5")
    comment: str = Field(..., min_length=3, description="Review comment text")
    booking_id: Optional[str] = None


class ReviewResponse(BaseModel):
    """
    [Feature 9 - Part 2]
    Representation of a single review displayed on customer review cards.
    """
    id: str
    vehicle_id: str
    user_id: str
    user_name: str = "Anonymous Rider"
    rating: int
    comment: str
    created_at: Optional[datetime] = None


class VehicleReviewSummary(BaseModel):
    """
    [Feature 9 - Part 2]
    Aggregated rating statistics for a scooter profile page.
    """
    vehicle_id: str
    average_rating: float = 0.0
    total_reviews: int = 0
    rating_counts: Dict[int, int] = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
    reviews: List[ReviewResponse] = []
