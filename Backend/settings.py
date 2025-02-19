import os
from pathlib import Path

# Define BASE_DIR
BASE_DIR = Path(__file__).resolve().parent.parent

AUTH_USER_MODEL = 'app1.User'  # Ensure this points to 'app1.User'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'django_debug.log'),  # Log file path
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'myapp': {  # Replace 'myapp' with your app name
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}