#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

# Create static directory if it doesn't exist
mkdir -p static

python manage.py collectstatic --no-input
python manage.py migrate
