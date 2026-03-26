from rest_framework import status, generics, permissions, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .serializers import (
    UserRegistrationSerializer, 
    EmailTokenObtainPairSerializer, 
    UserProfileSerializer
)

class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        tags=["Accounts"],
        summary="Register a new user",
        responses={201: UserRegistrationSerializer}
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class LoginView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        tags=["Accounts"],
        summary="Login and obtain JWT tokens",
        responses={200: EmailTokenObtainPairSerializer}
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Accounts"],
        summary="Logout by blacklisting refresh token",
        request={"application/json": {"type": "object", "properties": {"refresh": {"type": "string"}}}},
        responses={200: OpenApiResponse(description="Successfully logged out.")}
    )
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Accounts"],
        summary="Get or update the current user's profile"
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        tags=["Accounts"],
        summary="Update the current user's profile"
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @extend_schema(exclude=True)
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
