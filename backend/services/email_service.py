# ─── Feature 10: Email Notification Service Layer ─────────────────────────────
#
# What this file is:
#   Automated HTML email notification service for SwiftVolt customer rentals.
#   Uses Python's built-in `smtplib` and `email.mime.text` packages.
#
# Features:
#   • Asynchronous dispatch using FastAPI `BackgroundTasks` (non-blocking).
#   • `send_booking_confirmation_email`: Sent immediately upon reservation creation.
#   • `send_payment_receipt_email`: Sent immediately upon successful Razorpay payment verification.
#   • Fallback Logger Mode: If SMTP credentials are not set in .env, emails are logged cleanly
#     to console output without crashing application execution.
#
# ────────────────────────────────────────────────────────────────────────────

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any


def _get_smtp_credentials():
    """
    Reads SMTP environment settings from backend/.env.
    Returns a dict with host, port, user, password, and sender email.
    """
    return {
        "host": os.getenv("SMTP_HOST", ""),
        "port": int(os.getenv("SMTP_PORT", "587")),
        "user": os.getenv("SMTP_USER", ""),
        "password": os.getenv("SMTP_PASSWORD", ""),
        "sender": os.getenv("SENDER_EMAIL", "notifications@evora.com"),
    }


def _dispatch_email(recipient_email: str, subject: str, html_content: str):
    """
    Dispatches an HTML email to the recipient via SMTP, or logs to console in fallback mode.
    """
    creds = _get_smtp_credentials()

    # Check if SMTP is configured
    if not creds["host"] or not creds["user"]:
        print(f"\n[EMAIL SERVICE - LOG FALLBACK MODE]")
        print(f"To: {recipient_email}")
        print(f"Subject: {subject}")
        print(f"Body:\n{html_content[:300]}...\n[HTML Email Rendered Cleanly]\n")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = creds["sender"]
        msg["To"] = recipient_email

        html_part = MIMEText(html_content, "html")
        msg.attach(html_part)

        with smtplib.SMTP(creds["host"], creds["port"], timeout=10) as server:
            server.starttls()
            if creds["user"] and creds["password"]:
                server.login(creds["user"], creds["password"])
            server.sendmail(creds["sender"], recipient_email, msg.as_string())

        print(f"[EMAIL SERVICE] Email successfully dispatched to {recipient_email}")
        return True

    except Exception as exc:
        print(f"[EMAIL SERVICE] SMTP dispatch error: {exc}")
        return False


