from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'recipes', views.RecipeViewSet, basename='recipe')
router.register(r'saved-recipes', views.SavedRecipeViewSet, basename='saved-recipe')

urlpatterns = [
    path('', include(router.urls)),
    path('generate/', views.generate_recipe, name='generate-recipe'),
    path('save-generated/', views.save_generated_recipe, name='save-generated-recipe'),
] 