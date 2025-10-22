import os
import json

images_folder = "images"
output_file = "photos.json"

# List all jpg files
files = [f for f in os.listdir(images_folder) if f.lower().endswith(".jpg")]
files.sort()  # optional: sort alphabetically
files = [f"{images_folder}/{f}" for f in files]

# Save to JSON
with open(output_file, "w") as f:
    json.dump(files, f, indent=2)

print(f"{output_file} generated with {len(files)} images.")
