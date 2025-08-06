import cloudinary
import cloudinary.uploader
import cloudinary.api
from cloudinary.utils import cloudinary_url

# Configuration       
cloudinary.config( 
    cloud_name = "daqbyznrz", 
    api_key = "183211329933457", 
    api_secret = "YtwxNbJpTMPPTOKiSAWEqVh6JFs", # Click 'View API Keys' above to copy your API secret
    secure=True
)

def upload_image_to_cloudinary(image, folder, public_id):
        cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
                                    folder="static_ads_gen",
                                    public_id="simple_ad_generated2",
                                    use_filename=True,
                                    unique_filename=False,
                                    )

def pull_all_from_cloudinary():
        result = cloudinary.api.resources(

                                    max_results=10,
                                    type="upload",
                                    prefix="static_ads_gen/",
                                    )
        for resource in result['resources']:
            print(resource['public_id'])
            print(resource['secure_url'])

def pull_one_from_cloudinary(public_id):
    url, options = cloudinary_url(public_id, format="png")
    return url




