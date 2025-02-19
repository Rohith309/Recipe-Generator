from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Recipe, SavedRecipe
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class RecipeSerializer(serializers.ModelSerializer):
    """
    Serializer for Recipe model.
    
    Includes nested UserSerializer for the recipe creator and handles
    all recipe-related fields.
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Recipe
        fields = (
            'id', 'user', 'title', 'ingredients', 'instructions',
            'cooking_time', 'servings', 'created_at', 'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')

class SavedRecipeSerializer(serializers.ModelSerializer):
    """
    Serializer for SavedRecipe model.
    
    Includes nested RecipeSerializer to provide full recipe details
    when retrieving saved recipes.
    """
    recipe = RecipeSerializer(read_only=True)
    
    class Meta:
        model = SavedRecipe
        fields = ('id', 'recipe', 'saved_at')
        read_only_fields = ('saved_at',)

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user