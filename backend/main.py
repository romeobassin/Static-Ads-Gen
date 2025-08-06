from image_compose import generate_image_with_qwen
from cloud import pull_one_from_cloudinary


stat= pull_one_from_cloudinary("pink-white")
print(f"Static template URL: {stat}")

imagen = generate_image_with_qwen("simple_ad","https://cdn.webshopapp.com/shops/14594/files/437213178/image.jpg",stat)
imagen.save("generated_ad_image.jpg")
print("✅ Image generated and saved successfully!")
