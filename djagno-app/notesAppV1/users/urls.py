from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    user_view, 
    RequestPasswordReset, 
    PasswordResetConfirm, 
    ChangePasswordView
)

urlpatterns = [
    # --- Authentication (Login/Refresh) ---
    # These use SimpleJWT's built-in views
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- User Account Management ---
    # POST = Register, DELETE = Soft Delete
    path('auth/user/', user_view.as_view(), name='user_action'),

    # --- Password Reset (Forgotten Password - Public) ---
    path('auth/password-reset-request/', RequestPasswordReset.as_view(), name='password_reset_request'),
    path('auth/password-reset-confirm/', PasswordResetConfirm.as_view(), name='password_reset_confirm'),

    # --- Password Change (LoggedIn User - Private) ---
    path('auth/password-change/', ChangePasswordView.as_view(), name='password_change'),
]