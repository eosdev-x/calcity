#!/bin/bash
# Upload all images to Supabase storage and update DB records

SUPABASE_URL="https://mbazrezahuojknfgcwou.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="$(grep SUPABASE_SERVICE_ROLE_KEY ~/.openclaw/workspace/calcity/.dev.vars | cut -d= -f2)"
ANON_KEY="$(grep VITE_SUPABASE_ANON_KEY ~/.openclaw/workspace/calcity/.env | cut -d= -f2)"
OUTDIR="$(dirname "$0")"
STORAGE_BASE="${SUPABASE_URL}/storage/v1/object/public/site-images"

upload_file() {
  local filepath="$1"
  local storage_path="$2"
  
  # Use upsert header to overwrite if exists
  result=$(curl -s -X POST "${SUPABASE_URL}/storage/v1/object/site-images/${storage_path}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Content-Type: image/png" \
    -H "x-upsert: true" \
    -T "$filepath")
  
  key=$(echo "$result" | jq -r '.Key // empty' 2>/dev/null)
  if [ -n "$key" ]; then
    echo "  ✅ ${storage_path}"
    return 0
  else
    echo "  ❌ ${storage_path}: $result"
    return 1
  fi
}

update_business_image() {
  local name="$1"
  local image_url="$2"
  
  # URL-encode the name for the filter
  encoded_name=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${name}'))")
  
  result=$(curl -s -X PATCH "${SUPABASE_URL}/rest/v1/businesses?name=eq.${encoded_name}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "apikey: ${ANON_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d "{\"image\": \"${image_url}\"}" \
    -w "\n%{http_code}")
  
  code=$(echo "$result" | tail -1)
  if [ "$code" = "204" ]; then
    echo "  ✅ DB: ${name}"
  else
    echo "  ❌ DB: ${name} (HTTP ${code})"
  fi
}

update_event_image() {
  local title="$1"
  local image_url="$2"
  
  encoded_title=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${title}'))")
  
  result=$(curl -s -X PATCH "${SUPABASE_URL}/rest/v1/events?title=eq.${encoded_title}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "apikey: ${ANON_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d "{\"image\": \"${image_url}\"}" \
    -w "\n%{http_code}")
  
  code=$(echo "$result" | tail -1)
  if [ "$code" = "204" ]; then
    echo "  ✅ DB: ${title}"
  else
    echo "  ❌ DB: ${title} (HTTP ${code})"
  fi
}

echo "=== UPLOADING BUSINESS IMAGES ==="
for f in ${OUTDIR}/businesses/*.png; do
  fname=$(basename "$f")
  upload_file "$f" "businesses/${fname}"
done

echo ""
echo "=== UPLOADING EVENT IMAGES ==="
for f in ${OUTDIR}/events/*.png; do
  fname=$(basename "$f")
  upload_file "$f" "events/${fname}"
done

echo ""
echo "=== UPDATING BUSINESS DB RECORDS ==="
update_business_image "Gloria's Mexican Restaurant" "${STORAGE_BASE}/businesses/glorias-mexican.png"
update_business_image "Green Tea Garden" "${STORAGE_BASE}/businesses/green-tea-garden.png"
update_business_image "Coyote Cafe" "${STORAGE_BASE}/businesses/coyote-cafe.png"
update_business_image "Golden Bamboo" "${STORAGE_BASE}/businesses/golden-bamboo.png"
update_business_image "ACE Hardware Store" "${STORAGE_BASE}/businesses/ace-hardware.png"
update_business_image "Cactus Mini Market" "${STORAGE_BASE}/businesses/cactus-mini-market.png"
update_business_image "Dennis Automotive & Towing" "${STORAGE_BASE}/businesses/dennis-automotive.png"
update_business_image "Beyond Beauty Salon & Spa" "${STORAGE_BASE}/businesses/beyond-beauty.png"
update_business_image "Glenn Dental" "${STORAGE_BASE}/businesses/glenn-dental.png"
update_business_image "Alta One Federal Credit Union" "${STORAGE_BASE}/businesses/alta-one-credit-union.png"
update_business_image "Cal City MX Park" "${STORAGE_BASE}/businesses/cal-city-mx-park.png"
update_business_image "Tokyo Tuna Restaurant" "${STORAGE_BASE}/businesses/tokyo-tuna.png"
update_business_image "Desert Rose Realty" "${STORAGE_BASE}/businesses/desert-rose-realty.png"
update_business_image "Elsy's Donuts & Bakery" "${STORAGE_BASE}/businesses/elsys-donuts.png"
update_business_image "Cal City Laundromat" "${STORAGE_BASE}/businesses/cal-city-laundromat.png"

echo ""
echo "=== UPDATING EVENT DB RECORDS ==="
update_event_image "Spring Desert Arts Festival" "${STORAGE_BASE}/events/spring-desert-arts-festival.png"
update_event_image "Community Cleanup & Earth Day Celebration" "${STORAGE_BASE}/events/community-cleanup-earth-day.png"
update_event_image "Desert Food Truck Rally" "${STORAGE_BASE}/events/desert-food-truck-rally.png"
update_event_image "Mojave Stargazing Night" "${STORAGE_BASE}/events/mojave-stargazing-night.png"
update_event_image "Cal City MX Desert Classic" "${STORAGE_BASE}/events/cal-city-mx-desert-classic.png"
update_event_image "Independence Day Celebration & Fireworks" "${STORAGE_BASE}/events/independence-day-fireworks.png"
update_event_image "Desert Wildflower Photography Walk" "${STORAGE_BASE}/events/desert-wildflower-walk.png"
update_event_image "Fall Desert Festival & Craft Fair" "${STORAGE_BASE}/events/fall-desert-festival.png"

echo ""
echo "=== DONE ==="
