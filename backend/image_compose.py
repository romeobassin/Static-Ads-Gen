import replicate
import os
from dotenv import load_dotenv
from PIL import Image
import requests
import io
from openai import OpenAI
from load_template import load_template
import base64

load_dotenv()

# Set the API token - this is the easiest way to authorize
os.environ["REPLICATE_API_TOKEN"] = os.getenv("REPLICATE_API_TOKEN")
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

# Check if API token is set
if not os.getenv("REPLICATE_API_TOKEN"):
    raise ValueError("REPLICATE_API_TOKEN environment variable is not set")

if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY environment variable is not set")

def generate_image_description(image_input, template="simple_ad"):
    """
    Generate a description for an image using OpenAI Vision API
    Supports base64, local file path, or URL
    Returns formatted text based on template structure
    """
    client = OpenAI()

    template_data = load_template(template)
    
    # Determine the type of image input and convert to base64
    if isinstance(image_input, str):
        if image_input.startswith('http'):
            # URL - download and convert to base64
            response = requests.get(image_input)
            image_base64 = base64.b64encode(response.content).decode('utf-8')
        elif os.path.exists(image_input):
            # Local file path
            with open(image_input, 'rb') as image_file:
                image_base64 = base64.b64encode(image_file.read()).decode('utf-8')
        else:
            # Assume it's already base64
            image_base64 = image_input
    elif isinstance(image_input, bytes):
        # Raw bytes - convert to base64
        image_base64 = base64.b64encode(image_input).decode('utf-8')
    else:
        raise ValueError("Unsupported image input type")
    
    # Get template structure
    template_name = template_data["name"]
    template_properties = template_data["parameters"]["properties"]
    required_fields = template_data["parameters"]["required"]
    
    # Create template-specific prompt based on the template structure
    if template == "simple_ad":
        system_prompt = "Analyze this image and generate a prompt instruction for adding text overlay. Return ONLY a prompt like: 'DONT CHANGE THE IMAGE, ONLY OVERLAY THIS IMAGE with HEADER which says: \"[headline]\", THEN SUBHEADLINE which says: \"[subheadline]\", and lastly CTA that says: \"[cta]\"'"
    elif template == "discount_ad":
        system_prompt = "Analyze this image and generate a prompt instruction for adding text overlay. Return ONLY a prompt like: 'DONT CHANGE THE IMAGE, ONLY OVERLAY THIS IMAGE with HEADER which says: \"[headline]\", THEN DISCOUNT which says: \"[discount]\", THEN VALIDITY which says: \"[valid_until]\", and lastly CTA that says: \"[cta]\"'"
    elif template == "feature_highlight":
        system_prompt = "Analyze this image and generate a prompt instruction for adding text overlay. Return ONLY a prompt like: 'DONT CHANGE THE IMAGE, ONLY OVERLAY THIS IMAGE with HEADER which says: \"[headline]\", THEN TWO BULLET POINTS which say: \"[feature1]\", \"[feature2]\", and lastly CTA that says: \"[cta]\"'"
    else:
        system_prompt = f"Analyze this image and generate a prompt instruction for adding text overlay that follows this template structure: {required_fields}"
    
    # Single API call to analyze image and generate ad text
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
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
                        "text": "Generate a prompt instruction for adding text overlay to this image. The prompt should tell an AI image model exactly what text to add and where."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}"
                        }
                    }
                ]
            }
        ],
        max_tokens=400
    )
    
    return response.choices[0].message.content

def generate_image_with_qwen(template, reference_image,static_template):
    """
    Generate an image using Flux Kontext Max via Replicate
    Can optionally provide a reference image for style/context
    """
    static_ad = static_template
    input_data = {
        "prompt": "Combine this two pics into a static ad, use the second image as a template, and use the first image as a product image",
        "quality": "auto",
        "background": "auto",
        "moderation": "auto",
        "aspect_ratio": "1:1",
        "input_images": [reference_image,static_ad],
        "output_format": "jpeg",
        "openai_api_key": os.getenv("OPENAI_API_KEY"),
        "number_of_images": 1,
        "output_compression": 90

            
    }
        
        # Call Flux Kontext Max
    print("🔄 Calling Replicate API...")
    output = replicate.run(
        "openai/gpt-image-1",
        input=input_data
    )
    
    print(f"📦 Output type: {type(output)}")
    print(f"📦 Output content: {output}")
    
    # Handle the FileOutput object
    if isinstance(output, list) and len(output) > 0:
        # Download the first image
        image_url = output[0]
        print(f"🖼️ Downloading from URL: {image_url}")
        response = requests.get(image_url)
        image = Image.open(io.BytesIO(response.content))
        print(f"✅ Image downloaded successfully: {image.size}")
        return image
    else:
        # Single image
        print(f"🖼️ Downloading from URL: {output}")
        response = requests.get(output)
        image = Image.open(io.BytesIO(response.content))
        print(f"✅ Image downloaded successfully: {image.size}")
        return image   
       
        
        
    


