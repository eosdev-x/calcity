#!/bin/bash
# Generate CalCity images via Imagen 4.0 (16:9 aspect, photorealistic)

API_KEY="$(grep NANO_BANANA_API_KEY ~/.openclaw/workspace/.env | cut -d= -f2)"
ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}"
OUTDIR="$(dirname "$0")"

generate_image() {
  local filename="$1"
  local prompt="$2"
  local subdir="$3"
  local outpath="${OUTDIR}/${subdir}/${filename}.png"
  
  if [ -f "$outpath" ]; then
    echo "SKIP: ${subdir}/${filename}.png (exists)"
    return 0
  fi
  
  echo -n "Generating: ${subdir}/${filename}... "
  
  response=$(curl -s -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{
      \"instances\": [{\"prompt\": \"${prompt} Photorealistic photograph, no text, logos, or watermarks.\"}],
      \"parameters\": {\"sampleCount\": 1, \"aspectRatio\": \"16:9\"}
    }")
  
  img_data=$(echo "$response" | jq -r '.predictions[0].bytesBase64Encoded' 2>/dev/null)
  
  if [ -n "$img_data" ] && [ "$img_data" != "null" ]; then
    echo "$img_data" | base64 -d > "$outpath"
    echo "OK ($(du -h "$outpath" | cut -f1))"
  else
    error=$(echo "$response" | jq -r '.error.message // "unknown error"' 2>/dev/null)
    echo "FAIL — $error"
  fi
  
  sleep 3
}

echo "=== BUSINESSES (15) ==="

generate_image "glorias-mexican" \
  "Cozy Mexican restaurant in a small desert town, warm terracotta walls, colorful papel picado banners, plates of enchiladas and tacos on a rustic wooden table, warm inviting lighting." \
  "businesses"

generate_image "green-tea-garden" \
  "Small Chinese restaurant in a desert town, green facade with bamboo accents, steaming dim sum and noodle dishes on a table, warm inviting atmosphere." \
  "businesses"

generate_image "coyote-cafe" \
  "Charming desert cafe with southwestern decor, adobe-style building, outdoor patio seating with string lights, coffee cups and pastries, Mojave Desert backdrop." \
  "businesses"

generate_image "golden-bamboo" \
  "Chinese restaurant interior, golden lighting, bamboo decor, plates of stir-fry and fried rice on a table, warm inviting small-town dining atmosphere." \
  "businesses"

generate_image "ace-hardware" \
  "Small town hardware store exterior, well-organized shelves visible through windows, American small business feel, desert town setting, clean and welcoming storefront." \
  "businesses"

generate_image "cactus-mini-market" \
  "Small desert town convenience store and mini market, neat shelves with groceries, southwestern style, warm sunlight, friendly neighborhood store feel." \
  "businesses"

generate_image "dennis-automotive" \
  "Auto repair shop in a desert town, clean garage bay with a car on a lift, tools organized on wall, professional small-town mechanic shop, clear blue sky." \
  "businesses"

generate_image "beyond-beauty" \
  "Modern hair and nail salon interior, stylish mirrors and styling chairs, warm lighting, clean and elegant small-town beauty salon." \
  "businesses"

generate_image "glenn-dental" \
  "Modern dental office, clean bright reception area with comfortable seating, professional and welcoming healthcare setting, natural light." \
  "businesses"

generate_image "alta-one-credit-union" \
  "Small town credit union exterior, clean professional building, desert landscape background, welcoming entrance, American small-town financial institution." \
  "businesses"

generate_image "cal-city-mx-park" \
  "Motocross park in the Mojave Desert, dirt tracks with jumps, rider on dirt bike mid-air, dusty desert terrain, clear blue sky, exciting action shot." \
  "businesses"

generate_image "tokyo-tuna" \
  "Japanese sushi restaurant, fresh sushi rolls and sashimi beautifully plated on a wooden counter, clean modern interior with wooden accents, warm ambiance." \
  "businesses"

generate_image "desert-rose-realty" \
  "Real estate office in a desert town, beautiful desert home with mountains in background, for-sale sign in front yard, warm golden hour lighting." \
  "businesses"

generate_image "elsys-donuts" \
  "Charming small-town donut shop, display case full of colorful frosted donuts and pastries, warm morning light streaming in, cozy bakery atmosphere." \
  "businesses"

generate_image "cal-city-laundromat" \
  "Clean modern laundromat interior, rows of front-loading washing machines and dryers, bright clean space, well-maintained small-town laundromat." \
  "businesses"

echo ""
echo "=== EVENTS (8) ==="

generate_image "spring-desert-arts-festival" \
  "Outdoor arts festival in the Mojave Desert, colorful art booths and sculptures displayed outdoors, people browsing artwork, Joshua trees in background, beautiful spring day." \
  "events"

generate_image "community-cleanup-earth-day" \
  "Community cleanup event in a desert town, diverse volunteers with trash bags and gloves working together, Earth Day celebration, clear desert sky, feel-good community spirit." \
  "events"

generate_image "desert-food-truck-rally" \
  "Food truck rally in a desert setting, colorful food trucks lined up, people eating and socializing, string lights overhead, desert sunset backdrop, festive atmosphere." \
  "events"

generate_image "mojave-stargazing-night" \
  "Stargazing event in the Mojave Desert at night, telescopes set up on tripods, people looking at a brilliant Milky Way sky, dark desert landscape silhouette, magical night." \
  "events"

generate_image "cal-city-mx-desert-classic" \
  "Motocross race in the Mojave Desert, multiple riders racing on a dirt track, spectators cheering, dust clouds, desert hills in background, exciting motorsport competition." \
  "events"

generate_image "independence-day-fireworks" \
  "Fourth of July fireworks display over a small desert town at night, brilliant red white and blue fireworks exploding in the sky, crowd watching from a park, patriotic celebration." \
  "events"

generate_image "desert-wildflower-walk" \
  "Desert wildflower bloom in the Mojave, vibrant orange poppies and purple wildflowers covering the desert floor, photographers with cameras, beautiful spring morning light." \
  "events"

generate_image "fall-desert-festival" \
  "Fall festival and craft fair in a desert town park, craft booths with handmade goods, pumpkins and autumn decorations, families browsing, warm October desert evening light." \
  "events"

echo ""
echo "=== SUMMARY ==="
echo "Businesses: $(ls ${OUTDIR}/businesses/*.png 2>/dev/null | wc -l)/15"
echo "Events: $(ls ${OUTDIR}/events/*.png 2>/dev/null | wc -l)/8"
echo "Total size: $(du -sh ${OUTDIR}/businesses/ ${OUTDIR}/events/ 2>/dev/null)"
