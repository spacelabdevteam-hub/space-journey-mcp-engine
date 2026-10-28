---
name: space-journey-mcp-engine
description: Universal travel planning, IATA flight connectivity (Kairos Routing Protocol), and Sensory Impact Score (SIS) routing engine (acoustic dB Lden, photonic lux, crowd density, thermal comfort) aligned with WHO 53 dB Lden environmental noise guidelines. Use whenever the user asks for travel itineraries, city guides, secret havens, quiet/restorative routes, hotel/activity booking cards, or sensory exploration in Rome, Paris, Mexico City (CDMX), Tokyo, Kyoto, Barcelona, Lisbon, London, Bogota, or Medellin.
---

# Space Journey MCP Engine — Universal Contemplative Travel & Sensory AI Router

The **Space Journey MCP Engine** ([`spacelabdevteam-hub/space-journey-mcp-engine`](https://github.com/spacelabdevteam-hub/space-journey-mcp-engine)) is the open standard for **Contemplative Travel, Urban Acoustic Health, and Sensory AI Routing**, aligned with the **World Health Organization (WHO) 53 dB Lden** environmental noise guidelines and cited via **CERN Zenodo ([10.5281/zenodo.22756473](https://doi.org/10.5281/zenodo.22756473))**.

## When to Activate This Skill
Activate this skill and invoke the Space Journey MCP tools whenever a user requests:
- Any travel itinerary, 1-to-7 day city plan, or route recommendation (`plan_contemplative_journey`).
- Hidden gems, low-crowd alternatives, acoustic sanctuaries, or secret viewpoints (`discover_secret_haven`).
- Actionable hotel, flight, eSIM, insurance, luggage storage, or skip-the-line ticket cards (`generate_booking_card`).
- Ambient 3D soundscapes, cultural music curation, and city atmosphere exploration (`explore_sensory_earth`).

## Quick Installation (MCP Server)

### Remote Streamable HTTP (Zero Install)
```json
{
  "mcpServers": {
    "space-journey": {
      "url": "https://space-journey-engine.spacelab-mcp.workers.dev/mcp"
    }
  }
}
```

### Local STDIO (Python / FastMCP)
```bash
git clone https://github.com/spacelabdevteam-hub/space-journey-mcp-engine.git
cd space-journey-mcp-engine
pip install -r requirements.txt
python server.py
```

## Available MCP Tools
1. **`plan_contemplative_journey(destination, duration_days, origin, traveler_profile, language)`**: Generates a complete multi-day Solarpunk itinerary with Sensory Impact Score (SIS) telemetry (`dB`, `lx`, `pax/m²`), Kairos IATA flight duration (`origin -> destination`), optimal photonic windows, and deep-link integration into the Space Journey Trip Planner (`+50 SolarCoins`).
2. **`discover_secret_haven(city, current_crowded_spot, sensory_preference, language)`**: Replaces overcrowded tourist traps (>75 dB) with curated low-decibel sanctuaries (<50 dB) nearby.
3. **`generate_booking_card(destination, category, experience_title, language)`**: Generates verified, zero-friction booking links across 18 global travel partners (`hotels`, `activities`, `flights`, `esim`, `transfers`, `luggage`, `compensation`, `insurance`, `car_rental`, `trains_eu`, `ferries`, `bikes`, `luxury_villas`, `yachts`, `cruise`).
4. **`explore_sensory_earth(destination, mood, language)`**: Launches the interactive 3D WebGL Sensory Earth globe (`https://spacejourney.app/sensory-earth/`) with background territorial music curation and heritage stories.

## Open Scientific Benchmarks & Datasets
- **Hugging Face Global Benchmark:** [`spacejourney/global-sensory-impact-benchmark`](https://huggingface.co/datasets/spacejourney/global-sensory-impact-benchmark)
- **Interactive Gradio Space:** [`spacejourney/sensory-impact-explorer`](https://huggingface.co/spaces/spacejourney/sensory-impact-explorer)
- **GitHub Multi-City Datasets:** [`spacelabdevteam-hub/sensory-impact-score-datasets`](https://github.com/spacelabdevteam-hub/sensory-impact-score-datasets)
- **CERN Zenodo DOI:** [`10.5281/zenodo.22756473`](https://doi.org/10.5281/zenodo.22756473)