def send_booking_confirmation_email(user_email: str, user_name: str, booking: Dict[str, Any]):
    """
    [Feature 10 - Part 1: Booking Confirmation Email]
    Generates and dispatches an HTML booking confirmation email to the customer.

    Args:
        user_email: Customer email address.
        user_name: Customer full name.
        booking: Dict containing booking details (id, vehicle name, pickup, return, total_amount).
    """
    booking_id = str(booking.get("id", "N/A"))
    scooter_name = booking.get("vehicle", {}).get("name", "Electric Scooter") if isinstance(booking.get("vehicle"), dict) else "Electric Scooter"
    pickup = str(booking.get("pickup_time", "N/A"))
    return_time = str(booking.get("return_time", "N/A"))
    total_amount = booking.get("total_amount", 0.0)

    subject = f"⚡ Evora Reservation Confirmed — Booking #{booking_id[:8]}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; color: #111827; margin: 0; padding: 20px; }}
        .card {{ max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e5e7eb; overflow: hidden; font-size: 14px; }}
        .header {{ background: #004643; color: #ffffff; padding: 24px; text-align: center; }}
        .content {{ padding: 24px; line-height: 1.6; }}
        .detail-box {{ background: #f3f4f6; border-radius: 12px; padding: 16px; margin: 16px 0; }}
        .footer {{ text-align: center; font-size: 12px; color: #6b7280; padding: 16px; border-top: 1px solid #f3f4f6; }}
        .badge {{ background: #dbeafe; color: #1e40af; font-weight: bold; padding: 4px 10px; border-radius: 20px; font-size: 12px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="margin:0; font-size: 24px;">⚡ Evora EV Rentals</h1>
          <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Reservation Confirmation</p>
        </div>
        <div class="content">
          <p>Hi <strong>{user_name}</strong>,</p>
          <p>Thank you for choosing Evora! Your electric scooter reservation has been created successfully.</p>
          
          <div class="detail-box">
            <h3 style="margin-top:0; color: #004643;">Booking Summary</h3>
            <p><strong>Scooter:</strong> Evora {scooter_name}</p>
            <p><strong>Booking Reference:</strong> <code>{booking_id}</code></p>
            <p><strong>Pickup Date:</strong> {pickup}</p>
            <p><strong>Return Date:</strong> {return_time}</p>
            <p><strong>Total Amount:</strong> <span style="font-size: 18px; font-weight: bold; color: #004643;">₹{total_amount:,.2f}</span></p>
            <p><strong>Status:</strong> <span class="badge">Reserved</span></p>
          </div>

          <p>Please ensure you bring a valid government photo ID when picking up your scooter.</p>
          <p>Ride safe and enjoy zero-emission mobility!</p>
        </div>
        <div class="footer">
          Evora EV Rental Platform • Support: support@evora.com
        </div>
      </div>
    </body>
    </html>
    """

    return _dispatch_email(user_email, subject, html_content)


def send_payment_receipt_email(user_email: str, user_name: str, booking: Dict[str, Any], payment_id: str):
    """
    [Feature 10 - Part 1: Payment Receipt Email]
    Generates and dispatches an HTML payment receipt email to the customer.

    Args:
        user_email: Customer email address.
        user_name: Customer full name.
        booking: Dict containing booking details.
        payment_id: Razorpay Payment ID string.
    """
    booking_id = str(booking.get("id", "N/A"))
    scooter_name = booking.get("vehicle", {}).get("name", "Electric Scooter") if isinstance(booking.get("vehicle"), dict) else "Electric Scooter"
    total_amount = booking.get("total_amount", 0.0)

    subject = f"💳 Payment Receipt — Evora Booking #{booking_id[:8]}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; color: #111827; margin: 0; padding: 20px; }}
        .card {{ max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e5e7eb; overflow: hidden; font-size: 14px; }}
        .header {{ background: #004643; color: #ffffff; padding: 24px; text-align: center; }}
        .content {{ padding: 24px; line-height: 1.6; }}
        .detail-box {{ background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 16px 0; }}
        .footer {{ text-align: center; font-size: 12px; color: #6b7280; padding: 16px; border-top: 1px solid #f3f4f6; }}
        .badge {{ background: #dcfce7; color: #15803d; font-weight: bold; padding: 4px 10px; border-radius: 20px; font-size: 12px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="margin:0; font-size: 24px;">💳 Payment Successful</h1>
          <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Evora Payment Receipt</p>
        </div>
        <div class="content">
          <p>Hi <strong>{user_name}</strong>,</p>
          <p>We have received your payment via Razorpay. Your scooter rental is now <strong>fully confirmed</strong>!</p>
          
          <div class="detail-box">
            <h3 style="margin-top:0; color: #004643;">Receipt Details</h3>
            <p><strong>Razorpay Payment ID:</strong> <code>{payment_id}</code></p>
            <p><strong>Booking Reference:</strong> <code>{booking_id}</code></p>
            <p><strong>Scooter:</strong> Evora {scooter_name}</p>
            <p><strong>Amount Paid:</strong> <span style="font-size: 18px; font-weight: bold; color: #004643;">₹{total_amount:,.2f}</span></p>
            <p><strong>Payment Status:</strong> <span class="badge">PAID</span></p>
          </div>

          <p>Your scooter is prepped and ready for pickup at your selected time.</p>
        </div>
        <div class="footer">
          Evora EV Rental Platform • Support: support@evora.com
        </div>
      </div>
    </body>
    </html>
    """

    return _dispatch_email(user_email, subject, html_content)
