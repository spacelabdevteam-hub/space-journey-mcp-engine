/**
 * Space Journey MCP Engine - Cloudflare Worker Serverless Endpoint
 * Version: 3.5.1 (Live WordPress Itinerary Sync, Affiliate Router & Agency Co-branding)
 * Protocol: Model Context Protocol (MCP) Streamable HTTP + JSON-RPC 2.0 & OpenAPI 3.0
 * Philosophy: Memorable & Transformative Travel, Cultural Sanctuaries & Radical Hospitality (Omotenashi)
 */

const SERVER_INFO = {
  name: "space-journey-mcp-engine",
  version: "3.5.1",
  description: "The 21st-century travel engine for memorable and transformative journeys. Designing travel with human pace, unforgettable cultural encounters, secret local sanctuaries, and zero-friction sync with the Space Journey Trip Planner."
};

const AIRPORTS = {
  "bogota": { iata: "BOG", name: "Bogotá", lat: 4.7016, lng: -74.1469 },
  "bog": { iata: "BOG", name: "Bogotá", lat: 4.7016, lng: -74.1469 },
  "medellin": { iata: "MDE", name: "Medellín", lat: 6.1645, lng: -75.4231 },
  "mde": { iata: "MDE", name: "Medellín", lat: 6.1645, lng: -75.4231 },
  "madrid": { iata: "MAD", name: "Madrid", lat: 40.4983, lng: -3.5676 },
  "mad": { iata: "MAD", name: "Madrid", lat: 40.4983, lng: -3.5676 },
  "barcelona": { iata: "BCN", name: "Barcelona", lat: 41.2974, lng: 2.0833 },
  "bcn": { iata: "BCN", name: "Barcelona", lat: 41.2974, lng: 2.0833 },
  "roma": { iata: "FCO", name: "Roma", lat: 41.8003, lng: 12.2389 },
  "rome": { iata: "FCO", name: "Rome", lat: 41.8003, lng: 12.2389 },
  "fco": { iata: "FCO", name: "Roma", lat: 41.8003, lng: 12.2389 },
  "paris": { iata: "CDG", name: "París", lat: 49.0097, lng: 2.5479 },
  "cdg": { iata: "CDG", name: "París", lat: 49.0097, lng: 2.5479 },
  "london": { iata: "LHR", name: "London", lat: 51.4700, lng: -0.4543 },
  "londres": { iata: "LHR", name: "Londres", lat: 51.4700, lng: -0.4543 },
  "lhr": { iata: "LHR", name: "London", lat: 51.4700, lng: -0.4543 },
  "cdmx": { iata: "MEX", name: "Ciudad de México", lat: 19.4361, lng: -99.0719 },
  "mexico city": { iata: "MEX", name: "Ciudad de México", lat: 19.4361, lng: -99.0719 },
  "mex": { iata: "MEX", name: "Ciudad de México", lat: 19.4361, lng: -99.0719 },
  "new york": { iata: "JFK", name: "New York", lat: 40.6413, lng: -73.7781 },
  "nueva york": { iata: "JFK", name: "New York", lat: 40.6413, lng: -73.7781 },
  "nyc": { iata: "JFK", name: "New York", lat: 40.6413, lng: -73.7781 },
  "jfk": { iata: "JFK", name: "New York", lat: 40.6413, lng: -73.7781 },
  "miami": { iata: "MIA", name: "Miami", lat: 25.7959, lng: -80.2870 },
  "mia": { iata: "MIA", name: "Miami", lat: 25.7959, lng: -80.2870 },
  "tokyo": { iata: "HND", name: "Tokyo", lat: 35.5494, lng: 139.7798 },
  "hnd": { iata: "HND", name: "Tokyo", lat: 35.5494, lng: 139.7798 },
  "kyoto": { iata: "KIX", name: "Kyoto / Osaka", lat: 34.4347, lng: 135.2442 },
  "kix": { iata: "KIX", name: "Kyoto / Osaka", lat: 34.4347, lng: 135.2442 },
  "lisbon": { iata: "LIS", name: "Lisbon", lat: 38.7756, lng: -9.1354 },
  "lisboa": { iata: "LIS", name: "Lisboa", lat: 38.7756, lng: -9.1354 },
  "lis": { iata: "LIS", name: "Lisbon", lat: 38.7756, lng: -9.1354 }
};


const CITY_HERO_IMAGES = {
  "roma": "https://spacejourney.app/wp-content/uploads/2026/04/292541fe-36cf-4333-9af9-49ae4b425401.jpg",
  "paris": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-sainte-chapelle-relicario-luz-medieval-v13b-1024x576.jpg",
  "londres": "https://spacejourney.app/wp-content/uploads/2026/05/9edc6c0f-961c-4164-ad77-e74ddd4ffc71.jpg",
  "cdmx": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
  "new-york": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-Manhattan-aerial-view-helicopt-v14-1024x576.jpg",
  "miami": "https://spacejourney.app/wp-content/uploads/2026/05/miami-custom-landscape-everglades-airboat-pulso-rio-hierba-Everglades-airboat-speed-v15-1024x576.jpg"
};

const CITY_KEY_MAP = {
  "roma": "roma",
  "rome": "roma",
  "fco": "roma",
  "paris": "paris",
  "cdg": "paris",
  "londres": "londres",
  "london": "londres",
  "lhr": "londres",
  "cdmx": "cdmx",
  "mexico": "cdmx",
  "mexico city": "cdmx",
  "ciudad de mexico": "cdmx",
  "mex": "cdmx",
  "new york": "new-york",
  "nueva york": "new-york",
  "nyc": "new-york",
  "jfk": "new-york",
  "miami": "miami",
  "mia": "miami"
};

