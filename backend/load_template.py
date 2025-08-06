import json
import os

def load_template(template_name: str) -> dict:
    template_path = os.path.join("templates", f"{template_name}.json")
    with open(template_path, "r", encoding="utf-8") as f:
        return json.load(f)

