#!/bin/bash
# Generate CalCity business and event images via Nano Banana (Gemini Imagen)
# 800x400 (2:1 aspect ratio) for card display

API_KEY="$(grep NANO_BANANA_API_KEY ~/.openclaw/workspace/.env | cut -d= -f2)"
MODEL="gemini-2.0-flash-exp-image-generation"
ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}"
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
  
  echo "Generating: ${subdir}/${filename}..."
  
  response=$(curl -s -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{
      \"contents\": [{
        \"parts\": [{
          \"text\": \"Generate a photorealistic image, 800x400 pixels (wide landscape 2:1 ratio). ${prompt}. No text, logos, or watermarks.\"
        }]
      }],
      \"generationConfig\": {
        \"responseModalities\": [\"TEXT\", \"IMAGE\"]
      }
    }")
  
  # Extract base64 image data
  img_data=$(echo "$response" | jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' 2>/dev/null)
  
  if [ -n "$img_data" ] && [ "$img_data" != "null" ]; then
    echo "$img_data" | base64 -d > "$outpath"
    echo "OK: ${subdir}/${filename}.png ($(stat -c%s "$outpath") bytes)"
  else
    error=$(echo "$response" | jq -r '.error.message // .candidates[0].content.parts[0].text // "unknown error"' 2>/dev/null)
    echo "FAIL: ${subdir}/${filename} — $error"
  fi
  
  # Rate limit: ~2s between requests
  sleep 2
}

echo "=== BUSINESSES (15) ==="

generate_image "glorias-mexican" \
  "Cozy Mexican restaurant in a small desert town, warm terracotta walls, colorful papel picado banners, plates of enchiladas and tacos on a rustic wooden table, inviting warm lighting" \
  "businesses"

generate_image "green-tea-garden" \
  "Small Chinese restaurant in a desert town, green facade with bamboo accents, steaming dim sum and noodle dishes on a table, warm inviting atmosphere" \
  "businesses"

generate_image "coyote-cafe" \
  "Charming desert cafe with southwestern decor, adobe-style building, outdoor patio seating with string lights, coffee cups and pastries, Mojave Desert backdrop" \
  "businesses"

generate_image "golden-bamboo" \
  "Chinese restaurant interior, golden lighting, bamboo decor, plates of stir-fry and fried rice on a table, warm inviting small-town dining atmosphere" \
  "businesses"

generate_image "ace-hardware" \
  "Small town hardware store exterior, well-organized shelves visible through windows, American small business feel, desert town setting, clean and welcoming" \
  "businesses"

generate_image "cactus-mini-market" \
  "Small desert town convenience store/mini market, neat shelves with groceries, cactus-themed signage, warm sunlight, friendly neighborhood store feel" \
  "businesses"

generate_image "dennis-automotive" \
  "Auto repair shop in a desert town, clean garage bay with a car on a lift, tools organized on wall, professional small-town mechanic shop, clear sky" \
  "businesses"

generate_image "beyond-beauty" \
  "Modern hair and nail salon interior, stylish mirrors and chairs, warm lighting, clean and elegant small-town beauty salon, desert town charm" \
  "businesses"

generate_image "glenn-dental" \
  "Modern dental office interior, clean bright reception area, comfortable dental chair, professional and welcoming healthcare setting" \
  "businesses"

generate_image "alta-one-credit-union" \
  "Small town credit union/bank exterior, clean professional building, desert landscape, welcoming entrance, American small-town financial institution" \
  "businesses"

generate_image "cal-city-mx-park" \
  "Motocross park in the Mojave Desert, dirt tracks with jumps, riders on dirt bikes mid-air, dusty desert terrain, clear blue sky, exciting action shot" \
  "businesses"

generate_image "tokyo-tuna" \
  "Japanese sushi restaurant, fresh sushi rolls and sashimi beautifully plated, clean modern interior with wooden accents, warm ambiance" \
  "businesses"

generate_image "desert-rose-realty" \
  "Real estate office in a desert town, beautiful desert homes displayed in window, Mojave Desert landscape, for-sale sign, professional small-town office" \
  "businesses"

generate_image "elsys-donuts" \
  "Charming small-town donut and bakery shop, display case full of colorful donuts and pastries, warm morning light, cozy bakery atmosphere" \
  "businesses"

generate_image "cal-city-laundromat" \
  "Clean modern laundromat interior, rows of washing machines and dryers, bright fluorescent lighting, well-maintained small-town laundromat" \
  "businesses"

echo ""
echo "=== EVENTS (8) ==="

generate_image "spring-desert-arts-festival" \
  "Outdoor arts festival in the Mojave Desert, colorful art booths and sculptures, people browsing artwork, Joshua trees in background, spring day, vibrant community event" \
  "events"

generate_image "community-cleanup-earth-day" \
  "Community cleanup event in a desert town, volunteers with trash bags and gloves, Earth Day banners, families working together, clear desert sky, feel-good community spirit" \
  "events"

generate_image "desert-food-truck-rally" \
  "Food truck rally in a desert parking lot, colorful food trucks lined up, people eating and socializing, string lights, desert sunset backdrop, festive atmosphere" \
  "events"

generate_image "mojave-stargazing-night" \
  "Stargazing event in the Mojave Desert at night, telescopes set up, people looking at a brilliant Milky Way sky, dark desert landscape, magical night sky photography feel" \
  "events"

generate_image "cal-city-mx-desert-classic" \
  "Motocross race in the Mojave Desert, riders racing on a dirt track, spectators cheering, dust clouds, desert hills in background, exciting motorsport competition" \
  "events"

generate_image "independence-day-fireworks" \
  "Fourth of July fireworks display over a small desert town, brilliant red white and blue fireworks in the night sky, crowd watching from a park, patriotic celebration" \
  "events"

generate_image "desert-wildflower-walk" \
  "Desert wildflower bloom in the Mojave, vibrant orange poppies and purple wildflowers covering the desert floor, photographers with cameras, spring morning, stunning natural beauty" \
  "events"

generate_image "fall-desert-festival" \
  "Fall festival and craft fair in a desert town park, craft booths with handmade goods, pumpkins and autumn decorations, families browsing, warm October desert evening" \
  "events"

echo ""
echo "=== DONE ==="
ls -la ${OUTDIR}/businesses/ ${OUTDIR}/events/
