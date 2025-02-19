from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
import cohere
from django.conf import settings
from .models import Recipe, SavedRecipe, User
from .serializers import RecipeSerializer, SavedRecipeSerializer, RegisterSerializer, UserSerializer
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import UserRegistrationForm
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token  # Add this import

logger = logging.getLogger('myapp')  # Use the logger defined in settings.py

# Create your views here.

class RecipeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing recipes.
    
    Provides CRUD operations for recipes with proper authentication
    and user-specific queryset filtering.
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class SavedRecipeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing saved recipes.
    
    Allows users to save and manage their favorite recipes.
    """
    queryset = SavedRecipe.objects.all()
    serializer_class = SavedRecipeSerializer

class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)  # Ensure Token is correctly imported
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_recipe(request):
    """
    Generate a recipe using Cohere AI based on provided ingredients.
    """
    print(f"User: {request.user}")  # Check the user making the request
    print(f"Request data: {request.data}")  # Check the incoming request data
    
    # Add this print statement to debug
    print(f"Using API key: {settings.COHERE_API_KEY}")
    
    ingredients = request.data.get('ingredients', '')
    if not ingredients:
        return Response(
            {'error': 'Please provide ingredients'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        co = cohere.Client(settings.COHERE_API_KEY)
        prompt = f"""Create a recipe using these ingredients: {ingredients}
        
        Format the response exactly like this:
        Title: [Recipe Name]
        Servings: [Number]
        Cooking Time: [Minutes]
        Ingredients:
        - [Ingredient 1]
        - [Ingredient 2]
        ...
        Instructions:
        1. [Step 1]
        2. [Step 2]
        ...
        """
        
        response = co.generate(
            model='command',
            prompt=prompt,
            max_tokens=1000,
            temperature=0.7,
            k=0,
            stop_sequences=[],
            return_likelihoods='NONE'
        )
        
        generated_text = response.generations[0].text
        
        # Parse the generated text into structured data
        try:
            lines = generated_text.strip().split('\n')
            recipe_data = {}
            current_section = None
            
            for line in lines:
                line = line.strip()
                if line.startswith('Title:'):
                    recipe_data['title'] = line.replace('Title:', '').strip()
                elif line.startswith('Servings:'):
                    recipe_data['servings'] = line.replace('Servings:', '').strip()
                elif line.startswith('Cooking Time:'):
                    time_str = line.replace('Cooking Time:', '').strip()
                    # Extract numbers from the time string
                    import re
                    numbers = re.findall(r'\d+', time_str)
                    recipe_data['cooking_time'] = int(numbers[0]) if numbers else 30
                elif line.startswith('Ingredients:'):
                    current_section = 'ingredients'
                    recipe_data['ingredients'] = []
                elif line.startswith('Instructions:'):
                    current_section = 'instructions'
                    recipe_data['instructions'] = []
                elif line and current_section:
                    if current_section == 'ingredients':
                        if line.startswith('-'):
                            recipe_data['ingredients'].append(line[1:].strip())
                        else:
                            recipe_data['ingredients'].append(line.strip())
                    elif current_section == 'instructions':
                        if line[0].isdigit():
                            recipe_data['instructions'].append(line[line.find('.')+1:].strip())
                        else:
                            recipe_data['instructions'].append(line.strip())
            
            # Format the data for response
            formatted_recipe = {
                'title': recipe_data.get('title', 'Generated Recipe'),
                'servings': recipe_data.get('servings', '4'),
                'cooking_time': recipe_data.get('cooking_time', 30),
                'ingredients': '\n'.join(recipe_data.get('ingredients', [])),
                'instructions': '\n'.join(recipe_data.get('instructions', []))
            }
            
            return Response(formatted_recipe)
            
        except Exception as parsing_error:
            print(f"Parsing error: {parsing_error}")
            return Response(
                {'error': 'Failed to parse generated recipe', 'raw_text': generated_text},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        print(f"Cohere API error: {str(e)}")
        return Response(
            {'error': f'Failed to generate recipe: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_generated_recipe(request):
    """
    Save a generated recipe to the database.
    
    Args:
        request: HTTP request containing recipe details
        
    Returns:
        Response with saved recipe data or error message
    """
    required_fields = ['title', 'ingredients', 'instructions', 
                      'cooking_time', 'servings']
    
    # Validate all required fields are present
    missing_fields = [field for field in required_fields 
                     if not request.data.get(field)]
    if missing_fields:
        return Response(
            {'error': f'Missing required fields: {", ".join(missing_fields)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        recipe = Recipe.objects.create(
            user=request.user,
            title=request.data['title'],
            ingredients=request.data['ingredients'],
            instructions=request.data['instructions'],
            cooking_time=int(request.data['cooking_time']),
            servings=int(request.data['servings'])
        )
        
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except ValueError:
        return Response(
            {'error': 'Invalid cooking time or servings value'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'Failed to save recipe: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            return JsonResponse({'message': 'User registered successfully'}, status=201)
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
