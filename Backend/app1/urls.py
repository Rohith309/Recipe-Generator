from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import RegisterView, LoginView
import logging

router = DefaultRouter()
router.register(r'recipes', views.RecipeViewSet, basename='recipe')
router.register(r'saved-recipes', views.SavedRecipeViewSet, basename='saved-recipe')

logger = logging.getLogger(__name__)

urlpatterns = [
    path('', include(router.urls)),
    path('generate/', views.generate_recipe, name='generate-recipe'),
    path('save-generated/', views.save_generated_recipe, name='save-generated-recipe'),
    path('auth/register/', RegisterView.as_view(), name='register_user'),  # Updated URL to match frontend
    path('auth/login/', LoginView.as_view(), name='login'),  # Updated URL to match frontend
]

logger.debug("URL patterns: %s", urlpatterns)