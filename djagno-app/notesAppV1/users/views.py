import json
from django.contrib.auth.models import User
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.http import urlsafe_base64_decode
from rest_framework.permissions import AllowAny,IsAuthenticated # Add this import
from rest_framework.response import Response
from django.contrib.auth.password_validation import validate_password

class user_view(APIView):
    # This line tells Django: "Don't ask for a token here!"
    permission_classes = [AllowAny]

    def delete(self, request):
        try:
            if request.user:
                user = request.user
                
                # Soft Delete
                user.is_active = False
                user.save()
                
                return Response(status=204)
            else :
                return Response({"error":"No user is logged in "},status=401)
        except:
            return Response({"error":"Internal server error "},status=500)            

    def post(self, request):
        try:
            # 1. Parse the JSON body
            data = request.data
            username = data.get('username')
            password = data.get('password')
            email = data.get('email', '')

            # 2. Basic Validation
            if not username or not password:
                return Response({"error": "Missing credentials"}, status=400)

            if User.objects.filter(username=username).exists() or  User.objects.filter(email=email).exists():
                return Response({"error": "User already exists"}, status=400)

            # 3. Create the User (CRITICAL: use create_user for hashing)
            user = User.objects.create_user(
                username=username, 
                password=password, 
                email=email
            )

            # 4. Manually generate JWT Tokens
            refresh = RefreshToken.for_user(user)
            
            # 5. Return the response
            return Response({
                "user": {
                    "user_id": user.id,
                    "username": user.username
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=201)

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        





class RequestPasswordReset(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()

        if user:
            # 1. Generate a unique token
            token = default_token_generator.make_token(user)
            
            # 2. Encode the user's ID (for security in the URL)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # 3. Create the Reset Link
            # In a real app, this link points to your FRONTEND (React/Vue/Mobile)
            reset_link = f"https://yourfrontend.com/reset-password/{uid}/{token}/"
            
            # 4. Send Email (Standard Django way)
            # send_mail("Password Reset", f"Click here: {reset_link}", "admin@app.com", [email])
            
            print(f"DEBUG: Reset link is {reset_link}") # For your testing

        # For security, always return 200 even if the email doesn't exist
        # This prevents hackers from "fishing" for valid emails.
        return Response({"message": "If an account exists, a reset link has been sent."}, status=200)
    

class PasswordResetConfirm(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        try:
            # 1. Decode the user ID
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            
            # 2. Verify the token is valid for THIS user
            if default_token_generator.check_token(user, token):
                # 3. Set the new password (hashing it automatically!)
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password reset successful"}, status=200)
            else:
                return Response({"error": "Invalid or expired token"}, status=400)
                
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid data"}, status=400)
    



class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        # 1. Verify the old password
        if not user.check_password(old_password):
            return Response({"error": "Old password is incorrect"}, status=400)

        # 2. Validate the new password (checks length, commonality, etc.)
        try:
            validate_password(new_password, user)
        except Exception as e:
            return Response({"error": list(e.messages)}, status=400)

        # 3. Save the new password (this hashes it!)
        user.set_password(new_password)
        user.save()

        # 4. Success
        return Response({"message": "Password updated successfully"}, status=200)