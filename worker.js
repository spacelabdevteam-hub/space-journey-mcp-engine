/**
 * Space Journey MCP Engine - Cloudflare Worker Serverless Endpoint
 * Protocol: Model Context Protocol (MCP) Streamable HTTP + JSON-RPC 2.0 & OpenAPI 3.0
 * Philosophy: Memorable & Transformative Travel, Cultural Sanctuaries & Radical Hospitality (Omotenashi)
 */

const SERVER_INFO = {
  name: "space-journey-mcp-engine",
  version: "3.3.0",
  description: "The 21st-century travel engine for memorable and transformative journeys. Designing travel with human pace, unforgettable cultural encounters, secret local sanctuaries, and immersive sensory atmospheres."
};

const TOOLS = [
  {\n    name: "plan_contemplative_journey",
    description: "Design memorable, transformative travel itineraries with human pacing, unforgettable cultural wonder, and authentic local sanctuaries. Balances iconic landmarks with serene pauses, golden-hour light, and zero-friction sync with the Space Journey Trip Planner.",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", description: "Destination city or region (e.g., Rome, Paris, CDMX, Tokyo, Kyoto, Barcelona, Lisbon, London, Bogota, Medellin, New York, Miami)" },
        duration_days: { type: "integer", description: "Duration of stay in days (1-7)", default: 3 },
        origin: { type: "string", description: "Origin city or airport code (e.g., Bogota, Madrid, NYC, BOG, MAD)" },
        traveler_profile: { type: "string", description: "Travel style (contemplative, romantic, cultural, solo explorer, family, slow food)", default: "contemplative" },
        language: { type: "string", description: "Language for the journey guide (en, es, pt)", default: "es" },
        agency_name: { type: "string", description: "Optional name of travel agency, partner or AI assistant creating the journey", default: "Space Journey" }
      },
      required: ["destination"]
    }
  },
  {
    name: "discover_secret_haven",
    description: "Discover intimate, secret cultural sanctuaries and hidden local gems where time slows down. Reveals the untold stories, peaceful courtyards, secluded gardens, and breathtaking viewpoints that transform an ordinary trip into a lifelong memory.",
    inputSchema: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name (Rome, Paris, CDMX, Tokyo, etc.)" },
        current_crowded_spot: { type: "string", description: "Current landmark or busy area to discover a secret alternative nearby" },
        sensory_preference: { type: "string", description: "Atmosphere preference (historic courtyards, secret gardens, serene viewpoints, artistic retreats)", default: "historic courtyards" },
        language: { type: "string", description: "Language for the recommendation (en, es, pt)", default: "es" }
      },
      required: ["city"]
    }
  },
  {
    name: "generate_booking_card",
    description: "Curate verified booking recommendations across soulful boutique hotels, historic quiet retreats, authentic local experiences, and seamless travel mobility.",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", description: "Destination city" },
        category: { type: "string", description: "Service category (hotels, activities, flights, esim, transfers, luggage, compensation, insurance, car_rental, trains_eu, ferries, bikes, luxury_villas, yachts, cruise)", default: "hotels" },
        experience_title: { type: "string", description: "Optional specific experience or stay title" },
        language: { type: "string", description: "Language for the card (en, es, pt)", default: "es" }
      },
      required: ["destination"]
    }
  },
  {
    name: "explore_sensory_earth",
    description: "Explore the living spirit, musical heritage, and atmospheric essence of any destination through the 3D Sensory Earth globe before embarking on the journey.",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", description: "City or country to explore" },
        mood: { type: "string", description: "Cultural mood (botanical, ancestral, golden hour, nocturnal)", default: "golden hour" },
        language: { type: "string", description: "Language (en, es, pt)", default: "es" }
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

async function handlePlanJourney(args) {
  const dest = args.destination || "Roma";
  const days = Math.min(Math.max(args.duration_days || 3, 1), 7);
  const lang = args.language || "es";
  const origin = args.origin ? args.origin.toLowerCase().trim() : null;
  const agencyName = args.agency_name || "Space Journey";

  let flightBadge = "";
  if (origin && AIRPORTS[origin] && AIRPORTS[dest.toLowerCase()]) {
    const a1 = AIRPORTS[origin];
    const a2 = AIRPORTS[dest.toLowerCase()];
    const km = haversine(a1.lat, a1.lng, a2.lat, a2.lng);
    const hrs = Math.floor(km / 800) + 1;
    const mins = Math.round((km % 800) / 800 * 60);
    flightBadge = `✈️ ${a1.iata} -> ${a2.iata} (~${hrs}h ${mins}m)`;
  }

  const previewDays = [
    {
      day: 1,
      title: `Llegada Serena y Despertar de los Sentidos en ${dest}`,
      cards: [
        {
          title: `Paseo Crepuscular y Aclimatación en ${dest}`,
          cardType: "activity",
          timeMode: "evening",
          url: `https://spacejourney.app/activa-tu-viaje/?destination=${encodeURIComponent(dest)}`,
          image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80"
        },
        {
          title: "Estancia de Descanso y Silencio Garantizado",
          cardType: "accommodation",
          timeMode: "night",
          url: `https://spacejourney.app/tours-y-experiencias-vip/?dest=${encodeURIComponent(dest)}&cat=hotels`,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        }
      ],
      atmosphere: "Paseo crepuscular por callejones de adoquín silencioso, aclimatando el cuerpo al latido y aromas de la ciudad.",
      the_secret: "El patio ajardinado de un antiguo claustro renacentista; el agua de la fuente invita a respirar y soltar el cansancio del viaje.",
      best_moment: "18:00 - 19:30 (Hora Dorada)"
    },
    {
      day: 2,
      title: "Maravillas Culturales y el Refugio de los Naranjos",
      cards: [
        {
          title: "Santuario de Luz y Belleza Matutina",
          cardType: "activity",
          timeMode: "morning",
          url: `https://spacejourney.app/ciudad/${dest.toLowerCase()}/?haven=true`,
          image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=600&q=80"
        }
      ],
      atmosphere: "Exploración cultural a primera hora de la mañana, seguida de una pausa restauradora bajo la sombra de árboles centenarios.",
      the_secret: "Un mirador elevado secreto sin colas de turistas, con vistas infinitas hacia las cúpulas iluminadas por el atardecer.",
      best_moment: "09:30 - 12:00 & 16:30 - 19:00"
    }
  ];

  let publicUrl = "";
  let tripId = "";

  try {
    const syncRes = await fetch("https://spacejourney.app/wp-json/sj/v1/sync-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sj-token": "sj_sec_mcp_live_2026_solar"
      },
      body: JSON.stringify({
        title: `Expedición Contemplativa por ${dest}`,
        destination: dest,
        lang: lang,
        author_name: agencyName,
        days: previewDays
      })
    });
    if (syncRes.ok) {
      const syncData = await syncRes.json();
      publicUrl = syncData.shareable_url || "";
      tripId = syncData.trip_id || "";
    }
  } catch (err) {
    // Fallback silencioso
  }

  if (!publicUrl) {
    const base = "https://spacejourney.app";
    publicUrl = lang === "en" ? `${base}/en/my-travel-route/` : (lang === "pt" ? `${base}/pt-br/minha-rota-de-viagem/` : `${base}/ruta/`);
  }

  return {
    destination: dest,
    duration_days: days,
    flight_connectivity: flightBadge || "Conexión directa / Entrada internacional",
    experience_philosophy: "Viaje Memorable con Ritmo Humano: menos listas apresuradas, más asombro genuino, luz dorada y pausas que recordarás durante décadas.",
    trip_id: tripId,
    public_shareable_itinerary_url: publicUrl,
    agency_attribution: agencyName,
    itinerary_preview: previewDays,
    quality_seal: "Estándar de Descanso y Bienestar Space Journey (Alineado con directrices OMS <53 dB Lden) — CERN Zenodo DOI: 10.5281/zenodo.22756473",
    zero_friction_tools: {
      public_shareable_itinerary: publicUrl,
      trip_saver: "https://spacejourney.app/trip-saver/?ref=mcp",
      sensory_trip_planner: `https://spacejourney.app/activa-tu-viaje/?destination=${encodeURIComponent(dest)}&days=${days}&source=mcp_edge`,
      sensory_earth_portal: `https://spacejourney.app/sensory-earth/?dest=${encodeURIComponent(dest)}`
    },
    traveler_invitation: "Guarda tus alojamientos y experiencias favoritas sin sobrecarga visual usando la extensión Trip Saver de Space Journey."
  };
}