// Catálogo embebido de 94 experiencias verificadas en producción
const CURATED_CATALOG = {
  "miami": [
    {
      "officialId": 3380,
      "titles": {
        "es": "Everglades Airboat | El pulso del río de hierba",
        "en": "Everglades Airboat | The pulse of the river of grass",
        "pt": "Aerobarco Everglades | A pulsação do rio de grama"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/everglades-airboat-pulso-rio-hierba/",
        "en": "https://spacejourney.app/en/experiencia/everglades-airboat-the-pulse-of-the-river-of-grass/",
        "pt": "https://spacejourney.app/pt-br/experiencia/aerobarco-everglades-a-pulsacao-do-rio-de-grama/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-custom-landscape-everglades-airboat-pulso-rio-hierba-Everglades-airboat-speed-v15-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Everglades%20Airboat%20%7C%20The%20pulse%20of%20the%20river%20of%20grass%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3380",
      "duration": 120,
      "timeMode": "morning"
    },
    {
      "officialId": 3378,
      "titles": {
        "es": "Rubell Museum | El santuario del arte contemporáneo",
        "en": "Rubell Museum | The sanctuary of contemporary art",
        "pt": "Museu Rubell | O santuário da arte contemporânea"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/rubell-museum-santuario-arte-contemporaneo/",
        "en": "https://spacejourney.app/en/experiencia/rubell-museum-the-sanctuary-of-contemporary-art/",
        "pt": "https://spacejourney.app/pt-br/experiencia/museu-rubell-o-santuario-da-arte-contemporanea/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-pexels-landscape-Rubell-Museum-Miami-interior-g-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Rubell%20Museum%20%7C%20The%20sanctuary%20of%20contemporary%20art%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3378",
      "duration": 150,
      "timeMode": "morning"
    },
    {
      "officialId": 3376,
      "titles": {
        "es": "Frost Science Museum | El ojo del océano",
        "en": "Frost Science Museum | The eye of the ocean",
        "pt": "Museu da Ciência Frost | O olho do oceano"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/frost-science-museum-ojo-oceano/",
        "en": "https://spacejourney.app/en/experiencia/frost-science-museum-the-eye-of-the-ocean/",
        "pt": "https://spacejourney.app/pt-br/experiencia/museu-da-ciencia-frost-o-olho-do-oceano/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-unsplash-landscape-Frost-Science-Museum-aquarium-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Frost%20Science%20Museum%20%7C%20The%20eye%20of%20the%20ocean%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3376",
      "duration": 180,
      "timeMode": "morning"
    },
    {
      "officialId": 3373,
      "titles": {
        "es": "Artechouse Miami | El laboratorio de luz",
        "en": "Artechouse Miami | The light laboratory",
        "pt": "Artechouse Miami | O laboratório de luz"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/artechouse-miami-laboratorio-luz/",
        "en": "https://spacejourney.app/en/experiencia/artechouse-miami-the-light-laboratory/",
        "pt": "https://spacejourney.app/pt-br/experiencia/artechouse-miami-o-laboratorio-de-luz/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-pexels-landscape-Artechouse-Miami-digital-exhib-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Artechouse%20Miami%20%7C%20The%20light%20laboratory%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3373",
      "duration": 75,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3371,
      "titles": {
        "es": "Pérez Art Museum Miami | El jardín colgante de la bahía",
        "en": "Pérez Art Museum Miami | The Hanging Garden by the Bay",
        "pt": "Museu de Arte Pérez Miami | O jardim suspenso à beira da baía"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/perez-art-museum-miami-pamm-jardin-colgante/",
        "en": "https://spacejourney.app/en/experiencia/perez-art-museum-miami-the-hanging-garden-by-the-bay/",
        "pt": "https://spacejourney.app/pt-br/experiencia/museu-de-arte-perez-miami-o-jardim-suspenso-a-beira-da-baia/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-custom-landscape-perez-art-museum-miami-pamm-jardin-colgante-Perez-Art-Museum-hanging-v15-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=P%C3%A9rez%20Art%20Museum%20Miami%20%7C%20The%20Hanging%20Garden%20by%20the%20Bay%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3371",
      "duration": 120,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3368,
      "titles": {
        "es": "Superblue Miami | El portal de las dimensiones",
        "en": "Superblue Miami | The portal of dimensions",
        "pt": "Superazul Miami | O portal das dimensões"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/superblue-miami-portal-dimensiones/",
        "en": "https://spacejourney.app/en/experiencia/superblue-miami-the-portal-of-dimensions/",
        "pt": "https://spacejourney.app/pt-br/experiencia/superazul-miami-o-portal-das-dimensoes/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-unsplash-landscape-Superblue-Miami-immersive-art-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Superblue%20Miami%20%7C%20The%20portal%20of%20dimensions%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3368",
      "duration": 90,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3364,
      "titles": {
        "es": "Enchanted Forest Miami | El bosque de las hadas de Miami",
        "en": "Enchanted Forest Miami | Miami Fairy Forest",
        "pt": "Floresta Encantada Miami | Floresta das Fadas de Miami"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/enchanted-forest-bosque-hadas-miami/",
        "en": "https://spacejourney.app/en/experiencia/enchanted-forest-miami-miami-fairy-forest/",
        "pt": "https://spacejourney.app/pt-br/experiencia/floresta-encantada-miami-floresta-das-fadas-de-miami/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-custom-landscape-enchanted-forest-bosque-hadas-miami-live-oak-trees-Spanish-mo-v15-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Enchanted%20Forest%20Miami%20%7C%20Miami%20Fairy%20Forest%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3364",
      "duration": 45,
      "timeMode": "morning"
    },
    {
      "officialId": 3362,
      "titles": {
        "es": "Matheson Hammock Park Miami | El atolón artificial",
        "en": "Matheson Hammock Park Miami | The artificial atoll",
        "pt": "Matheson Hammock Park Miami | O atol artificial"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/matheson-hammock-park-atolon-artificial-miami/",
        "en": "https://spacejourney.app/en/experiencia/matheson-hammock-park-miami-the-artificial-atoll/",
        "pt": "https://spacejourney.app/pt-br/experiencia/matheson-hammock-park-miami-o-atol-artificial/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-pexels-landscape-Matheson-Hammock-Park-atoll-po-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Matheson%20Hammock%20Park%20Miami%20%7C%20The%20artificial%20atoll%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3362",
      "duration": 120,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3360,
      "titles": {
        "es": "Alice Wainwright Park Miami | El mirador del manglar",
        "en": "Alice Wainwright Park Miami | The mangrove viewpoint",
        "pt": "Parque Alice Wainwright Miami | O mirante do mangue"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/alice-wainwright-park-mirador-manglar-miami/",
        "en": "https://spacejourney.app/en/experiencia/alice-wainwright-park-miami-the-mangrove-viewpoint/",
        "pt": "https://spacejourney.app/pt-br/experiencia/parque-alice-wainwright-miami-o-mirante-do-mangue/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-pexels-landscape-Alice-Wainwright-Park-Miami-wa-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Alice%20Wainwright%20Park%20Miami%20%7C%20The%20mangrove%20viewpoint%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3360",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 3357,
      "titles": {
        "es": "Ancient Spanish Monastery Miami | El laberinto místico",
        "en": "Ancient Spanish Monastery Miami | The mystical labyrinth",
        "pt": "Antigo Mosteiro Espanhol Miami | O labirinto místico"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/ancient-spanish-monastery-laberinto-mistico-miami/",
        "en": "https://spacejourney.app/en/experiencia/ancient-spanish-monastery-miami-the-mystical-labyrinth/",
        "pt": "https://spacejourney.app/pt-br/experiencia/antigo-mosteiro-espanhol-miami-o-labirinto-mistico/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-unsplash-landscape-Ancient-Spanish-Monastery-Miam-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Ancient%20Spanish%20Monastery%20Miami%20%7C%20The%20mystical%20labyrinth%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3357",
      "duration": 90,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3355,
      "titles": {
        "es": "Vizcaya Museum &#038; Gardens Miami | El renacimiento del agua",
        "en": "Vizcaya Museum &#038; Gardens Miami | The rebirth of water",
        "pt": "Museu e Jardins Vizcaya Miami | O renascimento da água"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/vizcaya-museum-gardens-renacimiento-agua-miami/",
        "en": "https://spacejourney.app/en/experiencia/vizcaya-museum-gardens-miami-the-rebirth-of-water/",
        "pt": "https://spacejourney.app/pt-br/experiencia/museu-e-jardins-vizcaya-miami-o-renascimento-da-agua/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/06/9ef1ec5c-bdcd-4213-abc2-953e583b8da2.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Vizcaya%20Museum%20%26%23038%3B%20Gardens%20Miami%20%7C%20The%20rebirth%20of%20water%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3355",
      "duration": 150,
      "timeMode": "morning"
    },
    {
      "officialId": 3352,
      "titles": {
        "es": "The Kampong Miami | El refugio botánico de Coconut Grove",
        "en": "The Kampong Miami | Coconut Grove Botanical Refuge",
        "pt": "O Kampong Miami | Refúgio Botânico Coconut Grove"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/the-kampong-refugio-botanico-miami/",
        "en": "https://spacejourney.app/en/experiencia/the-kampong-miami-coconut-grove-botanical-refuge/",
        "pt": "https://spacejourney.app/pt-br/experiencia/o-kampong-miami-refugio-botanico-coconut-grove/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-pexels-landscape-The-Kampong-Coconut-Grove-bota-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Kampong%20Miami%20%7C%20Coconut%20Grove%20Botanical%20Refuge%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3352",
      "duration": 120,
      "timeMode": "morning"
    },
    {
      "officialId": 3349,
      "titles": {
        "es": "Lummus Park Miami | El jardín de neón de Ocean Drive",
        "en": "Lummus Park Miami | The Ocean Drive Neon Garden",
        "pt": "Parque Lummus Miami | Jardim de néon da Ocean Drive"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/lummus-park-jardin-neon-ocean-drive-miami/",
        "en": "https://spacejourney.app/en/experiencia/lummus-park-miami-the-ocean-drive-neon-garden/",
        "pt": "https://spacejourney.app/pt-br/experiencia/parque-lummus-miami-jardim-de-neon-da-ocean-drive/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/34334889-1024x768.jpeg",
      "affiliate": "https://www.getyourguide.com/s/?q=Lummus%20Park%20Miami%20%7C%20The%20Ocean%20Drive%20Neon%20Garden%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3349",
      "duration": 75,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3346,
      "titles": {
        "es": "Wynwood Pathways Miami | El museo de las calles",
        "en": "Wynwood Pathways Miami | The museum of the streets",
        "pt": "Wynwood Caminhos Miami | O museu das ruas"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/wynwood-pathways-museo-calles-miami/",
        "en": "https://spacejourney.app/en/experiencia/wynwood-pathways-miami-the-museum-of-the-streets/",
        "pt": "https://spacejourney.app/pt-br/experiencia/wynwood-caminhos-miami-o-museu-das-ruas/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-custom-landscape-wynwood-pathways-museo-calles-miami-Wynwood-Walls-colorful-mu-v15-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Wynwood%20Pathways%20Miami%20%7C%20The%20museum%20of%20the%20streets%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3346",
      "duration": 120,
      "timeMode": "morning"
    },
    {
      "officialId": 3343,
      "titles": {
        "es": "SoundScape Park Miami | Sinfonía bajo las palmeras",
        "en": "SoundScape Park Miami | Symphony under the palm trees",
        "pt": "Parque SoundScape Miami | Sinfonia sob as palmeiras"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/soundscape-park-sinfonia-palmeras-miami/",
        "en": "https://spacejourney.app/en/experiencia/soundscape-park-miami-symphony-under-the-palm-trees/",
        "pt": "https://spacejourney.app/pt-br/experiencia/parque-soundscape-miami-sinfonia-sob-as-palmeiras/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-pexels-landscape-SoundScape-Park-Miami-Beach-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=SoundScape%20Park%20Miami%20%7C%20Symphony%20under%20the%20palm%20trees%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3343",
      "duration": 60,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3340,
      "titles": {
        "es": "South Pointe Park Miami | El umbral del Atlántico",
        "en": "South Pointe Park Miami | The threshold of the Atlantic",
        "pt": "Parque South Pointe Miami | O limiar do Atlântico"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/south-pointe-park-umbral-atlantico-miami/",
        "en": "https://spacejourney.app/en/experiencia/south-pointe-park-miami-the-threshold-of-the-atlantic/",
        "pt": "https://spacejourney.app/pt-br/experiencia/parque-south-pointe-miami-o-limiar-do-atlantico/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/miami-pexels-landscape-South-Pointe-Park-Miami-Beach-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=South%20Pointe%20Park%20Miami%20%7C%20The%20threshold%20of%20the%20Atlantic%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3340",
      "duration": 90,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3076,
      "titles": {
        "es": "The Underline | El oasis urbano bajo el Metrorail de Miami",
        "en": "The Underline | The urban oasis under the Miami Metrorail",
        "pt": "O sublinhado | O oásis urbano sob o Metrorail de Miami"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/the-underline-miami-oasis-urbano-brickell/",
        "en": "https://spacejourney.app/en/experiencia/the-underline-the-urban-oasis-under-the-miami-metrorail/",
        "pt": "https://spacejourney.app/pt-br/experiencia/o-sublinhado-o-oasis-urbano-sob-o-metrorail-de-miami/"
      },
      "image": "https://assets.spacelab.network/spacejourney/wp-content/uploads/2026/05/699f307c16e9a323c11b4f49_6994f4e8d7f722916ffc91fd_First-Image-1-p-1600-1024x683.jpeg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Underline%20%7C%20The%20urban%20oasis%20under%20the%20Miami%20Metrorail%20Miami&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_MIA-3076",
      "duration": 52,
      "timeMode": "morning"
    }
  ],
  "new-york": [
    {
      "officialId": 3325,
      "titles": {
        "es": "Helicopter Tour New York | El oráculo del Skyline",
        "en": "Helicopter Tour New York | The Skyline Oracle",
        "pt": "Passeio de helicóptero em Nova York | O Oráculo do Horizonte"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/helicopter-tour-oraculo-skyline-new-york/",
        "en": "https://spacejourney.app/en/experiencia/helicopter-tour-new-york-the-skyline-oracle/",
        "pt": "https://spacejourney.app/pt-br/experiencia/passeio-de-helicoptero-em-nova-york-o-oraculo-do-horizonte/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-Manhattan-aerial-view-helicopt-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Helicopter%20Tour%20New%20York%20%7C%20The%20Skyline%20Oracle%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3325",
      "duration": 20,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3323,
      "titles": {
        "es": "Guggenheim Museum New York | La espiral del arte moderno",
        "en": "Guggenheim Museum New York | The spiral of modern art",
        "pt": "Museu Guggenheim Nova York | A espiral da arte moderna"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/guggenheim-museum-espiral-arte-moderno-new-york/",
        "en": "https://spacejourney.app/en/experiencia/guggenheim-museum-new-york-the-spiral-of-modern-art/",
        "pt": "https://spacejourney.app/pt-br/experiencia/museu-guggenheim-nova-york-a-espiral-da-arte-moderna/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-unsplash-landscape-Guggenheim-Museum-architecture-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Guggenheim%20Museum%20New%20York%20%7C%20The%20spiral%20of%20modern%20art%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3323",
      "duration": 120,
      "timeMode": "morning"
    },
    {
      "officialId": 3320,
      "titles": {
        "es": "Le Pavillon New York | Jardín comestible de Daniel Boulud",
        "en": "Le Pavillon New York | Daniel Boulud's Edible Garden",
        "pt": "Le Pavillon Nova York | Jardim comestível de Daniel Boulud"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/le-pavillon-jardin-comestible-new-york/",
        "en": "https://spacejourney.app/en/experiencia/le-pavillon-new-york-daniel-bouluds-edible-garden/",
        "pt": "https://spacejourney.app/pt-br/experiencia/le-pavillon-nova-york-jardim-comestivel-de-daniel-boulud/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-unsplash-landscape-Le-Pavillon-restaurant-gourmet-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Le%20Pavillon%20New%20York%20%7C%20Daniel%20Boulud%27s%20Edible%20Garden%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3320",
      "duration": 150,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3316,
      "titles": {
        "es": "The Met Cloisters New York | Mística medieval en el Hudson",
        "en": "The Met Cloisters New York | Medieval mystique on the Hudson",
        "pt": "O Met Cloisters Nova York | Mística medieval no Hudson"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/the-met-cloisters-mistica-medieval-hudson-new-york/",
        "en": "https://spacejourney.app/en/experiencia/the-met-cloisters-new-york-medieval-mystique-on-the-hudson/",
        "pt": "https://spacejourney.app/pt-br/experiencia/o-met-cloisters-nova-york-mistica-medieval-no-hudson/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-The-Met-Cloisters-fort-tryon-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Met%20Cloisters%20New%20York%20%7C%20Medieval%20mystique%20on%20the%20Hudson%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3316",
      "duration": 120,
      "timeMode": "morning"
    },
    {
      "officialId": 3313,
      "titles": {
        "es": "Summit One Vanderbilt New York | Inmersión en las nubes",
        "en": "Summit One Vanderbilt New York | Dive into the clouds",
        "pt": "Summit One Vanderbilt Nova York | Mergulhe nas nuvens"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/summit-one-vanderbilt-inmersion-nubes-new-york/",
        "en": "https://spacejourney.app/en/experiencia/summit-one-vanderbilt-new-york-dive-into-the-clouds/",
        "pt": "https://spacejourney.app/pt-br/experiencia/summit-one-vanderbilt-nova-york-mergulhe-nas-nuvens/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-Summit-One-Vanderbilt-mirrors-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Summit%20One%20Vanderbilt%20New%20York%20%7C%20Dive%20into%20the%20clouds%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3313",
      "duration": 90,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3310,
      "titles": {
        "es": "The Ramble | El bosque secreto de Central Park",
        "en": "The Ramble | The secret forest of Central Park",
        "pt": "A caminhada | A floresta secreta do Central Park"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/the-ramble-central-park-bosque-secreto-nyc/",
        "en": "https://spacejourney.app/en/experiencia/the-ramble-the-secret-forest-of-central-park/",
        "pt": "https://spacejourney.app/pt-br/experiencia/a-caminhada-a-floresta-secreta-do-central-park/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-Central-Park-The-Ramble-forest-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Ramble%20%7C%20The%20secret%20forest%20of%20Central%20Park%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3310",
      "duration": 50,
      "timeMode": "morning"
    },
    {
      "officialId": 3306,
      "titles": {
        "es": "Brooklyn Heights Promenade | El balcón de la ciudad",
        "en": "Brooklyn Heights Promenade | The city balcony",
        "pt": "Passeio de Brooklyn Heights | A varanda da cidade"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/brooklyn-heights-promenade-balcon-ciudad-nyc/",
        "en": "https://spacejourney.app/en/experiencia/brooklyn-heights-promenade-the-city-balcony/",
        "pt": "https://spacejourney.app/pt-br/experiencia/passeio-de-brooklyn-heights-a-varanda-da-cidade/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-Brooklyn-Heights-Promenade-vie-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Brooklyn%20Heights%20Promenade%20%7C%20The%20city%20balcony%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3306",
      "duration": 45,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3303,
      "titles": {
        "es": "Greenacre Park | La cascada escondida de Midtown",
        "en": "Greenacre Park | Midtown's Hidden Waterfall",
        "pt": "Parque Greenacre | Cachoeira escondida do centro da cidade"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/greenacre-park-cascada-escondida-midtown-nyc/",
        "en": "https://spacejourney.app/en/experiencia/greenacre-park-midtowns-hidden-waterfall/",
        "pt": "https://spacejourney.app/pt-br/experiencia/parque-greenacre-cachoeira-escondida-do-centro-da-cidade/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-Greenacre-Park-waterfall-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Greenacre%20Park%20%7C%20Midtown%27s%20Hidden%20Waterfall%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3303",
      "duration": 30,
      "timeMode": "morning"
    },
    {
      "officialId": 3300,
      "titles": {
        "es": "The Morgan Library | El búnker del conocimiento en New York",
        "en": "The Morgan Library | The knowledge bunker in New York",
        "pt": "A Biblioteca Morgan | O bunker do conhecimento em Nova York"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/the-morgan-library-museum-bunker-conocimiento-nyc/",
        "en": "https://spacejourney.app/en/experiencia/the-morgan-library-the-knowledge-bunker-in-new-york/",
        "pt": "https://spacejourney.app/pt-br/experiencia/a-biblioteca-morgan-o-bunker-do-conhecimento-em-nova-york/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-Morgan-Library-McKim-Room-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Morgan%20Library%20%7C%20The%20knowledge%20bunker%20in%20New%20York%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3300",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 3297,
      "titles": {
        "es": "Ford Foundation Atrium | Selva bajo cristal",
        "en": "Ford Foundation Atrium | Jungle under glass",
        "pt": "Átrio da Fundação Ford | Selva sob vidro"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/ford-foundation-atrium-selva-bajo-cristal-nyc/",
        "en": "https://spacejourney.app/en/experiencia/ford-foundation-atrium-jungle-under-glass/",
        "pt": "https://spacejourney.app/pt-br/experiencia/atrio-da-fundacao-ford-selva-sob-vidro/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-unsplash-landscape-Ford-Foundation-Building-garde-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Ford%20Foundation%20Atrium%20%7C%20Jungle%20under%20glass%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3297",
      "duration": 40,
      "timeMode": "morning"
    },
    {
      "officialId": 3295,
      "titles": {
        "es": "The Elevated Acre | El jardín secreto de Wall Street",
        "en": "The Elevated Acre | The secret garden of Wall Street",
        "pt": "O Acre Elevado | O jardim secreto de Wall Street"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/the-elevated-acre-jardin-secreto-nyc-wall-street/",
        "en": "https://spacejourney.app/en/experiencia/the-elevated-acre-the-secret-garden-of-wall-street/",
        "pt": "https://spacejourney.app/pt-br/experiencia/o-acre-elevado-o-jardim-secreto-de-wall-street/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-The-Elevated-Acre-park-Wall-St-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Elevated%20Acre%20%7C%20The%20secret%20garden%20of%20Wall%20Street%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3295",
      "duration": 45,
      "timeMode": "morning"
    },
    {
      "officialId": 3291,
      "titles": {
        "es": "Roosevelt Island Tramway: Vuelo urbano sobre el East River",
        "en": "Roosevelt Island Tramway: City Flight over the East River",
        "pt": "Bonde da Ilha Roosevelt: voo urbano sobre o East River"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/roosevelt-island-tramway-vuelo-urbano-east-river/",
        "en": "https://spacejourney.app/en/experiencia/roosevelt-island-tramway-city-flight-over-the-east-river/",
        "pt": "https://spacejourney.app/pt-br/experiencia/bonde-da-ilha-roosevelt-voo-urbano-sobre-o-east-river/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-custom-landscape-roosevelt-island-tramway-vuelo-urbano-east-river-Roosevelt-Island-Tramway-v16-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Roosevelt%20Island%20Tramway%3A%20City%20Flight%20over%20the%20East%20River%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3291",
      "duration": 15,
      "timeMode": "morning"
    },
    {
      "officialId": 3288,
      "titles": {
        "es": "Little Island: El parque sobre el Hudson",
        "en": "Little Island: The Park on the Hudson",
        "pt": "Little Island: O Parque no Hudson"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/little-island-parque-suspendido-nyc/",
        "en": "https://spacejourney.app/en/experiencia/little-island-the-park-on-the-hudson/",
        "pt": "https://spacejourney.app/pt-br/experiencia/little-island-o-parque-no-hudson/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-Little-Island-park-Pier-55-New-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Little%20Island%3A%20The%20Park%20on%20the%20Hudson%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3288",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 3284,
      "titles": {
        "es": "Staten Island Ferry: El mirador del puerto de New York",
        "en": "Staten Island Ferry: New York Harbor Overlook",
        "pt": "Balsa de Staten Island: mirante do porto de Nova York"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/staten-island-ferry-mirador-libertad/",
        "en": "https://spacejourney.app/en/experiencia/staten-island-ferry-new-york-harbor-overlook/",
        "pt": "https://spacejourney.app/pt-br/experiencia/balsa-de-staten-island-mirante-do-porto-de-nova-york/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-custom-landscape-staten-island-ferry-mirador-libertad-Staten-Island-Ferry-Manha-v16-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Staten%20Island%20Ferry%3A%20New%20York%20Harbor%20Overlook%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3284",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 3282,
      "titles": {
        "es": "The Vessel: Geometría urbana y flujo vertical",
        "en": "The Vessel: Urban geometry and vertical flow",
        "pt": "O Navio: Geometria urbana e fluxo vertical"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/vessel-hudson-yards-geometria-urbana/",
        "en": "https://spacejourney.app/en/experiencia/the-vessel-urban-geometry-and-vertical-flow/",
        "pt": "https://spacejourney.app/pt-br/experiencia/o-navio-geometria-urbana-e-fluxo-vertical/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-The-Vessel-Hudson-Yards-NYC-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Vessel%3A%20Urban%20geometry%20and%20vertical%20flow%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3282",
      "duration": 45,
      "timeMode": "morning"
    },
    {
      "officialId": 3242,
      "titles": {
        "es": "The High Line: El jardín lineal elevado de New York",
        "en": "The High Line: New York's elevated linear garden",
        "pt": "The High Line: o jardim linear elevado de Nova York"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/high-line-jardin-elevado-nyc/",
        "en": "https://spacejourney.app/en/experiencia/the-high-line-new-yorks-elevated-linear-garden/",
        "pt": "https://spacejourney.app/pt-br/experiencia/the-high-line-o-jardim-linear-elevado-de-nova-york/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nyc-pexels-landscape-High-Line-NYC-park-green-v14-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20High%20Line%3A%20New%20York%27s%20elevated%20linear%20garden%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3242",
      "duration": 90,
      "timeMode": "morning"
    },
    {
      "officialId": 3062,
      "titles": {
        "es": "Central Park (North Woods) | El bosque oculto de Manhattan, NY",
        "en": "Central Park (North Woods) | The hidden forest of Manhattan, NY",
        "pt": "Central Park (Bosques do Norte) | A floresta escondida de Manhattan, NY"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/central-park-north-woods-manhattan-ny/",
        "en": "https://spacejourney.app/en/experiencia/central-park-north-woods-the-hidden-forest-of-manhattan-ny/",
        "pt": "https://spacejourney.app/pt-br/experiencia/central-park-bosques-do-norte-a-floresta-escondida-de-manhattan-ny/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/a2cchtzvzte-1024x683.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Central%20Park%20%28North%20Woods%29%20%7C%20The%20hidden%20forest%20of%20Manhattan%2C%20NY%20New%20York&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_NEW-3062",
      "duration": 31,
      "timeMode": "morning"
    }
  ],
  "cdmx": [
    {
      "officialId": 3279,
      "titles": {
        "es": "Templo Mayor: El corazón sagrado del Imperio Mexica",
        "en": "Templo Mayor: The sacred heart of the Mexica Empire",
        "pt": "Templo Mayor: O coração sagrado do Império Mexicano"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/templo-mayor-imperio-mexica-corazon/",
        "en": "https://spacejourney.app/en/experiencia/templo-mayor-the-sacred-heart-of-the-mexica-empire/",
        "pt": "https://spacejourney.app/pt-br/experiencia/templo-mayor-o-coracao-sagrado-do-imperio-mexicano/"
      },
      "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
      "affiliate": "https://www.getyourguide.com/s/?q=Templo%20Mayor%3A%20The%20sacred%20heart%20of%20the%20Mexica%20Empire%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3279",
      "duration": 150,
      "timeMode": "morning"
    },
    {
      "officialId": 3278,
      "titles": {
        "es": "Pujol &#038; Quintonil: El olimpo de la alta cocina mexicana",
        "en": "Pujol &#038; Quintonil: The Olympus of Mexican haute cuisine",
        "pt": "Pujol &#038; Quintonil: O Olimpo da alta gastronomia mexicana"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/pujol-quintonil-alta-cocina-mexicana/",
        "en": "https://spacejourney.app/en/experiencia/pujol-quintonil-the-olympus-of-mexican-haute-cuisine/",
        "pt": "https://spacejourney.app/pt-br/experiencia/pujol-quintonil-o-olimpo-da-alta-gastronomia-mexicana/"
      },
      "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
      "affiliate": "https://www.getyourguide.com/s/?q=Pujol%20%26%23038%3B%20Quintonil%3A%20The%20Olympus%20of%20Mexican%20haute%20cuisine%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3278",
      "duration": 210,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3277,
      "titles": {
        "es": "Museo Nacional de Antropología: El oráculo del tiempo prehispánico",
        "en": "National Museum of Anthropology: The oracle of pre-Hispanic time",
        "pt": "Museu Nacional de Antropologia: O oráculo da época pré-hispânica"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/museo-nacional-antropologia-mexico/",
        "en": "https://spacejourney.app/en/experiencia/national-museum-of-anthropology-the-oracle-of-pre-hispanic-time/",
        "pt": "https://spacejourney.app/pt-br/experiencia/museu-nacional-de-antropologia-o-oraculo-da-epoca-pre-hispanica/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/ndxkwolenku-1024x724.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=National%20Museum%20of%20Anthropology%3A%20The%20oracle%20of%20pre-Hispanic%20time%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3277",
      "duration": 180,
      "timeMode": "morning"
    },
    {
      "officialId": 3276,
      "titles": {
        "es": "Xochimilco: Protocolo de canales privado y mística de las chinampas",
        "en": "Xochimilco: Private channel protocol and mystique of the chinampas",
        "pt": "Xochimilco: Protocolo de canal privado e mística das chinampas"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/xochimilco-protocolo-canales-privado-mistica-chinampas/",
        "en": "https://spacejourney.app/en/experiencia/xochimilco-private-channel-protocol-and-mystique-of-the-chinampas/",
        "pt": "https://spacejourney.app/pt-br/experiencia/xochimilco-protocolo-de-canal-privado-e-mistica-das-chinampas/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/12638539-1024x683.jpeg",
      "affiliate": "https://www.getyourguide.com/s/?q=Xochimilco%3A%20Private%20channel%20protocol%20and%20mystique%20of%20the%20chinampas%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3276",
      "duration": 180,
      "timeMode": "morning"
    },
    {
      "officialId": 3275,
      "titles": {
        "es": "Teotihuacán: Vuelo en globo al amanecer con vista a las pirámides",
        "en": "Teotihuacán: Sunrise Balloon Flight with a View of the Pyramids",
        "pt": "Teotihuacán: voo de balão ao nascer do sol com vista para as pirâmides"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/teotihuacan-vuelo-globo-amanecer-piramides/",
        "en": "https://spacejourney.app/en/experiencia/teotihuacan-sunrise-balloon-flight-with-a-view-of-the-pyramids/",
        "pt": "https://spacejourney.app/pt-br/experiencia/teotihuacan-voo-de-balao-ao-nascer-do-sol-com-vista-para-as-piramides/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/eo9v20ig3z0-1024x684.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Teotihuac%C3%A1n%3A%20Sunrise%20Balloon%20Flight%20with%20a%20View%20of%20the%20Pyramids%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3275",
      "duration": 240,
      "timeMode": "morning"
    },
    {
      "officialId": 3273,
      "titles": {
        "es": "Coyoacán: Callejones de Frida",
        "en": "Coyoacán: Alleys of Frida",
        "pt": "Coyoacán: Becos de Frida"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/coyoacan-callejones-frida-mistica/",
        "en": "https://spacejourney.app/en/experiencia/coyoacan-alleys-of-frida/",
        "pt": "https://spacejourney.app/pt-br/experiencia/coyoacan-becos-de-frida/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-coyoacan-callejones-frida-mistica-v13d-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Coyoac%C3%A1n%3A%20Alleys%20of%20Frida%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3273",
      "duration": 80,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3272,
      "titles": {
        "es": "Biblioteca Vasconcelos: El arca de cristal en CDMX",
        "en": "Vasconcelos Library: The crystal ark in CDMX",
        "pt": "Biblioteca Vasconcelos: A arca de cristal no CDMX"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/biblioteca-vasconcelos-arca-cristal/",
        "en": "https://spacejourney.app/en/experiencia/vasconcelos-library-the-crystal-ark-in-cdmx/",
        "pt": "https://spacejourney.app/pt-br/experiencia/biblioteca-vasconcelos-a-arca-de-cristal-no-cdmx/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/839ab076-ec89-4620-b8fe-a3baf6ca23ed.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Vasconcelos%20Library%3A%20The%20crystal%20ark%20in%20CDMX%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3272",
      "duration": 90,
      "timeMode": "morning"
    },
    {
      "officialId": 3269,
      "titles": {
        "es": "Ex-Convento del Desierto de los Leones: El susurro del bosque",
        "en": "Ex-Convent of the Desert of the Lions: The whisper of the forest",
        "pt": "Ex-Convento do Deserto dos Leões: O sussurro da floresta"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/ex-convento-desierto-leones-susurro-bosque/",
        "en": "https://spacejourney.app/en/experiencia/ex-convent-of-the-desert-of-the-lions-the-whisper-of-the-forest/",
        "pt": "https://spacejourney.app/pt-br/experiencia/ex-convento-do-deserto-dos-leoes-o-sussurro-da-floresta/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-ex-convento-desierto-leones-susurro-bosque-v13d-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Ex-Convent%20of%20the%20Desert%20of%20the%20Lions%3A%20The%20whisper%20of%20the%20forest%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3269",
      "duration": 120,
      "timeMode": "morning"
    },
    {
      "officialId": 3261,
      "titles": {
        "es": "Plaza de San Jacinto (San Ángel): El jardín de los artistas",
        "en": "Plaza de San Jacinto (San Ángel): The artists' garden",
        "pt": "Plaza de San Jacinto (San Ángel): O jardim dos artistas"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/plaza-san-jacinto-jardin-artistas/",
        "en": "https://spacejourney.app/en/experiencia/plaza-de-san-jacinto-san-angel-the-artists-garden/",
        "pt": "https://spacejourney.app/pt-br/experiencia/plaza-de-san-jacinto-san-angel-o-jardim-dos-artistas/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-plaza-san-jacinto-jardin-artistas-v13d-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Plaza%20de%20San%20Jacinto%20%28San%20%C3%81ngel%29%3A%20The%20artists%27%20garden%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3261",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 3258,
      "titles": {
        "es": "Plaza de Santo Domingo: Los portales de la memoria",
        "en": "Plaza de Santo Domingo: The portals of memory",
        "pt": "Plaza de Santo Domingo: Os portais da memória"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/plaza-santo-domingo-portales-memoria/",
        "en": "https://spacejourney.app/en/experiencia/plaza-de-santo-domingo-the-portals-of-memory/",
        "pt": "https://spacejourney.app/pt-br/experiencia/plaza-de-santo-domingo-os-portais-da-memoria/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-plaza-santo-domingo-portales-memoria-v13d-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Plaza%20de%20Santo%20Domingo%3A%20The%20portals%20of%20memory%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3258",
      "duration": 40,
      "timeMode": "morning"
    },
    {
      "officialId": 3149,
      "titles": {
        "es": "Las Islas de CU | El campus que es patrimonio",
        "en": "The Islands of CU | The campus that is heritage",
        "pt": "As Ilhas da CU | O campus que é patrimônio"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/las-islas-de-cu-paisaje-volcanico-y-patrimonio-moderno/",
        "en": "https://spacejourney.app/en/experiencia/the-islands-of-cu-the-campus-that-is-heritage/",
        "pt": "https://spacejourney.app/pt-br/experiencia/as-ilhas-da-cu-o-campus-que-e-patrimonio/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/12570366-1024x683.jpeg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Islands%20of%20CU%20%7C%20The%20campus%20that%20is%20heritage%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3149",
      "duration": 90,
      "timeMode": "morning"
    },
    {
      "officialId": 3148,
      "titles": {
        "es": "Parque México | El oasis elíptico de la Condesa",
        "en": "Mexico Park | The elliptical oasis of the Countess",
        "pt": "Parque México | O oásis elíptico da Condessa"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/parque-mexico-el-corazon-art-deco-de-la-condesa/",
        "en": "https://spacejourney.app/en/experiencia/mexico-park-the-elliptical-oasis-of-the-countess/",
        "pt": "https://spacejourney.app/pt-br/experiencia/parque-mexico-o-oasis-eliptico-da-condessa/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/220caf1f-dd6b-4972-bbf2-70818a5f0194.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Mexico%20Park%20%7C%20The%20elliptical%20oasis%20of%20the%20Countess%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3148",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 3147,
      "titles": {
        "es": "Kiosko Morisco | La joya geométrica de Santa María",
        "en": "Morisco Kiosk | The geometric jewel of Santa María",
        "pt": "Quiosque Morisco | A joia geométrica de Santa María"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/kiosko-morisco-la-joya-de-santa-maria-la-ribera/",
        "en": "https://spacejourney.app/en/experiencia/morisco-kiosk-the-geometric-jewel-of-santa-maria/",
        "pt": "https://spacejourney.app/pt-br/experiencia/quiosque-morisco-a-joia-geometrica-de-santa-maria/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-kiosko-morisco-la-joya-de-santa-maria-la-ribera-v13d-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Morisco%20Kiosk%20%7C%20The%20geometric%20jewel%20of%20Santa%20Mar%C3%ADa%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3147",
      "duration": 45,
      "timeMode": "morning"
    },
    {
      "officialId": 3146,
      "titles": {
        "es": "Audiorama Chapultepec | El refugio del silencio en CDMX",
        "en": "Audiorama Chapultepec | The refuge of silence in CDMX",
        "pt": "Audiorama Chapultepec | O refúgio do silêncio no CDMX"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/audiorama-chapultepec-el-refugio-del-silencio/",
        "en": "https://spacejourney.app/en/experiencia/audiorama-chapultepec-the-refuge-of-silence-in-cdmx/",
        "pt": "https://spacejourney.app/pt-br/experiencia/audiorama-chapultepec-o-refugio-do-silencio-no-cdmx/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-audiorama-chapultepec-el-refugio-del-silencio-v13d-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Audiorama%20Chapultepec%20%7C%20The%20refuge%20of%20silence%20in%20CDMX%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3146",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 3043,
      "titles": {
        "es": "Huerto Roma Verde | El laboratorio de resiliencia urbana",
        "en": "Roma Green Garden | The urban resilience laboratory",
        "pt": "Jardim Verde Roma | O laboratório de resiliência urbana"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/huerto-roma-verde-el-refugio-comunitario-de-cdmx/",
        "en": "https://spacejourney.app/en/experiencia/roma-green-garden-the-urban-resilience-laboratory/",
        "pt": "https://spacejourney.app/pt-br/experiencia/jardim-verde-roma-o-laboratorio-de-resiliencia-urbana/"
      },
      "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
      "affiliate": "https://www.getyourguide.com/s/?q=Roma%20Green%20Garden%20%7C%20The%20urban%20resilience%20laboratory%20Mexico%20City&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_CDM-3043",
      "duration": 90,
      "timeMode": "morning"
    }
  ],
  "paris": [
    {
      "officialId": 3251,
      "titles": {
        "es": "Sainte-Chapelle: El relicario de luz medieval",
        "en": "Sainte-Chapelle: The medieval reliquary of light",
        "pt": "Sainte-Chapelle: O relicário medieval da luz"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/sainte-chapelle-relicario-luz-medieval/",
        "en": "https://spacejourney.app/en/experiencia/sainte-chapelle-the-medieval-reliquary-of-light/",
        "pt": "https://spacejourney.app/pt-br/experiencia/sainte-chapelle-o-relicario-medieval-da-luz/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-sainte-chapelle-relicario-luz-medieval-v13b-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Sainte-Chapelle%3A%20The%20medieval%20reliquary%20of%20light%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3251",
      "duration": 45,
      "timeMode": "morning"
    },
    {
      "officialId": 3250,
      "titles": {
        "es": "Cena en el Sena: El crucero de cristal y luces en Paris",
        "en": "Dinner on the Seine: The glass and lights cruise in Paris",
        "pt": "Jantar no Sena: O cruzeiro de vidro e luzes em Paris"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/cena-sena-crucero-cristal-luces/",
        "en": "https://spacejourney.app/en/experiencia/dinner-on-the-seine-the-glass-and-lights-cruise-in-paris/",
        "pt": "https://spacejourney.app/pt-br/experiencia/jantar-no-sena-o-cruzeiro-de-vidro-e-luzes-em-paris/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-cena-sena-crucero-cristal-luces-v13b-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Dinner%20on%20the%20Seine%3A%20The%20glass%20and%20lights%20cruise%20in%20Paris%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3250",
      "duration": 150,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3249,
      "titles": {
        "es": "Musée d'Orsay: Impresionismo en la antigua estación",
        "en": "Musée d'Orsay: Impressionism in the old station",
        "pt": "Musée d'Orsay: Impressionismo na antiga estação"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/musee-dorsay-impresionismo-antigua-estacion/",
        "en": "https://spacejourney.app/en/experiencia/musee-dorsay-impressionism-in-the-old-station/",
        "pt": "https://spacejourney.app/pt-br/experiencia/musee-dorsay-impressionismo-na-antiga-estacao/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-musee-dorsay-impresionismo-antigua-estacion-v13b-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Mus%C3%A9e%20d%27Orsay%3A%20Impressionism%20in%20the%20old%20station%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3249",
      "duration": 90,
      "timeMode": "morning"
    },
    {
      "officialId": 3247,
      "titles": {
        "es": "Opéra Garnier: El palacio de la música y el oro en Paris",
        "en": "Opéra Garnier: The palace of music and gold in Paris",
        "pt": "Ópera Garnier: O palácio da música e do ouro em Paris"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/opera-garnier-palacio-musica-oro/",
        "en": "https://spacejourney.app/en/experiencia/opera-garnier-the-palace-of-music-and-gold-in-paris/",
        "pt": "https://spacejourney.app/pt-br/experiencia/opera-garnier-o-palacio-da-musica-e-do-ouro-em-paris/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-opera-garnier-palacio-musica-oro-v13b-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Op%C3%A9ra%20Garnier%3A%20The%20palace%20of%20music%20and%20gold%20in%20Paris%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3247",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 3246,
      "titles": {
        "es": "Catacumbas de París: El imperio de la muerte",
        "en": "Paris Catacombs: The Empire of Death",
        "pt": "Catacumbas de Paris: O Império da Morte"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/catacumbas-paris-imperio-muerte-vip/",
        "en": "https://spacejourney.app/en/experiencia/paris-catacombs-the-empire-of-death/",
        "pt": "https://spacejourney.app/pt-br/experiencia/catacumbas-de-paris-o-imperio-da-morte/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-catacumbas-paris-imperio-muerte-vip-v13b-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Paris%20Catacombs%3A%20The%20Empire%20of%20Death%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3246",
      "duration": 90,
      "timeMode": "morning"
    },
    {
      "officialId": 3243,
      "titles": {
        "es": "Torre Eiffel: El mirador del Trocadéro",
        "en": "Eiffel Tower: The Trocadéro viewpoint",
        "pt": "Torre Eiffel: o mirante do Trocadéro"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/torre-eiffel-el-mirador-del-trocadero/",
        "en": "https://spacejourney.app/en/experiencia/eiffel-tower-the-trocadero-viewpoint/",
        "pt": "https://spacejourney.app/pt-br/experiencia/torre-eiffel-o-mirante-do-trocadero/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/pexels-landscape-Eiffel-Tower-sunrise-beautiful-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Eiffel%20Tower%3A%20The%20Trocad%C3%A9ro%20viewpoint%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3243",
      "duration": 40,
      "timeMode": "morning"
    },
    {
      "officialId": 3238,
      "titles": {
        "es": "Passage des Panoramas: El laberinto de cristal y sellos",
        "en": "Passage des Panoramas: The glass and seal labyrinth",
        "pt": "Passage des Panoramas: O labirinto de vidro e selo"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/passage-des-panoramas-el-laberinto-de-cristal-y-sellos/",
        "en": "https://spacejourney.app/en/experiencia/passage-des-panoramas-the-glass-and-seal-labyrinth/",
        "pt": "https://spacejourney.app/pt-br/experiencia/passage-des-panoramas-o-labirinto-de-vidro-e-selo/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-passage-des-panoramas-el-laberinto-de-cristal-y-sellos-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Passage%20des%20Panoramas%3A%20The%20glass%20and%20seal%20labyrinth%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3238",
      "duration": 45,
      "timeMode": "morning"
    },
    {
      "officialId": 3235,
      "titles": {
        "es": "Musée de la Vie Romantique: El jardín de las ideas",
        "en": "Musée de la Vie Romantique: The garden of ideas",
        "pt": "Musée de la Vie Romantique: O jardim das ideias"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/musee-de-la-vie-romantique-el-jardin-escondido-de-pigalle/",
        "en": "https://spacejourney.app/en/experiencia/musee-de-la-vie-romantique-the-garden-of-ideas/",
        "pt": "https://spacejourney.app/pt-br/experiencia/musee-de-la-vie-romantique-o-jardim-das-ideias/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-musee-de-la-vie-romantique-el-jardin-escondido-de-pigalle-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Mus%C3%A9e%20de%20la%20Vie%20Romantique%3A%20The%20garden%20of%20ideas%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3235",
      "duration": 50,
      "timeMode": "morning"
    },
    {
      "officialId": 3226,
      "titles": {
        "es": "Maison de Victor Hugo: El alma de la Place des Vosges",
        "en": "Victor Hugo's Maison: The soul of the Place des Vosges",
        "pt": "Maison de Victor Hugo: A alma da Place des Vosges"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/maison-victor-hugo-paris-place-des-vosges/",
        "en": "https://spacejourney.app/en/experiencia/victor-hugos-maison-the-soul-of-the-place-des-vosges/",
        "pt": "https://spacejourney.app/pt-br/experiencia/maison-de-victor-hugo-a-alma-da-place-des-vosges/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-maison-victor-hugo-paris-place-des-vosges-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Victor%20Hugo%27s%20Maison%3A%20The%20soul%20of%20the%20Place%20des%20Vosges%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3226",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 3156,
      "titles": {
        "es": "Arènes de Lutèce: El eco de la Galia romana",
        "en": "Arènes de Lutèce: The echo of Roman Gaul",
        "pt": "Arènes de Lutèce: O eco da Gália Romana"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/arenes-de-lutece-el-eco-de-la-galia-romana/",
        "en": "https://spacejourney.app/en/experiencia/arenes-de-lutece-the-echo-of-roman-gaul/",
        "pt": "https://spacejourney.app/pt-br/experiencia/arenes-de-lutece-o-eco-da-galia-romana/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-arenes-de-lutece-el-eco-de-la-galia-romana-1024x576.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Ar%C3%A8nes%20de%20Lut%C3%A8ce%3A%20The%20echo%20of%20Roman%20Gaul%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3156",
      "duration": 45,
      "timeMode": "morning"
    },
    {
      "officialId": 3153,
      "titles": {
        "es": "Canal Saint-Martin: La arteria bohemia de París",
        "en": "Canal Saint-Martin: The bohemian artery of Paris",
        "pt": "Canal Saint-Martin: a artéria boêmia de Paris"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/canal-saint-martin-el-paris-bohemio-y-sus-esclusas/",
        "en": "https://spacejourney.app/en/experiencia/canal-saint-martin-the-bohemian-artery-of-paris/",
        "pt": "https://spacejourney.app/pt-br/experiencia/canal-saint-martin-a-arteria-boemia-de-paris/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/14348452-1024x683.jpeg",
      "affiliate": "https://www.getyourguide.com/s/?q=Canal%20Saint-Martin%3A%20The%20bohemian%20artery%20of%20Paris%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3153",
      "duration": 120,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3152,
      "titles": {
        "es": "Square du Vert-Galant: La proa de la Isla de la Cité",
        "en": "Square du Vert-Galant: The bow of the Ile de la Cité",
        "pt": "Square du Vert-Galant: a proa da Ile de la Cité"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/square-du-vert-galant-la-proa-de-la-isla-de-la-cite/",
        "en": "https://spacejourney.app/en/experiencia/square-du-vert-galant-the-bow-of-the-ile-de-la-cite/",
        "pt": "https://spacejourney.app/pt-br/experiencia/square-du-vert-galant-a-proa-da-ile-de-la-cite/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/0b910532-1c1b-4007-8311-58d5496b66d3.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Square%20du%20Vert-Galant%3A%20The%20bow%20of%20the%20Ile%20de%20la%20Cit%C3%A9%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3152",
      "duration": 45,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3151,
      "titles": {
        "es": "Jardin du Luxembourg: La elegancia del Barrio Latino",
        "en": "Jardin du Luxembourg: The elegance of the Latin Quarter",
        "pt": "Jardin du Luxembourg: a elegância do Quartier Latin"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/jardin-du-luxembourg-la-elegancia-del-barrio-latino/",
        "en": "https://spacejourney.app/en/experiencia/jardin-du-luxembourg-the-elegance-of-the-latin-quarter/",
        "pt": "https://spacejourney.app/pt-br/experiencia/jardin-du-luxembourg-a-elegancia-do-quartier-latin/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/pexels-landscape-Luxembourg-Palace-Paris-sunny-1024x683.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Jardin%20du%20Luxembourg%3A%20The%20elegance%20of%20the%20Latin%20Quarter%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3151",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 3150,
      "titles": {
        "es": "Promenade Plantée: El jardín elevado de París",
        "en": "Promenade Plantée: The elevated garden of Paris",
        "pt": "Promenade Plantée: O jardim elevado de Paris"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/promenade-plantee-el-jardin-elevado-de-paris/",
        "en": "https://spacejourney.app/en/experiencia/promenade-plantee-the-elevated-garden-of-paris/",
        "pt": "https://spacejourney.app/pt-br/experiencia/promenade-plantee-o-jardim-elevado-de-paris/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/bypass-landscape-promenade-plantee-el-jardin-elevado-de-paris-1024x681.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Promenade%20Plant%C3%A9e%3A%20The%20elevated%20garden%20of%20Paris%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3150",
      "duration": 90,
      "timeMode": "morning"
    },
    {
      "officialId": 3054,
      "titles": {
        "es": "Parc des Buttes-Chaumont | El templo sobre el abismo",
        "en": "Parc des Buttes-Chaumont | The temple over the abyss",
        "pt": "Parque des Buttes-Chaumont | O templo sobre o abismo"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/buttes-chaumont-templo-sibila-abismo/",
        "en": "https://spacejourney.app/en/experiencia/parc-des-buttes-chaumont-the-temple-over-the-abyss/",
        "pt": "https://spacejourney.app/pt-br/experiencia/parque-des-buttes-chaumont-o-templo-sobre-o-abismo/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/gznhhbmex7u-1024x768.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Parc%20des%20Buttes-Chaumont%20%7C%20The%20temple%20over%20the%20abyss%20Paris&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_PAR-3054",
      "duration": 75,
      "timeMode": "afternoon"
    }
  ],
  "londres": [
    {
      "officialId": 3140,
      "titles": {
        "es": "Churchill War Rooms | El búnker de la libertad",
        "en": "Churchill War Rooms | The freedom bunker",
        "pt": "Salas de Guerra de Churchill | O bunker da liberdade"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/churchill-war-rooms-bunker-premium/",
        "en": "https://spacejourney.app/en/experiencia/churchill-war-rooms-the-freedom-bunker/",
        "pt": "https://spacejourney.app/pt-br/experiencia/salas-de-guerra-de-churchill-o-bunker-da-liberdade/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/9edc6c0f-961c-4164-ad77-e74ddd4ffc71.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Churchill%20War%20Rooms%20%7C%20The%20freedom%20bunker%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-3140",
      "duration": 100,
      "timeMode": "morning"
    },
    {
      "officialId": 3139,
      "titles": {
        "es": "Kensington Palace | El jardín de las memorias reales",
        "en": "Kensington Palace | The garden of royal memories",
        "pt": "Palácio de Kensington | O jardim das memórias reais"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/kensington-palace-jardines-reales-premium/",
        "en": "https://spacejourney.app/en/experiencia/kensington-palace-the-garden-of-royal-memories/",
        "pt": "https://spacejourney.app/pt-br/experiencia/palacio-de-kensington-o-jardim-das-memorias-reais/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/4bad56a5-3560-4237-99a2-95fe903477ec.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Kensington%20Palace%20%7C%20The%20garden%20of%20royal%20memories%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-3139",
      "duration": 90,
      "timeMode": "afternoon"
    },
    {
      "officialId": 3137,
      "titles": {
        "es": "Westminster Abbey | El susurro de la historia en piedra (Verger Tour)",
        "en": "Westminster Abbey The whisper of history in stone (Verger Tour)",
        "pt": "Abadia de Westminster O sussurro da história em pedra (Verger Tour)"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/westminster-abbey-tour-guiado-sacristan-premium/",
        "en": "https://spacejourney.app/en/experiencia/westminster-abbey-the-whisper-of-history-in-stone-verger-tour/",
        "pt": "https://spacejourney.app/pt-br/experiencia/abadia-de-westminster-o-sussurro-da-historia-em-pedra-verger-tour/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/33334264-1024x680.jpeg",
      "affiliate": "https://www.getyourguide.com/s/?q=Westminster%20Abbey%20The%20whisper%20of%20history%20in%20stone%20%28Verger%20Tour%29%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-3137",
      "duration": 120,
      "timeMode": "morning"
    },
    {
      "officialId": 3033,
      "titles": {
        "es": "Cutty Sark | El gigante de cobre bajo el cristal",
        "en": "Cutty Sark | The copper giant under the glass",
        "pt": "Cutty Sark | O gigante de cobre sob o vidro"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/cutty-sark-gigante-cobre-cristal/",
        "en": "https://spacejourney.app/en/experiencia/cutty-sark-the-copper-giant-under-the-glass/",
        "pt": "https://spacejourney.app/pt-br/experiencia/cutty-sark-o-gigante-de-cobre-sob-o-vidro/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/o-rjptppb0u-1024x494.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Cutty%20Sark%20%7C%20The%20copper%20giant%20under%20the%20glass%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-3033",
      "duration": 2,
      "timeMode": "morning"
    },
    {
      "officialId": 2912,
      "titles": {
        "es": "Tower of London: Protocolo de primer acceso y Ceremonia de las llaves",
        "en": "Tower of London: First Access Protocol and Key Ceremony",
        "pt": "Torre de Londres: Primeiro Protocolo de Acesso e Cerimônia de Chave"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/tower-of-london-primer-acceso-ceremonia-llaves/",
        "en": "https://spacejourney.app/en/experiencia/tower-of-london-first-access-protocol-and-key-ceremony/",
        "pt": "https://spacejourney.app/pt-br/experiencia/torre-de-londres-primeiro-protocolo-de-acesso-e-cerimonia-de-chave/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/05/nsotqaul-4-1024x683.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Tower%20of%20London%3A%20First%20Access%20Protocol%20and%20Key%20Ceremony%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-2912",
      "duration": 3,
      "timeMode": "morning"
    },
    {
      "officialId": 2821,
      "titles": {
        "es": "Primrose Hill | El horizonte de Londres",
        "en": "Primrose Hill | London skyline",
        "pt": "Colina da Prímula | Horizonte de Londres"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/primrose-hill-londres-amanecer-mirador-secreto/",
        "en": "https://spacejourney.app/en/experiencia/primrose-hill-london-skyline/",
        "pt": "https://spacejourney.app/pt-br/experiencia/colina-da-primula-horizonte-de-londres/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/wkyfavx8uc8-1024x679.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Primrose%20Hill%20%7C%20London%20skyline%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-2821",
      "duration": 8,
      "timeMode": "morning"
    },
    {
      "officialId": 2814,
      "titles": {
        "es": "Sky Garden | El bosque en las nubes",
        "en": "Sky Garden | The forest in the clouds",
        "pt": "Jardim do Céu | A floresta nas nuvens"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/sky-garden-londres-como-entrar-gratis/",
        "en": "https://spacejourney.app/en/experiencia/sky-garden-the-forest-in-the-clouds/",
        "pt": "https://spacejourney.app/pt-br/experiencia/jardim-do-ceu-a-floresta-nas-nuvens/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/17c5730f-1332-4381-a173-22a93b96f132.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Sky%20Garden%20%7C%20The%20forest%20in%20the%20clouds%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-2814",
      "duration": 6,
      "timeMode": "afternoon"
    },
    {
      "officialId": 2807,
      "titles": {
        "es": "St Katharine Docks | El puerto secreto del Tower Bridge",
        "en": "St Katharine Docks | The secret port of Tower Bridge",
        "pt": "Docas de Santa Catarina | O porto secreto da Tower Bridge"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/st-katharine-docks-londres-puerto-secreto-tower-bridge/",
        "en": "https://spacejourney.app/en/experiencia/st-katharine-docks-the-secret-port-of-tower-bridge/",
        "pt": "https://spacejourney.app/pt-br/experiencia/docas-de-santa-catarina-o-porto-secreto-da-tower-bridge/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/00d818a9-8209-4082-9dec-f51769c2e1bb.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=St%20Katharine%20Docks%20%7C%20The%20secret%20port%20of%20Tower%20Bridge%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-2807",
      "duration": 1245,
      "timeMode": "afternoon"
    },
    {
      "officialId": 2798,
      "titles": {
        "es": "BAPS Shri Swaminarayan Mandir | El templo hindú oculto",
        "en": "BAPS Shri Swaminarayan Mandir | The hidden Hindu temple",
        "pt": "BAPS Shri Swaminarayan Mandir | O templo hindu escondido"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/baps-shri-swaminarayan-mandir-londres-templo-hindu-oculto/",
        "en": "https://spacejourney.app/en/experiencia/baps-shri-swaminarayan-mandir-the-hidden-hindu-temple/",
        "pt": "https://spacejourney.app/pt-br/experiencia/baps-shri-swaminarayan-mandir-o-templo-hindu-escondido/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/51998c36-df66-46a3-b778-49ec9832d4d5.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=BAPS%20Shri%20Swaminarayan%20Mandir%20%7C%20The%20hidden%20Hindu%20temple%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-2798",
      "duration": 120,
      "timeMode": "morning"
    },
    {
      "officialId": 2786,
      "titles": {
        "es": "Leadenhall Market | El callejón Diagon a las 6:00 am",
        "en": "Leadenhall Market | Diagon Alley at 6:00 am",
        "pt": "Mercado Leadenhall | Beco Diagonal às 6h"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/leadenhall-market-callejon-diagon-amanecer/",
        "en": "https://spacejourney.app/en/experiencia/leadenhall-market-diagon-alley-at-600-am/",
        "pt": "https://spacejourney.app/pt-br/experiencia/mercado-leadenhall-beco-diagonal-as-6h/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/dc7uwjrnags-1024x683.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Leadenhall%20Market%20%7C%20Diagon%20Alley%20at%206%3A00%20am%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-2786",
      "duration": 45,
      "timeMode": "morning"
    },
    {
      "officialId": 2771,
      "titles": {
        "es": "The Queen's Walk | Paseo del Támesis",
        "en": "The Queen's Walk | Thames Walk",
        "pt": "A caminhada da rainha | Caminhada pelo Tâmisa"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/queens-walk-londres-paseo-tamesis/",
        "en": "https://spacejourney.app/en/experiencia/the-queens-walk-thames-walk/",
        "pt": "https://spacejourney.app/pt-br/experiencia/a-caminhada-da-rainha-caminhada-pelo-tamisa/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/ujiiuat1hz0-1024x767.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Queen%27s%20Walk%20%7C%20Thames%20Walk%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-2771",
      "duration": 89,
      "timeMode": "afternoon"
    },
    {
      "officialId": 2764,
      "titles": {
        "es": "Kyoto Garden: El jardín japonés en Londres",
        "en": "Kyoto Garden: The Japanese garden in London",
        "pt": "Jardim de Kyoto: o jardim japonês em Londres"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/kyoto-garden-londres-jardin-japones/",
        "en": "https://spacejourney.app/en/experiencia/kyoto-garden-the-japanese-garden-in-london/",
        "pt": "https://spacejourney.app/pt-br/experiencia/jardim-de-kyoto-o-jardim-japones-em-londres/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/6d3eaf4d-cdae-41e6-977f-4b96a5c7771b.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Kyoto%20Garden%3A%20The%20Japanese%20garden%20in%20London%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-2764",
      "duration": 90,
      "timeMode": "morning"
    },
    {
      "officialId": 2753,
      "titles": {
        "es": "Little Venice: El paseo más tranquilo por los canales de Londres",
        "en": "Little Venice: The quietest walk through London's canals",
        "pt": "Little Venice: o passeio mais tranquilo pelos canais de Londres"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/little-venice-londres-canales-tranquilidad/",
        "en": "https://spacejourney.app/en/experiencia/little-venice-the-quietest-walk-through-londons-canals/",
        "pt": "https://spacejourney.app/pt-br/experiencia/little-venice-o-passeio-mais-tranquilo-pelos-canais-de-londres/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/unwohpmx8sw-1024x683.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Little%20Venice%3A%20The%20quietest%20walk%20through%20London%27s%20canals%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-2753",
      "duration": 89,
      "timeMode": "morning"
    },
    {
      "officialId": 2746,
      "titles": {
        "es": "Barbican Conservatory: El oasis solarpunk de Londres",
        "en": "Barbican Conservatory: London's solarpunk oasis",
        "pt": "Conservatório Barbican: o oásis solarpunk de Londres"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/barbican-conservatory-londres-oasis-solarpunk/",
        "en": "https://spacejourney.app/en/experiencia/barbican-conservatory-londons-solarpunk-oasis/",
        "pt": "https://spacejourney.app/pt-br/experiencia/conservatorio-barbican-o-oasis-solarpunk-de-londres/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/a318db16-e725-4f25-bc3b-9ce030769be0.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Barbican%20Conservatory%3A%20London%27s%20solarpunk%20oasis%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-2746",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 560,
      "titles": {
        "es": "St Dunstan in the East: El jardín entre las ruinas",
        "en": "St Dunstan in the East: The Garden Among the Ruins",
        "pt": "St Dunstan no Oriente: o jardim entre as ruínas"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/st-dunstan-in-the-east-londres-jardin/",
        "en": "https://spacejourney.app/en/experiencia/st-dunstan-in-the-east-the-garden-among-the-ruins/",
        "pt": "https://spacejourney.app/pt-br/experiencia/st-dunstan-no-oriente-o-jardim-entre-as-ruinas/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/02/St-Dunstan-in-the-East-London-Main-Wide-Fotorealistic-1024x572.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=St%20Dunstan%20in%20the%20East%3A%20The%20Garden%20Among%20the%20Ruins%20London&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_LON-560",
      "duration": 60,
      "timeMode": "afternoon"
    }
  ],
  "roma": [
    {
      "officialId": 2671,
      "titles": {
        "es": "Castel Sant'Angelo: El corredor secreto",
        "en": "Castel Sant'Angelo: The secret corridor",
        "pt": "Castel Sant'Angelo: O corredor secreto"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/castillo-sant-angelo-entradas-oficiales-roma/",
        "en": "https://spacejourney.app/en/experiencia/castel-santangelo-the-secret-corridor/",
        "pt": "https://spacejourney.app/pt-br/experiencia/castel-santangelo-o-corredor-secreto/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/292541fe-36cf-4333-9af9-49ae4b425401.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Castel%20Sant%27Angelo%3A%20The%20secret%20corridor%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2671",
      "duration": 90,
      "timeMode": "afternoon"
    },
    {
      "officialId": 2659,
      "titles": {
        "es": "Galleria Borghese: La perfección escultórica",
        "en": "Galleria Borghese: Sculptural perfection",
        "pt": "Galleria Borghese: perfeição escultural"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/galleria-borghese-entradas-oficiales-guia-bernini/",
        "en": "https://spacejourney.app/en/experiencia/galleria-borghese-sculptural-perfection/",
        "pt": "https://spacejourney.app/pt-br/experiencia/galleria-borghese-perfeicao-escultural/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/9kngv0hk3au-1024x683.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Galleria%20Borghese%3A%20Sculptural%20perfection%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2659",
      "duration": 120,
      "timeMode": "morning"
    },
    {
      "officialId": 2651,
      "titles": {
        "es": "Museos Vaticanos & Capilla Sixtina",
        "en": "Vatican Museums & Sistine Chapel",
        "pt": "Museus e Museus do Vaticano Capela Sistina"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/museos-vaticanos-capilla-sixtina-entradas-oficiales/",
        "en": "https://spacejourney.app/en/experiencia/vatican-museums-sistine-chapel/",
        "pt": "https://spacejourney.app/pt-br/experiencia/museus-e-museus-do-vaticano-capela-sistina/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/si2eyuamw9m-1024x392.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Vatican%20Museums%20%26%20Sistine%20Chapel%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2651",
      "duration": 180,
      "timeMode": "morning"
    },
    {
      "officialId": 2642,
      "titles": {
        "es": "Coliseo, Foro Romano & Monte Palatino",
        "en": "Colosseum, Roman Forum & Palatine Hill",
        "pt": "Coliseu, Fórum Romano e Roma Monte Palatino"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/coliseo-foro-romano-entradas-oficiales-guia/",
        "en": "https://spacejourney.app/en/experiencia/colosseum-roman-forum-palatine-hill/",
        "pt": "https://spacejourney.app/pt-br/experiencia/coliseu-forum-romano-e-roma-monte-palatino/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/3om3q0wtjlm-1024x683.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Colosseum%2C%20Roman%20Forum%20%26%20Palatine%20Hill%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2642",
      "duration": 180,
      "timeMode": "morning"
    },
    {
      "officialId": 2633,
      "titles": {
        "es": "Fontana di Trevi en silencio: El ritual del agua",
        "en": "Trevi Fountain in silence: The ritual of water",
        "pt": "Fontana di Trevi em silêncio: O ritual da água"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/fontana-di-trevi-en-silencio-el-ritual-del-agua/",
        "en": "https://spacejourney.app/en/experiencia/trevi-fountain-in-silence-the-ritual-of-water/",
        "pt": "https://spacejourney.app/pt-br/experiencia/fontana-di-trevi-em-silencio-o-ritual-da-agua/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/i1lv2yx67gi-1024x683.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Trevi%20Fountain%20in%20silence%3A%20The%20ritual%20of%20water%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2633",
      "duration": 45,
      "timeMode": "morning"
    },
    {
      "officialId": 2625,
      "titles": {
        "es": "El Panteón: El portal de luz",
        "en": "The Pantheon: The portal of light",
        "pt": "O Panteão: O portal da luz"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/panteon-roma-portal-de-luz-secreto/",
        "en": "https://spacejourney.app/en/experiencia/the-pantheon-the-portal-of-light/",
        "pt": "https://spacejourney.app/pt-br/experiencia/o-panteao-o-portal-da-luz/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/tlyzsnu8md0-1024x683.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Pantheon%3A%20The%20portal%20of%20light%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2625",
      "duration": 60,
      "timeMode": "morning"
    },
    {
      "officialId": 2616,
      "titles": {
        "es": "Parco degli acquedotti: Los gigantes de piedra",
        "en": "Parco degli acquedotti: The stone giants",
        "pt": "Parco degli acquedotti: Os gigantes de pedra"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/parque-de-los-acueductos-roma-secreta/",
        "en": "https://spacejourney.app/en/experiencia/parco-degli-acquedotti-the-stone-giants/",
        "pt": "https://spacejourney.app/pt-br/experiencia/parco-degli-acquedotti-os-gigantes-de-pedra/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/32a1ecbf-d3dc-494c-8531-0a4d04f40382.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Parco%20degli%20acquedotti%3A%20The%20stone%20giants%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2616",
      "duration": 120,
      "timeMode": "afternoon"
    },
    {
      "officialId": 2603,
      "titles": {
        "es": "Via appia antica: El ritmo de la eternidad",
        "en": "Via appia antica: The rhythm of eternity",
        "pt": "Via appia antica: O ritmo da eternidade"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/via-appia-antica-el-ritmo-de-la-eternidad/",
        "en": "https://spacejourney.app/en/experiencia/via-appia-antica-the-rhythm-of-eternity/",
        "pt": "https://spacejourney.app/pt-br/experiencia/via-appia-antica-o-ritmo-da-eternidade/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/efa41f36-f333-4dcd-a697-76751cbe0258.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Via%20appia%20antica%3A%20The%20rhythm%20of%20eternity%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2603",
      "duration": 150,
      "timeMode": "morning"
    },
    {
      "officialId": 2588,
      "titles": {
        "es": "Garbatella: El pueblo jardín dentro de Roma",
        "en": "Garbatella: The garden village within Rome",
        "pt": "Garbatella: a vila-jardim em Roma"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/garbatella-el-pueblo-jardin-dentro-de-roma/",
        "en": "https://spacejourney.app/en/experiencia/garbatella-the-garden-village-within-rome/",
        "pt": "https://spacejourney.app/pt-br/experiencia/garbatella-a-vila-jardim-em-roma/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/1600e33a-f814-4c1d-8d1b-86fb91c2ad3a.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=Garbatella%3A%20The%20garden%20village%20within%20Rome%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2588",
      "duration": 105,
      "timeMode": "afternoon"
    },
    {
      "officialId": 2569,
      "titles": {
        "es": "El Gianicolo: La colina panorámica de Roma",
        "en": "The Gianicolo: Rome's panoramic hill",
        "pt": "O Gianicolo: a colina panorâmica de Roma"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/el-gianicolo-vista-panoramica-de-roma/",
        "en": "https://spacejourney.app/en/experiencia/the-gianicolo-romes-panoramic-hill/",
        "pt": "https://spacejourney.app/pt-br/experiencia/o-gianicolo-a-colina-panoramica-de-roma/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/Gianicolo-Roma-Horizontal-Space-Journey-1024x572.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Gianicolo%3A%20Rome%27s%20panoramic%20hill%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2569",
      "duration": 90,
      "timeMode": "morning"
    },
    {
      "officialId": 2557,
      "titles": {
        "es": "El Vittoriano: La mirada de las cuadrigas",
        "en": "The Vittoriano: The look of the chariots",
        "pt": "O Vittoriano: O visual das carruagens"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/vittoriano-terraza-cuadrigas-premium/",
        "en": "https://spacejourney.app/en/experiencia/the-vittoriano-the-look-of-the-chariots/",
        "pt": "https://spacejourney.app/pt-br/experiencia/o-vittoriano-o-visual-das-carruagens/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/vt_5jmfufya-1024x683.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Vittoriano%3A%20The%20look%20of%20the%20chariots%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2557",
      "duration": 60,
      "timeMode": "afternoon"
    },
    {
      "officialId": 2282,
      "titles": {
        "es": "El Vittoriano: La máquina del tiempo en mármol",
        "en": "The Vittoriano: The marble time machine",
        "pt": "O Vittoriano: A máquina do tempo do mármore"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/vittoriano-altare-della-patria-roma/",
        "en": "https://spacejourney.app/en/experiencia/the-vittoriano-the-marble-time-machine/",
        "pt": "https://spacejourney.app/pt-br/experiencia/o-vittoriano-a-maquina-do-tempo-do-marmore/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/dacdebdqjpk-1024x675.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Vittoriano%3A%20The%20marble%20time%20machine%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2282",
      "duration": 120,
      "timeMode": "morning"
    },
    {
      "officialId": 2164,
      "titles": {
        "es": "El Coliseo romano: visita exterior",
        "en": "The Roman Colosseum: exterior visit",
        "pt": "O Coliseu Romano: visita exterior"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/coliseo-exterior-gratis-roma/",
        "en": "https://spacejourney.app/en/experiencia/the-roman-colosseum-exterior-visit/",
        "pt": "https://spacejourney.app/pt-br/experiencia/o-coliseu-romano-visita-exterior/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/04/qh0c7c5gjj8-1024x683.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20Roman%20Colosseum%3A%20exterior%20visit%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-2164",
      "duration": 120,
      "timeMode": "morning"
    },
    {
      "officialId": 482,
      "titles": {
        "es": "El jardín de los naranjos y la llave secreta",
        "en": "The orange garden and the secret key",
        "pt": "O jardim de laranjas e a chave secreta"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/giardino-degli-aranci-roma-llave/",
        "en": "https://spacejourney.app/en/experiencia/the-orange-garden-and-the-secret-key/",
        "pt": "https://spacejourney.app/pt-br/experiencia/o-jardim-de-laranjas-e-a-chave-secreta/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/02/Giardino-degli-Aranco-Space-Journey-Horizontal-1024x434.jpg",
      "affiliate": "https://www.getyourguide.com/s/?q=The%20orange%20garden%20and%20the%20secret%20key%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-482",
      "duration": 90,
      "timeMode": "afternoon"
    },
    {
      "officialId": 182,
      "titles": {
        "es": "Trastevere: El susurro de los adoquines",
        "en": "Trastevere: The whisper of the cobblestones",
        "pt": "Trastevere: o sussurro dos paralelepípedos"
      },
      "links": {
        "es": "https://spacejourney.app/experiencia/que-ver-en-trastevere-roma/",
        "en": "https://spacejourney.app/en/experiencia/trastevere-the-whisper-of-the-cobblestones/",
        "pt": "https://spacejourney.app/pt-br/experiencia/trastevere-o-sussurro-dos-paralelepipedos/"
      },
      "image": "https://spacejourney.app/wp-content/uploads/2026/02/Trastevere-Space-Journey-Horizontal-1024x572.png",
      "affiliate": "https://www.getyourguide.com/s/?q=Trastevere%3A%20The%20whisper%20of%20the%20cobblestones%20Rome&partner_id=IKMIGHN&utm_medium=online_publisher&cmp=mcp_ROM-182",
      "duration": 90,
      "timeMode": "afternoon"
    }
  ]
};

const TOOLS = [
  {
    name: "plan_contemplative_journey",
    description: "Design memorable, transformative travel itineraries with human pacing, unforgettable cultural wonder, and authentic local sanctuaries. Balances iconic landmarks with serene pauses, golden-hour light, and zero-friction sync with the Space Journey Trip Planner.",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", description: "Destination city or region (e.g., Rome, Paris, CDMX, Tokyo, Kyoto, Barcelona, Lisbon, London, Bogota, Medellin, New York, Miami)" },
        duration_days: { type: "integer", description: "Duration of stay in days (1-7)", default: 3 },
        origin: { type: "string", description: "Origin city or airport code (e.g., Bogota, Madrid, NYC, BOG, MAD)" },
        agency_name: { type: "string", description: "Optional travel agency name or bot identity for co-branded public shared routes" },
        traveler_profile: { type: "string", description: "Travel style (contemplative, romantic, cultural, solo explorer, family, slow food)", default: "contemplative" },
        language: { type: "string", description: "Language for the journey guide (en, es, pt)", default: "es" }
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
        category: { type: "string", description: "Service category (hotels, activities, flights, esim, transfers, luggage, compensation, insurance)", default: "hotels" },
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

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Helper para generar URLs oficiales con el estándar de afiliación de Space Journey
function buildTravelPayoutsUrl(campaignId, programId, targetUrl) {
  return "https://tp.media/r?campaign_id=" + campaignId + "&marker=745480&p=" + programId + "&sub_id=sj-mcp&trs=545304&u=" + encodeURIComponent(targetUrl);
}

async function handlePlanJourney(args) {
  const destRaw = (args.destination || "Roma").trim();
  const destKey = CITY_KEY_MAP[destRaw.toLowerCase()] || destRaw.toLowerCase();
  const days = Math.min(Math.max(args.duration_days || 3, 1), 7);
  const lang = (["en", "pt", "pt-br"].includes(args.language?.toLowerCase())) ? args.language.toLowerCase() : "es";
  const originRaw = args.origin ? args.origin.toLowerCase().trim() : null;
  const agencyName = args.agency_name ? args.agency_name.trim() : (args.author_name ? args.author_name.trim() : "Space Journey");
  const isAgency = agencyName !== "Space Journey";

  // Telemetría de vuelo Kairós
  let flightBadge = "";
  let originIata = "";
  let destIata = "";
  if (AIRPORTS[destKey]) {
    destIata = AIRPORTS[destKey].iata;
  }
  if (originRaw && AIRPORTS[originRaw]) {
    originIata = AIRPORTS[originRaw].iata;
  }
  if (originIata && destIata && AIRPORTS[originRaw] && AIRPORTS[destKey]) {
    const a1 = AIRPORTS[originRaw];
    const a2 = AIRPORTS[destKey];
    const km = haversine(a1.lat, a1.lng, a2.lat, a2.lng);
    const hrs = Math.floor(km / 800) + 1;
    const mins = Math.round((km % 800) / 800 * 60);
    flightBadge = "✈️ " + originIata + " -> " + destIata + " (~" + hrs + "h " + mins + "m)";
  }

  // 1. DÍA 0: Preparativos & Conectividad (Servicios Auxiliares de Alta Conversión)
  const flightParam = (originIata && destIata) ? ("?params=" + originIata + destIata + "1") : (destIata ? ("?params=" + destIata + "1") : "");
  const aviasalesUrl = buildTravelPayoutsUrl("100", "4114", "https://www.aviasales.com/" + flightParam);
  const welcomeUrl = buildTravelPayoutsUrl("627", "8919", "https://www.welcomepickups.com/");
  const airaloUrl = buildTravelPayoutsUrl("541", "8310", "https://www.airalo.com/");
  const compensairUrl = buildTravelPayoutsUrl("86", "4129", "https://www.compensair.com/");
  const airhelpUrl = buildTravelPayoutsUrl("120", "9139", "https://www.airhelp.com/");
  const luggageUrl = buildTravelPayoutsUrl("209", "5867", "https://radicalstorage.com/");
  const expediaUrl = "https://www.expedia.com/Hotel-Search?destination=" + encodeURIComponent(destRaw) + "&affcid=US.DIRECT.PHG.1011l435364.1100l68075";

  const day0Cards = [
    {
      title: lang === 'en' ? "Direct Flights (Aviasales)" : (lang.startsWith('pt') ? "Voos Diretos (Aviasales)" : ("Vuelos " + (originIata ? (originIata + " ✈️ " + destIata) : ("a " + destRaw)) + " (Aviasales)")),
      cardType: "transport",
      timeMode: "Vuelos",
      url: aviasalesUrl,
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
      notes: lang === 'en' ? "Official flight metasearch with direct fare alerts." : (lang.startsWith('pt') ? "Metabusca oficial de voos com tarifas diretas." : "Metabuscador oficial de tarifas aéreas directas.")
    },
    {
      title: lang === 'en' ? "Private Airport Chauffeur (Welcome Pickups)" : (lang.startsWith('pt') ? "Motorista Particular no Aeroporto (Welcome Pickups)" : "Chofer Privado en Aeropuerto (Welcome Pickups)"),
      cardType: "transport",
      timeMode: "Llegada",
      url: welcomeUrl,
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80",
      notes: lang === 'en' ? "Personal greeting at arrival gate with guaranteed flat fare." : (lang.startsWith('pt') ? "Recepção personalizada no portão com tarifa fixa." : "Recepción en puerta de llegada con tarifa fija garantizada.")
    },
    {
      title: lang === 'en' ? "Instant eSIM Mobile Data (Airalo)" : (lang.startsWith('pt') ? "Conectividade eSIM Instantânea (Airalo)" : "Conectividad eSIM Instantánea (Airalo)"),
      cardType: "service",
      timeMode: "Conectividad",
      url: airaloUrl,
      image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80",
      notes: lang === 'en' ? "Mobile data upon landing without roaming fees." : (lang.startsWith('pt') ? "Dados móveis no pouso sem tarifas de roaming." : "Datos móviles desde el aterrizaje sin cargos de roaming.")
    },
    {
      title: lang === 'en' ? "Flight Delay & Cancellation Compensation (Compensair)" : (lang.startsWith('pt') ? "Indenização por Atraso de Voo até 600€ (Compensair)" : "Reclamación y Compensación de Vuelos hasta 600€ (Compensair)"),
      cardType: "service",
      timeMode: "Protección",
      url: compensairUrl,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      notes: lang === 'en' ? "Claim up to €600 per passenger for delayed or cancelled flights." : (lang.startsWith('pt') ? "Compensação de até 600€ por passageiro para voos cancelados ou atrasados." : "Reclama hasta 600€ por pasajero si tu vuelo sufre retraso o cancelación.")
    },
    {
      title: lang === 'en' ? "Secure Luggage Storage (Radical Storage)" : (lang.startsWith('pt') ? "Guarda-Volumes Seguro (Radical Storage)" : "Consigna Segura de Equipaje (Radical Storage)"),
      cardType: "service",
      timeMode: "Libertad",
      url: luggageUrl,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      notes: lang === 'en' ? "Walk free of luggage before check-in or after check-out." : (lang.startsWith('pt') ? "Caminhe livre de malas antes do check-in ou após o check-out." : "Camina libre de maletas antes del check-in o tras el check-out.")
    }
  ];

  // Si no es un viaje exclusivo de agencia, añadir alojamiento recomendado
  if (!isAgency) {
    day0Cards.splice(1, 0, {
      title: lang === 'en' ? "Boutique Stays & Historic Havens (Expedia VIP)" : (lang.startsWith('pt') ? "Hospedagem Boutique & Refúgios (Expedia VIP)" : "Hoteles Boutique & Refugios Serenos (Expedia VIP)"),
      cardType: "hotel",
      timeMode: "Alojamiento",
      url: expediaUrl,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      notes: lang === 'en' ? "Curated stays in quiet, authentic neighborhoods." : (lang.startsWith('pt') ? "Estadias selecionadas em bairros calmos e bem localizados." : "Estancias seleccionadas en barrios serenos y de alta calma.")
    });
  }

  // 2. DÍAS 1 a N: Experiencias Curadas
  const syncDays = [
    {
      day: 0,
      title: lang === 'en' ? "Preparation & Connectivity" : (lang.startsWith('pt') ? "Preparativos & Conectividade" : "Preparativos & Conectividad"),
      cards: day0Cards
    }
  ];

  const cityExps = CURATED_CATALOG[destKey] || [];
  let expCursor = 0;

  for (let d = 1; d <= days; d++) {
    const dayCards = [];
    
    if (cityExps.length > 0) {
      // 2 experiencias por día para ritmo humano contemplativo
      const morningExp = cityExps[expCursor % cityExps.length];
      expCursor++;
      const afternoonExp = cityExps[expCursor % cityExps.length];
      expCursor++;

      const lKey = lang.startsWith('pt') ? 'pt' : (lang === 'en' ? 'en' : 'es');

      dayCards.push({
        title: morningExp.titles[lKey] || morningExp.titles.es,
        cardType: "activity",
        timeMode: "morning",
        url: morningExp.links[lKey] || morningExp.links.es,
        image: morningExp.image,
        officialId: morningExp.officialId,
        notes: lang === 'en' ? "Quiet morning access with natural light." : (lang.startsWith('pt') ? "Acesso matutino tranquilo com luz natural." : "Acceso matutino tranquilo con luz natural cenital.")
      });

      dayCards.push({
        title: afternoonExp.titles[lKey] || afternoonExp.titles.es,
        cardType: "activity",
        timeMode: "afternoon",
        url: afternoonExp.links[lKey] || afternoonExp.links.es,
        image: afternoonExp.image,
        officialId: afternoonExp.officialId,
        notes: lang === 'en' ? "Golden-hour sensory walk and local haven." : (lang.startsWith('pt') ? "Passeio sensorial na hora dourada e refúgio local." : "Paseo sensorial en la hora dorada y refugio local.")
      });
    } else {
      // Destino global fuera del catálogo de los 6: Experiencia Solarpunk universal
      const gygSearchUrl = "https://www.getyourguide.com/s/?q=" + encodeURIComponent(destRaw) + "&partner_id=IKMIGHN&cmp=sj_itinerary";
      dayCards.push({
        title: lang === 'en' ? ("Historic Sanctuary & Local Heritage in " + destRaw) : (lang.startsWith('pt') ? ("Santuário Histórico e Tradição Local em " + destRaw) : ("Santuario Histórico y Tradición en " + destRaw)),
        cardType: "activity",
        timeMode: "morning",
        url: gygSearchUrl,
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
        notes: lang === 'en' ? "Curated quiet morning walk away from tourist crowds." : (lang.startsWith('pt') ? "Caminhada matutina serena longe das multidões." : "Paseo matutino sereno alejado de las aglomeraciones turísticas.")
      });
      dayCards.push({
        title: lang === 'en' ? ("Golden-Hour Secret Garden & Panorama in " + destRaw) : (lang.startsWith('pt') ? ("Jardim Secreto e Mirante na Hora Dourada em " + destRaw) : ("Jardín Secreto y Mirador al Atardecer en " + destRaw)),
        cardType: "activity",
        timeMode: "afternoon",
        url: gygSearchUrl,
        image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=600&q=80",
        notes: lang === 'en' ? "Restorative scenic pause overlooking the historic rooftops." : (lang.startsWith('pt') ? "Pausa contemplativa com vistas para os telhados históricos." : "Pausa contemplativa con vistas panorámicas sobre los tejados históricos.")
      });
    }

    const dayTitle = lang === 'en' ? "Sensory Wonders & Local Pauses" : (lang.startsWith('pt') ? "Maravilhas Sensoriais e Pausas Locais" : "Maravillas Culturales y Pausas Serenas");
    syncDays.push({
      day: d,
      title: dayTitle,
      cards: dayCards
    });
  }

  // 3. Sincronización con WordPress REST API
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
        title: (lang === 'en' ? "Memorable Journey in " : (lang.startsWith('pt') ? "Expedição Memorável em " : "Mi nueva expedición por ")) + destRaw,
        cover_image: CITY_HERO_IMAGES[destKey] || "https://spacejourney.app/wp-content/uploads/2026/04/292541fe-36cf-4333-9af9-49ae4b425401.jpg",
        destination: destRaw,
        lang: lang,
        author_name: agencyName,
        is_agency: isAgency,
        days: syncDays
      })
    });

    if (syncRes.ok) {
      const syncData = await syncRes.json();
      publicUrl = syncData.shareable_url || "";
      tripId = syncData.trip_id || "";
    }
  } catch (err) {
    console.error("WP sync error:", err);
  }

  if (!publicUrl) {
    const base = "https://spacejourney.app";
    publicUrl = lang === "en" ? (base + "/en/my-travel-route/") : (lang.startsWith("pt") ? (base + "/pt-br/minha-rota-de-viagem/") : (base + "/ruta/"));
  }

  return {
    destination: destRaw,
    duration_days: days,
    flight_connectivity: flightBadge || "Conexión directa / Entrada internacional",
    experience_philosophy: "Viaje Memorable con Ritmo Humano: menos listas apresuradas, más asombro genuino, luz dorada y pausas que recordarás durante décadas.",
    trip_id: tripId,
    public_shareable_itinerary_url: publicUrl,
    agency_attribution: agencyName,
    ancillary_services: {
      flights: aviasalesUrl,
      airport_transfers: welcomeUrl,
      esim_connectivity: airaloUrl,
      flight_compensation: compensairUrl,
      luggage_storage: luggageUrl
    },
    itinerary_preview: syncDays,
    quality_seal: "Estándar de Descanso y Bienestar Space Journey (Alineado con directrices OMS <53 dB Lden) - CERN Zenodo DOI: 10.5281/zenodo.22756473",
    zero_friction_tools: {
      public_shareable_itinerary: publicUrl,
      trip_saver: "https://spacejourney.app/trip-saver/?ref=mcp",
      sensory_trip_planner: "https://spacejourney.app/activa-tu-viaje/?destination=" + encodeURIComponent(destRaw) + "&days=" + days + "&source=mcp_edge",
      sensory_earth_portal: "https://spacejourney.app/sensory-earth/?dest=" + encodeURIComponent(destRaw)
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
      name: "Santuario de Calma y Luz cerca de " + spot,
      the_secret: "Un rincón íntimo a solo 3 minutos a pie del tumulto: un claustro de piedra templada donde la brisa y las fuentes diluyen el ruido del turismo masivo.",
      local_insight: "Gira por el pasaje bajo el arco antiguo; muy pocos viajeros lo conocen, convirtiéndolo en un refugio perfecto para leer, conversar o contemplar.",
      sensory_atmosphere: "Brisa fresca, sombra vegetal, luz filtrada y silencio protector.",
      quality_guarantee: "Confort acústico certificado bajo el estándar de bienestar OMS",
      guide_url: "https://spacejourney.app/ciudades/"
    },
    companion_tools: {
      trip_saver_extension: "https://spacejourney.app/trip-saver/",
      sensory_earth_3d: "https://spacejourney.app/sensory-earth/?dest=" + encodeURIComponent(city)
    }
  };
}

function handleBookingCard(args) {
  const dest = args.destination || "Roma";
  const cat = args.category || "hotels";
  let verifiedUrl = "https://spacejourney.app/tours-experiencias-vip/";
  if (cat === "flights") {
    verifiedUrl = buildTravelPayoutsUrl("100", "4114", "https://www.aviasales.com/");
  } else if (cat === "transfers") {
    verifiedUrl = buildTravelPayoutsUrl("627", "8919", "https://www.welcomepickups.com/");
  } else if (cat === "esim") {
    verifiedUrl = buildTravelPayoutsUrl("541", "8310", "https://www.airalo.com/");
  } else if (cat === "insurance") {
    verifiedUrl = buildTravelPayoutsUrl("225", "5869", "https://ektatraveling.com/");
  } else if (cat === "luggage") {
    verifiedUrl = buildTravelPayoutsUrl("209", "5867", "https://radicalstorage.com/");
  } else {
    verifiedUrl = "https://www.expedia.com/Hotel-Search?destination=" + encodeURIComponent(dest) + "&affcid=US.DIRECT.PHG.1011l435364.1100l68075";
  }

  return {
    curated_service: cat,
    destination: dest,
    booking_experience: "Cero fricción digital. Alojamientos y servicios seleccionados por su descanso supremo, hospitalidad auténtica y aislamiento del ruido.",
    verified_url: verifiedUrl,
    peace_guarantee: "Curaduría humana para un sueño reparador y recuerdos imborrables."
  };
}

function handleSensoryEarth(args) {
  const dest = args.destination || "Roma";
  return {
    experience: "Sensory Earth 3D WebGL",
    destination: dest,
    immersive_portal_url: "https://spacejourney.app/sensory-earth/?dest=" + encodeURIComponent(dest),
    features: "Atmósfera sonora territorial, música de arraigo local y visualización estética antes de iniciar el viaje."
  };
}

function getOpenApiSchema(origin) {
  return {
    openapi: "3.0.3",
    info: {
      title: "Space Journey Travel Engine",
      description: "The 21st-century travel engine for memorable and transformative journeys. Designing travel with human pace, unforgettable cultural encounters, secret local sanctuaries, and immersive sensory atmospheres.",
      version: "3.5.1"
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
                    agency_name: { type: "string" },
                    traveler_profile: { type: "string", default: "contemplative" },
                    language: { type: "string", default: "es" }
                  },
                  required: ["destination"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Curated memorable itinerary with public shareable URL",
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
              description: "Secret sanctuary recommendation",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
      "/booking-card": {
        post: {
          operationId: "generateBookingCard",
          summary: "Curate verified booking recommendations",
          description: "Curate verified booking recommendations across soulful boutique hotels, historic quiet retreats, authentic local experiences, and seamless travel mobility.",
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
              description: "Verified booking card with zero friction",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
      "/sensory-earth": {
        post: {
          operationId: "exploreSensoryEarth",
          summary: "Explore the living spirit and sensory essence of a destination",
          description: "Explore the living spirit, musical heritage, and atmospheric essence of any destination through the 3D Sensory Earth globe before embarking on the journey.",
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

async function handleRequest(request) {
  const url = new URL(request.url);

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-sj-token, Mcp-Version'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // OpenAPI schema endpoints
  if (request.method === 'GET' && (url.pathname === '/openapi.json' || url.pathname === '/mcp/openapi.json')) {
    return new Response(JSON.stringify(getOpenApiSchema(url.origin), null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Direct REST endpoints
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

  // Health and root status endpoint
  if (url.pathname === '/' || url.pathname === '/health') {
    return new Response(JSON.stringify({
      status: "online",
      server: SERVER_INFO.name,
      version: SERVER_INFO.version,
      philosophy: "Memorable & Transformative Travel, Cultural Sanctuaries & Radical Hospitality (Omotenashi)",
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

  // MCP JSON-RPC 2.0 Handler
  if (url.pathname === '/mcp' || url.pathname === '/mcp/') {
    if (request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32700, message: "Parse error" },
          id: null
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { method, params, id } = body;

      if (method === 'initialize') {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: SERVER_INFO
          },
          id
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (method === 'tools/list') {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          result: { tools: TOOLS },
          id
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (method === 'tools/call') {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        let result = null;

        if (toolName === 'plan_contemplative_journey') {
          result = await handlePlanJourney(toolArgs);
        } else if (toolName === 'discover_secret_haven') {
          result = handleSecretHaven(toolArgs);
        } else if (toolName === 'generate_booking_card') {
          result = handleBookingCard(toolArgs);
        } else if (toolName === 'explore_sensory_earth') {
          result = handleSensoryEarth(toolArgs);
        } else {
          return new Response(JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32601, message: "Method not found: " + toolName },
            id
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2)
              }
            ]
          },
          id
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32601, message: "Method not found: " + method },
        id
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      message: "Space Journey MCP Endpoint active. Send JSON-RPC 2.0 POST requests to /mcp."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response("Not Found", { status: 404, headers: corsHeaders });
}

export default {
  fetch: handleRequest
};
