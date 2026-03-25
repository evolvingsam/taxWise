from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from .api.views import TaxCalculateView

urlpatterns = [
    path("calculate/", TaxCalculateView.as_view(), name="tax-calculate"),
    path("schema/",    SpectacularAPIView.as_view(),  name="tax-engine-schema"),
    path("docs/",      SpectacularSwaggerView.as_view(url_name="tax-engine-schema"), name="tax-engine-swagger"),
    path("redoc/",     SpectacularRedocView.as_view(url_name="tax-engine-schema"),   name="tax-engine-redoc"),
]