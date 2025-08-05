from openai import OpenAI
from dotenv import load_dotenv
import os
import base64
import requests
from typing import Optional, Union
from PIL import Image
import io
from load_template import load_template

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def encode_image_to_base64(image_path: str) -> str:
    """Convert image file to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def encode_pil_image_to_base64(image: Image.Image) -> str:
    """Convert PIL Image to base64 string"""
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    buffer.seek(0)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')


def read_img(image: Union[str, Image.Image, bytes], template: str = "simple_ad"):
    """
    Analyze an image using OpenAI's GPT-4 Vision model with function calling
    
    Args:
        image: Can be a file path (str), PIL Image object, or bytes
        template: Template name for the function schema
    
    Returns:
        str: JSON response from OpenAI function call
    """
    try:
        # Convert image to base64
        if isinstance(image, str):
            # Assume it's a file path
            base64_image = encode_image_to_base64(image)
        elif isinstance(image, Image.Image):
            base64_image = encode_pil_image_to_base64(image)
        elif isinstance(image, bytes):
            base64_image = base64.b64encode(image).decode('utf-8')
        else:
            raise ValueError("Image must be a file path (str), PIL Image, or bytes")
        
        # Load the template schema
        template_schema = load_template(template)
        
        # The template already contains the complete function schema
        # Just pass it directly as the function
        functions = [template_schema]
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert advertising copywriter and visual designer specializing in creating compelling social media advertisements. 

Your task is to analyze product images and generate professional advertising copy with precise positioning, color schemes, and typography that will maximize engagement and conversions.

Key Guidelines:
- Analyze the product/service in the image carefully
- Identify the target audience and their pain points
- Create compelling, benefit-focused copy
- Choose colors that contrast well with the image background
- Position text strategically to avoid covering important product details
- Use appropriate font sizes for visual hierarchy
- Ensure all text is readable and accessible

Return only the JSON response matching the exact schema provided."""
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"""Analyze this image and create a professional {template.replace('_', ' ')} advertisement.

IMPORTANT INSTRUCTIONS:
1. CAREFULLY EXAMINE the product/service, brand, colors, and composition in the image
2. IDENTIFY the target audience and their needs
3. CREATE compelling copy that highlights key benefits and features
4. POSITION text strategically:
   - Avoid covering the main product/service
   - Use empty spaces or areas with simple backgrounds
   - Ensure good contrast with background colors
5. CHOOSE appropriate colors:
   - Use high-contrast colors for readability
   - Consider the image's color palette
   - Use white/light colors on dark backgrounds
   - Use dark colors on light backgrounds
6. SET font sizes for visual hierarchy:
   - Headlines: 24-32px for impact
   - Subheadlines: 18-24px for support
   - Body text: 14-18px for details
   - CTAs: 20-24px for action

TEMPLATE: {template.replace('_', ' ').title()}
- Create engaging, benefit-focused copy
- Use persuasive language that drives action
- Include specific details about the product/service
- Make the offer compelling and urgent where applicable

Return the JSON with precise positioning coordinates (x, y), appropriate colors, and font sizes that will create a professional, conversion-focused advertisement."""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            functions=functions,
            function_call={"name": template_schema["name"]},
            max_tokens=1000,
            temperature=0.7
        )
        
        # Return the function call arguments as JSON string
        if response.choices[0].message.function_call:
            return response.choices[0].message.function_call.arguments
        else:
            return response.choices[0].message.content
    
    except Exception as e:
        return f"Error analyzing image: {str(e)}"






