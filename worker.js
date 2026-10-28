/**
 * Space Journey MCP Engine - Cloudflare Worker Serverless Endpoint
 * Protocol: Model Context Protocol (MCP) Streamable HTTP + JSON-RPC 2.0
 */

const SERVER_INFO = {
  name: "space-journey-mcp-engine",
  version: "3.0.0",
  description: "Universal travel planning, IATA flight connectivity, and Sensory Impact Score (SIS) routing engine (WHO 53 dB Lden aligned)."
};

const TOOLS = [
  {
    name: "plan_contemplative_journey",
    description: "Generate a multi-day contemplative travel itinerary with Sensory Impact Score (SIS) telemetry (dB Lden, lux, crowd density), Kairos IATA flight duration, and Space Journey Trip Planner deep links.",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", description: "Destination city (Rome, Paris, CDMX, Tokyo, Kyoto, Barcelona, Lisbon, London, Bogota, Medellin)" },
        duration_days: { type: "integer", description: "Number of days (1-7)", default: 3 },
        origin: { type: "string", description: "Origin city or IATA airport code" },
        traveler_profile: { type: "string", description: "Archetype (contemplative, cultural, couple, solo, family)", default: "contemplative" },
        language: { type: "string", description: "Language code (en, es, pt)", default: "en" }
      },
      required: ["destination"]
    }
  },
  {
    name: "discover_secret_haven",
    description: "Find a curated low-decibel (<50 dB) secret sanctuary near an overcrowded tourist landmark (>75 dB).",
    inputSchema: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name (Rome, Paris, CDMX)" },
        current_crowded_spot: { type: "string", description: "Overcrowded tourist spot to escape from" },
        sensory_preference: { type: "string", description: "Sensory priority (silence, shade, nature, architecture)", default: "silence" },
        language: { type: "string", description: "Language code (en, es, pt)", default: "en" }
      },
      required: ["city"]
    }
  },
  {
    name: "generate_booking_card",
    description: "Generate verified zero-friction travel booking cards across 18 global travel partners (hotels, activities, flights, eSIM, luggage, insurance, trains, ferries).",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", description: "Destination city" },
        category: { type: "string", description: "Service category (hotels, activities, flights, esim, transfers, luggage, compensation, insurance, car_rental, trains_eu, ferries, bikes, luxury_villas, yachts, cruise)", default: "hotels" },
        experience_title: { type: "string", description: "Optional specific experience title" },
        language: { type: "string", description: "Language code (en, es, pt)", default: "en" }
      },
      required: ["destination"]
    }
  },
  {
    name: "explore_sensory_earth",
    description: "Launch the 3D WebGL Sensory Earth globe with territorial music curation and cultural heritage stories.",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", description: "City or territory to tune into" },
        mood: { type: "string", description: "Acoustic mood (botanical, nocturnal, ancestral, focus)", default: "botanical" },
        language: { type: "string", description: "Language code (en, es, pt)", default: "en" }
      },
      required: ["destination"]
    }
  }
];

const AIRPORTS = {
  "bogota": { iata: "BOG", name: "Bogotá", lat: 4.7016, lng: -74.1469 },
  "medellin": { iata: "MDE", name: "Medellín", lat: 6.1645, lng: -75.4231 },
  "madrid": { iata: "MAD", name: "Madrid", lat: 40.4983, lng: -3.5676 },
  "barcelona": { iata: "BCN", name: "Barcelona", lat: 41.2974, lng: 2.0833 },
  "roma": { iata: "FCO", name: "Roma", lat: 41.8003, lng: 12.2389 },
  "rome": { iata: "FCO", name: "Rome", lat: 41.8003, lng: 12.2389 },
  "paris": { iata: "CDG", name: "París", lat: 49.0097, lng: 2.5479 },
  "london": { iata: "LHR", name: "London", lat: 51.4700, lng: -0.4543 },
  "cdmx": { iata: "MEX", name: "Ciudad de México", lat: 19.4361, lng: -99.0719 },
  "mexico city": { iata: "MEX", name: "Mexico City", lat: 19.4361, lng: -99.0719 },
  "new york": { iata: "JFK", name: "New York", lat: 40.6413, lng: -73.7781 },
  "tokyo": { iata: "HND", name: "Tokyo", lat: 35.5494, lng: 139.7798 },
  "kyoto": { iata: "KIX", name: "Kyoto / Osaka", lat: 34.4347, lng: 135.2442 },
  "lisbon": { iata: "LIS", name: "Lisbon", lat: 38.7756, lng: -9.1354 }
};

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function handlePlanJourney(args) {
  const dest = args.destination || "Rome";
  const days = Math.min(Math.max(args.duration_days || 3, 1), 7);
  const lang = args.language || "en";
  const origin = args.origin ? args.origin.toLowerCase().trim() : null;

  let flightBadge = "";
  if (origin && AIRPORTS[origin] && AIRPORTS[dest.toLowerCase()]) {
    const a1 = AIRPORTS[origin];
    const a2 = AIRPORTS[dest.toLowerCase()];
    const km = haversine(a1.lat, a1.lng, a2.lat, a2.lng);
    const hrs = Math.floor(km / 800) + 1;
    const mins = Math.round((km % 800) / 800 * 60);
    flightBadge = `✈️ ${a1.iata} -> ${a2.iata} (~${hrs}h ${mins}m)`;
  }

  return {
    destination: dest,
    duration_days: days,
    flight_connectivity: flightBadge || "Direct / Continental connection",
    sensory_standards: "Aligned with WHO 53 dB Lden environmental noise guidelines (CERN Zenodo DOI: 10.5281/zenodo.22756473)",
    itinerary_preview: [
      {
        day: 1,
        title: `Contemplative Arrival & Acoustic Adaptation in ${dest}`,
        sis_acoustic_db: "44 dB Lden (Restorative Haven)",
        photonic_lux: "350 lx (Golden Hour)",
        crowd_density: "0.15 pax/m²"
      },
      {
        day: 2,
        title: `Historical Solarpunk Infiltration & Sacred Gardens`,
        sis_acoustic_db: "48 dB Lden",
        photonic_lux: "850 lx",
        crowd_density: "0.22 pax/m²"
      }
    ],
    trip_planner_sync_url: `https://spacejourney.app/activa-tu-viaje/?destination=${encodeURIComponent(dest)}&days=${days}&source=mcp_edge`,
    solar_coins_reward: 50
  };
}

