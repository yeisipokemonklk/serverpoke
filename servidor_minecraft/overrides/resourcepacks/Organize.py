import os
import zipfile
from collections import defaultdict
from itertools import combinations

# Path to the resourcepacks folder
RESOURCEPACKS_DIR = r"C:\Users\jonat\AppData\Roaming\ModrinthApp\profiles\Cobblemon Expanded (by Jonathan) (4)\resourcepacks"

# Output file path in the same directory as this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "shared_files_between_zips.txt")

# Files to ignore (relative paths inside zip)
IGNORED_FILES = {"pack.mcmeta", "pack.png"}

def list_zip_file_paths(zip_path):
    """Return a set of internal file paths inside the zip file (excluding directories and ignored files)."""
    with zipfile.ZipFile(zip_path, 'r') as z:
        return set(
            f.filename for f in z.infolist()
            if not f.is_dir() and os.path.basename(f.filename) not in IGNORED_FILES
        )

def find_zips_with_shared_files(resourcepacks_dir):
    """Find zip files that share any internal file names (excluding ignored files)."""
    zip_contents = {}
    output_lines = []

    # Read internal file names from all zips
    for filename in os.listdir(resourcepacks_dir):
        if filename.lower().endswith(".zip"):
            zip_path = os.path.join(resourcepacks_dir, filename)
            try:
                file_set = list_zip_file_paths(zip_path)
                zip_contents[filename] = file_set
            except zipfile.BadZipFile:
                warning = f"Warning: Skipping invalid zip file: {filename}"
                print(warning)
                output_lines.append(warning)

    # Compare all zip pairs for shared files
    for zip1, zip2 in combinations(zip_contents, 2):
        shared = zip_contents[zip1] & zip_contents[zip2]
        if shared:
            output_lines.append(f"{zip1} and {zip2} share {len(shared)} file(s):")
            output_lines.extend([f"  - {f}" for f in sorted(shared)])
            output_lines.append("")

    # Write results to file
    if output_lines:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write("\n".join(output_lines))
        print(f"Shared files written to {OUTPUT_FILE}")
    else:
        print("No shared files found among the zip files.")

if __name__ == "__main__":
    find_zips_with_shared_files(RESOURCEPACKS_DIR)
