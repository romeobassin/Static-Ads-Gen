import os
from dotenv import load_dotenv
from PIL import Image
import io
import base64
from openai import OpenAI

load_dotenv()

def read_img(image_data, template):
    """
    Analyze an image and generate ad text based on the template
    """
    try:
        # Convert image data to PIL Image
        if isinstance(image_data, bytes):
            image = Image.open(io.BytesIO(image_data))
        else:
            image = Image.open(image_data)
        
        # For now, return a placeholder description
        # In a real implementation, you would:
        # 1. Use OpenAI's Vision API to analyze the image
        # 2. Generate appropriate ad text based on the template
        
        # Placeholder implementation
        if template == "simple_ad":
            return "Amazing product that will change your life! Limited time offer - get yours today!"
        elif template == "discount_ad":
            return "HUGE SALE! 50% OFF everything! Don't miss this incredible deal!"
        elif template == "feature_highlight":
            return "Discover the amazing features that make this product stand out from the rest!"
        else:
            return "Check out this amazing product! You won't believe what it can do!"
            
    except Exception as e:
        raise Exception(f"Error processing image: {str(e)}")

def generate_ad_text_with_openai(image_data, template, prompt):
    """
    Use OpenAI's Vision API to analyze image and generate ad text
    """
    try:
        # Get OpenAI API key
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        
        client = OpenAI(api_key=api_key)
        
        # Convert image to base64 for OpenAI API
        if isinstance(image_data, bytes):
            image_base64 = base64.b64encode(image_data).decode('utf-8')
        else:
            # If it's already a PIL Image, convert to bytes
            img_buffer = io.BytesIO()
            image_data.save(img_buffer, format='PNG')
            image_base64 = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
        
        # Create the prompt based on template
        template_prompts = {
            "simple_ad": "Analyze this image and create a simple, compelling ad description that highlights the main product or service.",
            "discount_ad": "Analyze this image and create an exciting discount advertisement with urgency and special offers.",
            "feature_highlight": "Analyze this image and create an ad that highlights the key features and benefits of the product or service."
        }
        
        system_prompt = template_prompts.get(template, "Analyze this image and create an engaging advertisement.")
        
        response = client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt or "Create an engaging advertisement for this image."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        raise Exception(f"Error generating ad text with OpenAI: {str(e)}")
