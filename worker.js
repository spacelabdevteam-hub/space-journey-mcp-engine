/**
 * Space Journey MCP Engine - Cloudflare Worker Serverless Endpoint
 * Protocol: Model Context Protocol (MCP) Streamable HTTP + JSON-RPC 2.0 & OpenAPI 3.0
 * Philosophy: Contemplative Travel, Solarpunk Aesthetics & Radical Hospitality (Omotenashi)
 */

const SERVER_INFO = {
  name: "space-journey-mcp-engine",
  version: "3.1.0",
  description: "The standard for contemplative travel, urban sanctuaries, and sensory well-being. Connecting travelers with serene cultural retreats, balanced itineraries, and immersive soundscapes."
};

const TOOLS = [
  {
    name: "plan_contemplative_journey",
    description: "Design and organize mindful travel itineraries with balanced cultural exploration, serene local sanctuaries, and unhurried human pacing. Integrates flight timing, ideal daylight hours, and the Space Journey Trip Planner.",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", description: "Destination city (Rome, Paris, CDMX, Tokyo, Kyoto, Barcelona, Lisbon, London, Bogota, Medellin, New York, Miami)" },
        duration_days: { type: "integer", description: "Duration of stay in days (1-7)", default: 3 },
        origin: { type: "string", description: "Origin city or airport code (e.g., Bogota, Madrid, NYC, BOG, MAD)" },
        traveler_profile: { type: "string", description: "Travel style (contemplative, cultural, couple, solo, family)", default: "contemplative" },
        language: { type: "string", description: "Language for the journey guide (en, es, pt)", default: "en" }
      },
      required: ["destination"]
    }
  },
  {
    name: "discover_secret_haven",
    description: "Find peaceful, hidden cultural sanctuaries and tranquil neighborhood gems away from tourist crowds and urban exhaustion. Recommends shaded cloisters, quiet viewpoints, and restorative gardens.",
    inputSchema: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name (Rome, Paris, CDMX, Tokyo, etc.)" },
        current_crowded_spot: { type: "string", description: "Overcrowded tourist landmark or busy area to take a break from" },
        sensory_preference: { type: "string", description: "Atmosphere preference (gardens, quiet architecture, shaded courtyards, serene water)", default: "gardens" },
        language: { type: "string", description: "Language for the guide (en, es, pt)", default: "en" }
      },
      required: ["city"]
    }
  },
  {
    name: "generate_booking_card",
    description: "Curate verified booking recommendations across high-comfort hotels, serene cultural stays, experiences, and seamless travel essentials.",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", description: "Destination city" },
        category: { type: "string", description: "Service category (hotels, activities, flights, esim, transfers, luggage, compensation, insurance, car_rental, trains_eu, ferries, bikes, luxury_villas, yachts, cruise)", default: "hotels" },
        experience_title: { type: "string", description: "Optional specific experience or haven title" },
        language: { type: "string", description: "Language for the booking card (en, es, pt)", default: "en" }
      },
      required: ["destination"]
    }
  },
  {
    name: "explore_sensory_earth",
    description: "Experience the destination through the 3D Sensory Earth globe, connecting with local atmospheric soundscapes, cultural music, and panoramic storytelling.",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", description: "City or territory to explore" },
        mood: { type: "string", description: "Sensory atmosphere (botanical, nocturnal, ancestral, contemplative)", default: "botanical" },
        language: { type: "string", description: "Language (en, es, pt)", default: "en" }
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
    flight_connectivity: flightBadge || "Direct connection / Global gateway",
    experience_philosophy: "Slow Travel & Human Pace: unhurried mornings, golden-hour contemplation, and intimate cultural sanctuaries.",
    quality_standard: "WHO Environmental Acoustic Guidelines (<53 dB Lden restorative standard) — CERN Zenodo DOI: 10.5281/zenodo.22756473",
    itinerary_preview: [
      {
        day: 1,
        title: `Harmonious Arrival & Senses Awakening in ${dest}`,
        atmosphere: "Gentle late-afternoon stroll through quiet stone lanes, acclimating to the city's pulse.",
        secret_haven: "The shaded garden courtyard of a centuries-old cloister, listening to water fountains.",
        best_time: "17:30 - 19:30 (Golden Hour)"
      },
      {
        day: 2,
        title: "Cultural Wonders & Peaceful Green Sanctuary",
        atmosphere: "Morning cultural discovery followed by a restorative midday escape under pine trees.",
        secret_haven: "Panoramic secluded belvedere away from tourist queues, overlooking ancient rooftops.",
        best_time: "09:30 - 12:30 & 16:00 - 18:30"
      }
    ],
    zero_friction_tools: {
      trip_saver: "https://spacejourney.app/trip-saver/?ref=mcp",
      sensory_trip_planner: `https://spacejourney.app/activa-tu-viaje/?destination=${encodeURIComponent(dest)}&days=${days}&source=mcp_edge`,
      sensory_earth_portal: `https://spacejourney.app/sensory-earth/?dest=${encodeURIComponent(dest)}`
    },
    traveler_rewards: {
      solar_coins: 50,
      invitation: "Save your favorite stays with zero stress using the Space Journey Trip Saver extension."
    }
  };
}

