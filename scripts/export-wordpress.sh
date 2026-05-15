#!/bin/bash

# WordPress Content Export Script
# Uses wp-cli to export content from the production WordPress site
# Server: rouge
# Site Directory: /var/www/acutabovelawncareinc.ca/htdocs/

set -e

EXPORT_DIR="./wordpress-export"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
EXPORT_SUBDIR="$EXPORT_DIR/$TIMESTAMP"

echo "==================================="
echo "WordPress Content Export"
echo "==================================="
echo ""

# Create export directory
mkdir -p "$EXPORT_SUBDIR"
echo "✓ Created export directory: $EXPORT_SUBDIR"

# Export posts and pages
echo ""
echo "Exporting posts and pages..."
ssh rouge "cd /var/www/acutabovelawncareinc.ca/htdocs/ && wp post list --post_type=post,page,service --format=json --allow-root" > "$EXPORT_SUBDIR/posts.json"
echo "✓ Exported posts to posts.json"

# Export media
echo ""
echo "Exporting media library..."
ssh rouge "cd /var/www/acutabovelawncareinc.ca/htdocs/ && wp post list --post_type=attachment --format=json --allow-root" > "$EXPORT_SUBDIR/media.json"
echo "✓ Exported media to media.json"

# Export site options
echo ""
echo "Exporting site options..."
ssh rouge "cd /var/www/acutabovelawncareinc.ca/htdocs/ && wp option get blogname --allow-root" > "$EXPORT_SUBDIR/site-name.txt"
ssh rouge "cd /var/www/acutabovelawncareinc.ca/htdocs/ && wp option get blogdescription --allow-root" > "$EXPORT_SUBDIR/site-description.txt"
ssh rouge "cd /var/www/acutabovelawncareinc.ca/htdocs/ && wp option get admin_email --allow-root" > "$EXPORT_SUBDIR/admin-email.txt"
echo "✓ Exported site options"

# Get post content with full details
echo ""
echo "Exporting detailed post content..."
ssh rouge "cd /var/www/acutabovelawncareinc.ca/htdocs/ && wp post list --post_type=post,page,service --format=json --fields=ID,post_title,post_content,post_excerpt,post_status,post_name,post_date,post_modified,post_type --allow-root" > "$EXPORT_SUBDIR/posts-detailed.json"
echo "✓ Exported detailed posts"

# Get media with full details
echo ""
echo "Exporting detailed media information..."
ssh rouge "cd /var/www/acutabovelawncareinc.ca/htdocs/ && wp post list --post_type=attachment --format=json --fields=ID,post_title,guid,post_mime_type,post_date --allow-root" > "$EXPORT_SUBDIR/media-detailed.json"
echo "✓ Exported detailed media"

# Export taxonomies (categories, tags)
echo ""
echo "Exporting taxonomies..."
ssh rouge "cd /var/www/acutabovelawncareinc.ca/htdocs/ && wp term list category --format=json --allow-root" > "$EXPORT_SUBDIR/categories.json" 2>/dev/null || echo "No categories found"
ssh rouge "cd /var/www/acutabovelawncareinc.ca/htdocs/ && wp term list post_tag --format=json --allow-root" > "$EXPORT_SUBDIR/tags.json" 2>/dev/null || echo "No tags found"
echo "✓ Exported taxonomies"

# Get URL structure information
echo ""
echo "Documenting URL structure..."
ssh rouge "cd /var/www/acutabovelawncareinc.ca/htdocs/ && wp option get permalink_structure --allow-root" > "$EXPORT_SUBDIR/permalink-structure.txt"
ssh rouge "cd /var/www/acutabovelawncareinc.ca/htdocs/ && wp rewrite list --format=json --allow-root" > "$EXPORT_SUBDIR/rewrite-rules.json"
echo "✓ Documented URL structure"

# Create a summary
echo ""
echo "Creating export summary..."
cat > "$EXPORT_SUBDIR/export-summary.txt" << EOF
WordPress Export Summary
========================
Export Date: $(date)
Server: rouge
Site Directory: /var/www/acutabovelawncareinc.ca/htdocs/

Files Exported:
- posts.json: List of all posts
- posts-detailed.json: Detailed post content
- media.json: Media library list
- media-detailed.json: Detailed media information
- categories.json: Category taxonomy
- tags.json: Tag taxonomy
- site-name.txt: Site name
- site-description.txt: Site description
- admin-email.txt: Admin email
- permalink-structure.txt: URL structure
- rewrite-rules.json: Rewrite rules

Next Steps:
1. Review exported data
2. Run: npm run migrate:import
3. Verify content in Sanity CMS
EOF

echo "✓ Created export summary"

# Create symlink to latest export
rm -f "$EXPORT_DIR/latest"
ln -s "$TIMESTAMP" "$EXPORT_DIR/latest"

echo ""
echo "==================================="
echo "Export Complete!"
echo "==================================="
echo ""
echo "Export location: $EXPORT_SUBDIR"
echo "Latest export: $EXPORT_DIR/latest"
echo ""
echo "Next steps:"
echo "1. Review the exported data in $EXPORT_SUBDIR"
echo "2. Run: npm run migrate:import"
echo ""
