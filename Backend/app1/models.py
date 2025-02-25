from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

class Recipe(models.Model):
    """
    Recipe Model: Stores recipe information and its relationship with users.
    
    Attributes:
        user (ForeignKey): Reference to User who created the recipe
        title (str): Title of the recipe
        ingredients (text): List of ingredients required
        instructions (text): Step-by-step cooking instructions
        cooking_time (int): Time required to cook in minutes
        servings (int): Number of servings the recipe makes
        created_at (datetime): Timestamp when recipe was created
        updated_at (datetime): Timestamp when recipe was last updated
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        help_text="User who created this recipe"
    )
    title = models.CharField(
        max_length=200,
        help_text="Title of the recipe"
    )
    ingredients = models.TextField(
        help_text="List of ingredients required for the recipe"
    )
    instructions = models.TextField(
        help_text="Step-by-step cooking instructions"
    )
    cooking_time = models.IntegerField(
        help_text="Cooking time in minutes"
    )
    servings = models.IntegerField(
        help_text="Number of servings this recipe makes"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Recipe'
        verbose_name_plural = 'Recipes'
    
    def __str__(self):
        return self.title

class SavedRecipe(models.Model):
    """
    SavedRecipe Model: Tracks which recipes are saved by users.
    
    This model creates a many-to-many relationship between users and recipes,
    allowing users to save recipes they like for later reference.
    
    Attributes:
        user (ForeignKey): User who saved the recipe
        recipe (ForeignKey): Reference to the saved recipe
        saved_at (datetime): When the recipe was saved
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        help_text="User who saved this recipe"
    )
    recipe = models.ForeignKey(
        Recipe, 
        on_delete=models.CASCADE,
        help_text="The saved recipe"
    )
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'recipe']
        ordering = ['-saved_at']
        verbose_name = 'Saved Recipe'
        verbose_name_plural = 'Saved Recipes'
        
    def __str__(self):
        return f"{self.user.email} - {self.recipe.title}"