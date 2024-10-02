import os
from django.core.management.base import BaseCommand
from cloudinary.uploader import upload
from api.models import WorkoutChallenge
from PIL import Image
import io

def compress_image(image_path, max_size_mb=9):
    img = Image.open(image_path)
    img_byte_arr = io.BytesIO()

    # Start with original quality
    quality = 95
    img.save(img_byte_arr, format='JPEG', quality=quality, optimize=True)

    # Gradually reduce quality until file size is under the limit
    while img_byte_arr.tell() > max_size_mb * 1024 * 1024 and quality > 20:
        img_byte_arr = io.BytesIO()
        quality -= 5
        img.save(img_byte_arr, format='JPEG', quality=quality, optimize=True)

    img_byte_arr.seek(0)
    return img_byte_arr

class Command(BaseCommand):
    help = 'Upload challenge images to Cloudinary'

    def handle(self, *args, **options):
        image_dir = '/home/shravan/exercise_tracker_project/frontend/public/images'
        image_files = [
            'bodyweight-challenge.jpg',
            'cardio-challenge.jpg',
            'strength-challenge.jpg',
            'plyometric-challenge.jpg',
            'flexibility-challenge.jpg'
        ]

        for image_file in image_files:
            file_path = os.path.join(image_dir, image_file)
            if os.path.exists(file_path):
                # Compress the image
                compressed_image = compress_image(file_path)

                # Upload the compressed image
                result = upload(compressed_image, folder="workout_challenges", filename=image_file)

                challenge_name = image_file.split('-challenge.jpg')[0].capitalize()
                challenge = WorkoutChallenge.objects.filter(name__icontains=challenge_name).first()
                if challenge:
                    challenge.image_url = result['secure_url']
                    challenge.save()
                    self.stdout.write(self.style.SUCCESS(f'Successfully uploaded and updated {image_file}'))
                else:
                    self.stdout.write(self.style.WARNING(f'No matching challenge found for {image_file}'))
            else:
                self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