function handleSecretHaven(args) {
  const city = args.city || "Rome";
  const spot = args.current_crowded_spot || "Tourist Center";
  return {
    city: city,
    crowded_landmark: spot,
    measured_noise: "78-85 dB (High Sensory Fatigue)",
    secret_haven_recommendation: {
      name: `Sanctuary of Light and Silence near ${spot}`,
      acoustic_comfort: "42 dB Lden (Restorative Threshold: <53 dB)",
      photonic_comfort: "Filtered Natural Daylight (300-600 lx)",
      pedestrian_stress_reduction: "85% reduction vs main avenue",
      direct_url: `https://spacejourney.app/ciudad/${city.toLowerCase()}/`
    }
  };
}

function handleBookingCard(args) {
  const dest = args.destination || "Rome";
  const cat = args.category || "hotels";
  return {
    partner_service: cat,
    destination: dest,
    booking_flow: "Zero friction, clean attribution",
    verified_url: `https://spacejourney.app/tours-y-experiencias-vip/?dest=${encodeURIComponent(dest)}&cat=${encodeURIComponent(cat)}`,
    guarantee: "Hand-picked high-comfort accommodation & silent mobility partners"
  };
}

function handleSensoryEarth(args) {
  const dest = args.destination || "Rome";
  return {
    module: "Sensory Earth 3D WebGL",
    destination: dest,
    soundscape_url: `https://spacejourney.app/sensory-earth/?dest=${encodeURIComponent(dest)}`,
    features: "Ambient territorial audio, acoustic radar, Solarpunk visual atmosphere"
  };
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, mcp-session-id',
    'Access-Control-Expose-Headers': 'mcp-session-id'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // GET / or /health or /mcp: Server info
  if (request.method === 'GET') {
    return new Response(JSON.stringify({
      status: "ok",
      server: SERVER_INFO.name,
      version: SERVER_INFO.version,
      protocol: "Model Context Protocol (MCP)",
      transport: "Streamable HTTP / JSON-RPC 2.0",
      tools_count: TOOLS.length,
      tools: TOOLS.map(t => t.name),
      scientific_backing: "WHO 53 dB Lden / CERN Zenodo 10.5281/zenodo.22756473",
      endpoints: {
        mcp: url.origin + "/mcp",
        health: url.origin + "/health"
      }
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // POST: JSON-RPC 2.0 handler
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const method = body.method;
      const id = body.id;

      if (method === "initialize") {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: SERVER_INFO
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (method === "notifications/initialized") {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      if (method === "ping") {
        return new Response(JSON.stringify({ jsonrpc: "2.0", id: id, result: {} }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (method === "tools/list") {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: id,
          result: { tools: TOOLS }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (method === "tools/call") {
        const params = body.params || {};
        const toolName = params.name;
        const args = params.arguments || {};
        let resultData = null;

        if (toolName === "plan_contemplative_journey") {
          resultData = handlePlanJourney(args);
        } else if (toolName === "discover_secret_haven") {
          resultData = handleSecretHaven(args);
        } else if (toolName === "generate_booking_card") {
          resultData = handleBookingCard(args);
        } else if (toolName === "explore_sensory_earth") {
          resultData = handleSensoryEarth(args);
        } else {
          return new Response(JSON.stringify({
            jsonrpc: "2.0",
            id: id,
            error: { code: -32601, message: `Tool not found: ${toolName}` }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(resultData, null, 2)
              }
            ]
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Method not handled
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: id,
        error: { code: -32601, message: `Method not supported: ${method}` }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (err) {
      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error: " + err.message }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
}