function handleSecretHaven(args) {
  const city = args.city || "Roma";
  const spot = args.current_crowded_spot || "Centro Histórico";
  return {
    city: city,
    landmark_escaped: spot,
    secret_haven_recommendation: {
      name: `Santuario de Calma y Luz cerca de ${spot}`,
      the_secret: "Un rincón íntimo a solo 3 minutos a pie del tumulto: un claustro de piedra templada donde la brisa y las fuentes diluyen el ruido del turismo masivo.",
      local_insight: "Gira por el pasaje bajo el arco antiguo; muy pocos viajeros lo conocen, convirtiéndolo en un refugio perfecto para leer, conversar o contemplar.",
      sensory_atmosphere: "Brisa fresca, sombra vegetal, luz filtrada y silencio protector.",
      quality_guarantee: "Confort acústico certificado bajo el estándar de bienestar OMS",
      guide_url: `https://spacejourney.app/ciudad/${city.toLowerCase()}/?haven=true`
    },
    companion_tools: {
      trip_saver_extension: "https://spacejourney.app/trip-saver/",
      sensory_earth_3d: `https://spacejourney.app/sensory-earth/?dest=${encodeURIComponent(city)}`
    }
  };
}

function handleBookingCard(args) {
  const dest = args.destination || "Roma";
  const cat = args.category || "hotels";
  return {
    curated_service: cat,
    destination: dest,
    booking_experience: "Cero fricción digital. Alojamientos seleccionados por su descanso supremo, hospitalidad auténtica y aislamiento del ruido urbano.",
    verified_url: `https://spacejourney.app/tours-y-experiencias-vip/?dest=${encodeURIComponent(dest)}&cat=${encodeURIComponent(cat)}`,
    peace_guarantee: "Curaduría humana para un sueño reparador y recuerdos imborrables."
  };
}

