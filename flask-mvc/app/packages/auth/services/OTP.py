import smtplib
import random
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
otp_cache = {}


class OTP:
    def __init__(self, receiver_email):
        self.email = receiver_email
        self.otp = self.__generate_otp()
    
    def __generate_otp(self):
        otp = random.randint(100000, 999999)
        return otp
    
    def send_otp_email(self):
        """Send OTP code to the specified email address."""
        try:
            sender_email = os.getenv("SENDER_EMAIL")
            sender_password = os.getenv("SENDER_PASSWORD")

            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = self.email
            msg['Subject'] = "Your OTP Code"

            # Email body
            body = f"Your OTP code is: {self.otp}"
            msg.attach(MIMEText(body, 'plain'))

            # Connect to Gmail's SMTP server
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()  # Start TLS encryption
                server.login(sender_email, sender_password)  # Login to the email account
                server.sendmail(sender_email, self.email, msg.as_string())

            # Store the OTP in Redis with a 2-minute expiration
            otp_cache[self.email] = (self.otp, time.time())  # Lưu OTP và thời gian tạo
            print("OTP sent successfully!")
            return True
        
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False
    
    def verify_otp(self, email_user, user_otp):
        stored_otp, timestamp = otp_cache.get(email_user, (None, None))

        if stored_otp is not None:
            if time.time() - timestamp < 120:  # Kiểm tra thời gian sống
                if user_otp == stored_otp:
                    del otp_cache[email_user]  # Xóa OTP sau khi xác thực thành công
                print("OTP verified successfully!")
                return True
            else:
                print("No OTP found or it has expired.")
                return False
        else:
            print("Invalid OTP.")
            return False