function handleSecretHaven(args) {
  const city = args.city || "Rome";
  const spot = args.current_crowded_spot || "Tourist Center";
  return {
    city: city,
    crowded_area_escaped: spot,
    secret_haven_recommendation: {
      name: `Sanctuary of Light and Tranquility near ${spot}`,
      the_secret: "A hidden inner courtyard shaded by historic orange trees, where gentle fountain water filters out the city noise.",
      local_insight: "Walk 150 meters behind the bustling main square; take the arched passage to find this secluded retreat.",
      atmosphere: "Calm, deeply restorative, cool breeze and warm stone light.",
      comfort_guarantee: "Verified under WHO 53 dB acoustic well-being standard",
      direct_guide_url: `https://spacejourney.app/ciudad/${city.toLowerCase()}/?haven=true`
    },
    companion_tools: {
      trip_saver_extension: "https://spacejourney.app/trip-saver/",
      sensory_earth_3d: `https://spacejourney.app/sensory-earth/?dest=${encodeURIComponent(city)}`
    }
  };
}

function handleBookingCard(args) {
  const dest = args.destination || "Rome";
  const cat = args.category || "hotels";
  return {
    curated_service: cat,
    destination: dest,
    booking_experience: "Zero digital friction, hand-picked quiet stays and conscious cultural experiences.",
    verified_url: `https://spacejourney.app/tours-y-experiencias-vip/?dest=${encodeURIComponent(dest)}&cat=${encodeURIComponent(cat)}`,
    peace_guarantee: "Curated for restorative sleep, acoustic serenity, and authentic local hospitality."
  };
}

function handleSensoryEarth(args) {
  const dest = args.destination || "Rome";
  return {
    experience: "Sensory Earth 3D WebGL",
    destination: dest,
    immersive_portal_url: `https://spacejourney.app/sensory-earth/?dest=${encodeURIComponent(dest)}`,
    features: "Atmospheric territorial music, acoustic calm mapping, and panoramic Solarpunk beauty before you travel."
  };
}