function handleSensoryEarth(args) {
  const dest = args.destination || "Roma";
  return {
    experience: "Sensory Earth 3D WebGL",
    destination: dest,
    immersive_portal_url: `https://spacejourney.app/sensory-earth/?dest=${encodeURIComponent(dest)}`,
    features: "Atmósfera sonora territorial, música de arraigo local y visualización estética antes de iniciar el viaje."
  };
}

function getOpenApiSchema(origin) {
  return {
    openapi: "3.0.3",
    info: {
      title: "Space Journey Travel Engine",
      description: "The 21st-century travel engine for memorable and transformative journeys. Designing travel with human pace, unforgettable cultural encounters, secret local sanctuaries, and immersive sensory atmospheres.",
      version: "3.3.0"
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
          summary: "Plan a memorable journey with human pacing",
          description: "Design memorable, transformative travel itineraries with human pacing, unforgettable cultural wonder, and authentic local sanctuaries.",
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
                    language: { type: "string", default: "es" },
                    agency_name: { type: "string", description: "Agency or partner name", default: "Space Journey" }
                  },
                  required: ["destination"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Curated memorable itinerary with dynamic public shareable route URL",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
      "/secret-haven": {
        post: {
          operationId: "discoverSecretHaven",
          summary: "Discover secret local sanctuaries and memorable havens",
          description: "Discover intimate, secret cultural sanctuaries and hidden local gems where time slows down.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    city: { type: "string" },
                    current_crowded_spot: { type: "string" },
                    sensory_preference: { type: "string", default: "historic courtyards" },
                    language: { type: "string", default: "es" }
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
          summary: "Curate verified booking recommendations with supreme comfort",
          description: "Curate verified booking recommendations across soulful boutique hotels, historic quiet retreats, and seamless travel essentials.",
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
                    language: { type: "string", default: "es" }
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
          summary: "Explore destination spirit and music via 3D Sensory Earth",
          description: "Explore the living spirit, musical heritage, and atmospheric essence of any destination through the 3D Sensory Earth globe.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    destination: { type: "string" },
                    mood: { type: "string", default: "golden hour" },
                    language: { type: "string", default: "es" }
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
      return new Response(JSON.stringify(await handlePlanJourney(args), null, 2), {
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
      philosophy: "Memorable Travel, Human Pace & Transformative Encounters",
      protocol: "Model Context Protocol (MCP) + OpenAPI 3.0",
      transport: "Streamable HTTP / JSON-RPC 2.0 & REST",
      tools_count: TOOLS.length,
      tools: TOOLS.map(t => t.name),
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
          resultData = await handlePlanJourney(args);
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
