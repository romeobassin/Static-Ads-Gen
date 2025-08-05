from PIL import Image, ImageDraw, ImageFont
import json
import base64
from io import BytesIO
from text_gen import read_img, encode_pil_image_to_base64
import os


def compose_image(image_input, template):
    """
    Compose image with text overlay
    image_input can be either base64 string or file path
    """
    try:
        # Get AI description
        json_str = read_img(image_input, template)
        print(f"AI Response type: {type(json_str)}")
        print(f"AI Response: {json_str}")
        
        # Try to parse as JSON
        try:
            description = json.loads(json_str)
            print("Successfully parsed JSON")
        except json.JSONDecodeError as e:
            print(f"JSON parsing failed: {e}")
            print("Using raw string as description")
            # If JSON parsing fails, use the raw string
            description = {"headline": {"text": json_str, "position": {"x": 10, "y": 10}, "color": "#FFFFFF", "font_size": 24}}
        
        # Load the image
        if os.path.exists(image_input):
            # It's a file path
            image = Image.open(image_input)
        else:
            # It's a base64 string - we need to decode it first
            image_data = base64.b64decode(image_input)
            image = Image.open(BytesIO(image_data))
        
        # Create a copy for drawing
        img_with_text = image.copy()
        draw = ImageDraw.Draw(img_with_text)
        
        # Process each text element in the description
        for key, val in description.items():
            if key == "id":
                continue  # Skip the template ID
            
            # Check if this is a text element with required properties
            if not isinstance(val, dict) or "text" not in val or "position" not in val:
                continue
            
            # Get text properties
            text = val.get("text", "")
            position = val.get("position", {})
            color = val.get("color", "#FFFFFF")
            font_size = val.get("font_size", 20)
            
            # Skip if no text or invalid position
            if not text or not position or "x" not in position or "y" not in position:
                continue
            
            # Load font
            try:
                font = ImageFont.truetype("arial.ttf", font_size)
            except (ValueError, OSError):
                try:
                    # Try alternative fonts
                    font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", font_size)
                except (ValueError, OSError):
                    print(f"Could not load font for size {font_size}, using default")
                    font = ImageFont.load_default()
            
            # Draw text
            pos = (position["x"], position["y"])
            draw.text(pos, text, font=font, fill=color)
            print(f"Added text '{text}' at position {pos} with color {color} and size {font_size}")
        
        # Save the composed image
        img_with_text.save("composed_image.png")
        print("Composed image saved as 'composed_image.png'")
        
        return img_with_text
        
    except Exception as e:
        print(f"Error composing image: {e}")
        import traceback
        traceback.print_exc()
        return None


# Test the function
if __name__ == "__main__":
    # Use raw string to avoid escape sequence issues
    image_path = r".\imgs\S6d19f0facf734d3aaf771b4734d36611c.webp"
    
    result = compose_image(image_path, "discount_ad")
    if result:
        print("Image composition completed successfully!")
    else:
        print("Image composition failed!")