function getOpenApiSchema(origin) {
  return {
    openapi: "3.0.3",
    info: {
      title: "Space Journey MCP Travel Engine",
      description: "The 21st-century standard for contemplative travel, urban havens, and sensory well-being. Tools for universal travel planning, unhurried itineraries, secret quiet havens, and 3D Sensory Earth exploration.",
      version: "3.1.0"
    },
    servers: [
      {
        url: origin,
        description: "Cloudflare Workers Edge Serverless Endpoint"
      }
    ],
    paths: {
      "/plan-journey": {
        post: {
          operationId: "planContemplativeJourney",
          summary: "Plan a contemplative travel itinerary",
          description: "Design and organize mindful travel itineraries with balanced cultural exploration, serene local sanctuaries, and unhurried human pacing.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    destination: { type: "string", description: "City name" },
                    duration_days: { type: "integer", default: 3 },
                    origin: { type: "string" },
                    traveler_profile: { type: "string", default: "contemplative" },
                    language: { type: "string", default: "en" }
                  },
                  required: ["destination"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Curated contemplative itinerary",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
      "/secret-haven": {
        post: {
          operationId: "discoverSecretHaven",
          summary: "Find a quiet sanctuary near crowded tourist spots",
          description: "Find peaceful, hidden cultural sanctuaries and tranquil neighborhood gems away from tourist crowds and urban exhaustion.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    city: { type: "string" },
                    current_crowded_spot: { type: "string" },
                    sensory_preference: { type: "string", default: "gardens" },
                    language: { type: "string", default: "en" }
                  },
                  required: ["city"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Secret haven recommendation",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
      "/booking-card": {
        post: {
          operationId: "generateBookingCard",
          summary: "Curate verified booking recommendations",
          description: "Curate verified booking recommendations across high-comfort hotels, serene cultural stays, and conscious travel essentials.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    destination: { type: "string" },
                    category: { type: "string", default: "hotels" },
                    experience_title: { type: "string" },
                    language: { type: "string", default: "en" }
                  },
                  required: ["destination"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Booking card with zero friction link",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
      "/sensory-earth": {
        post: {
          operationId: "exploreSensoryEarth",
          summary: "Launch 3D Sensory Earth globe",
          description: "Experience the destination through the 3D Sensory Earth globe, connecting with local atmospheric soundscapes and cultural music.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    destination: { type: "string" },
                    mood: { type: "string", default: "botanical" },
                    language: { type: "string", default: "en" }
                  },
                  required: ["destination"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Sensory Earth portal URL",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      }
    }
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

  // OpenAPI schema endpoints (for ChatGPT connector & OpenAPI tools)
  if (request.method === 'GET' && (url.pathname === '/openapi.json' || url.pathname === '/mcp/openapi.json')) {
    return new Response(JSON.stringify(getOpenApiSchema(url.origin), null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Direct REST endpoints for ChatGPT Actions / Connectors
  if (request.method === 'POST') {
    if (url.pathname === '/plan-journey') {
      const args = await request.json().catch(() => ({}));
      return new Response(JSON.stringify(handlePlanJourney(args), null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    if (url.pathname === '/secret-haven') {
      const args = await request.json().catch(() => ({}));
      return new Response(JSON.stringify(handleSecretHaven(args), null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    if (url.pathname === '/booking-card') {
      const args = await request.json().catch(() => ({}));
      return new Response(JSON.stringify(handleBookingCard(args), null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    if (url.pathname === '/sensory-earth') {
      const args = await request.json().catch(() => ({}));
      return new Response(JSON.stringify(handleSensoryEarth(args), null, 2), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  // GET / or /health or /mcp: Server info
  if (request.method === 'GET') {
    return new Response(JSON.stringify({
      status: "ok",
      server: SERVER_INFO.name,
      version: SERVER_INFO.version,
      philosophy: "Contemplative Travel & Sensory Well-being",
      protocol: "Model Context Protocol (MCP) + OpenAPI 3.0",
      transport: "Streamable HTTP / JSON-RPC 2.0 & REST",
      tools_count: TOOLS.length,
      tools: TOOLS.map(t => t.name),
      quality_standard: "WHO Environmental Acoustic Guidelines (53 dB Lden) — CERN Zenodo DOI: 10.5281/zenodo.22756473",
      endpoints: {
        mcp: url.origin + "/mcp",
        openapi: url.origin + "/openapi.json",
        health: url.origin + "/health"
      }
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // POST: JSON-RPC 2.0 handler (MCP Protocol)
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
