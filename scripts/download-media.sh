#!/bin/bash

# WordPress Media Download Script
# Downloads all media files from the WordPress uploads directory

set -e

EXPORT_DIR="./wordpress-export/latest"
MEDIA_DIR="$EXPORT_DIR/media-files"
SEP="==================================="

echo "$SEP"
echo "WordPress Media Download"
echo "$SEP"
echo ""

# Check if export exists
if [[ ! -d "$EXPORT_DIR" ]]; then
  echo "Error: Export directory not found. Run npm run migrate:export first." >&2
  exit 1
fi

# Create media directory
mkdir -p "$MEDIA_DIR"
echo "✓ Created media directory: $MEDIA_DIR"

# Download media files using rsync
echo ""
echo "Downloading media files from server..."
echo "This may take a while depending on the number of files..."
echo ""

rsync -avz --progress \
  rouge:/var/www/acutabovelawncareinc.ca/htdocs/wp-content/uploads/ \
  "$MEDIA_DIR/"

echo ""
echo "$SEP"
echo "Media Download Complete!"
echo "$SEP"
echo ""
echo "Media location: $MEDIA_DIR"
echo ""
echo "Next steps:"
echo "1. Review downloaded media files"
echo "2. Run: npm run migrate:import"
echo ""
