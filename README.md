# 🌿 Space Journey — Contemplative Travel & Sensory Impact Engine (MCP Server v3.9.4)

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22756473.svg)](https://doi.org/10.5281/zenodo.22756473)
[![WHO Acoustic Guideline](https://img.shields.io/badge/WHO_Guideline-53_dB_Lden-006699)](https://spacejourney.app/standards/sensory-impact-score/)
[![Hugging Face Datasets](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Space%20Journey%20Datasets-FFD21E)](https://huggingface.co/spacejourney)
[![Hugging Face Article](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Technical%20Article-yellow.svg)](https://huggingface.co/blog/spacejourney/measuring-urban-quiet-acoustic-telemetry-elevation)
[![GitHub Discussions](https://img.shields.io/badge/Discussions-Join%20Debate%20%235-059669?style=flat&logo=github)](https://github.com/spacelabdevteam-hub/space-journey-mcp-engine/discussions/5)
[![MCP Protocol](https://img.shields.io/badge/MCP-2024--11--05%20Streamable%20HTTP-10B981)](https://space-journey-engine.spacelab-mcp.workers.dev/mcp)
[![M8ven Trust Score](https://m8ven.ai/badge/mcp/spacelabdevteam-hub/space-journey-mcp-engine)](https://m8ven.ai/mcp/spacelabdevteam-hub/space-journey-mcp-engine)
[![License: MIT + CC-BY-4.0](https://img.shields.io/badge/License-MIT%20%2F%20CC--BY--4.0-E8C57D)](./LICENSE)

> **The Open Standard & Model Context Protocol (MCP) Server for Acoustic Urban Health, Contemplative Travel, and Low-Density Cultural Routing.**  
> *Aligned with World Health Organization (WHO) Environmental Noise Guidelines (WHO Lden < 53 dB).*

<div align="center">
  <br />
  <a href="https://huggingface.co/blog/spacejourney/measuring-urban-quiet-acoustic-telemetry-elevation">
    <img src="https://huggingface.co/spaces/spacejourney/sensory-impact-explorer/resolve/main/assets/sensory_earth_cover.jpg" width="100%" alt="Measuring Urban Quiet: Acoustic Telemetry, Elevation Profiles, and the Open Sensory Impact Score (SIS v3.0)" style="border-radius: 14px; box-shadow: 0 8px 30px rgba(16, 185, 129, 0.25); border: 1px solid rgba(16, 185, 129, 0.35);" />
  </a>
  <p>
    <b>📖 Official Technical Whitepaper:</b> 
    <a href="https://huggingface.co/blog/spacejourney/measuring-urban-quiet-acoustic-telemetry-elevation">
      <em>Measuring Urban Quiet: Acoustic Telemetry, Elevation Profiles, and the Open Sensory Impact Score (SIS v3.0)</em>
    </a> 
    <br />
    <sub>Published Nov 9, 2026 on the Hugging Face Community Blog · Permanent CERN Zenodo Archive: <a href="https://doi.org/10.5281/zenodo.22756473"><code>10.5281/zenodo.22756473</code></a></sub>
  </p>
  <br />
</div>


> [!NOTE]
> 💬 **Scientific Peer Review & Community Debate:** We invite urban planners, soundscape ecologists, and AI developers to join [**GitHub Discussion #5: Urban Acoustic Telemetry & SIS Index v3.0**](https://github.com/spacelabdevteam-hub/space-journey-mcp-engine/discussions/5) alongside our [Hugging Face Technical Publication](https://huggingface.co/blog/spacejourney/measuring-urban-quiet-acoustic-telemetry-elevation).

---

## 🌍 Why This Exists (Public Digital Commons & Open Interoperability)

Conventional search engines and LLM travel assistants route millions of travelers into the same hyper-congested urban bottlenecks—triggering **85+ dB acoustic fatigue**, visual saturation, and urban overtourism.

**Space Journey** introduces a **Public Digital Commons** for sensory-aware human mobility. Powered by the peer-cited **Sensory Impact Score (SIS)** ([DOI: `10.5281/zenodo.22756473`](https://doi.org/10.5281/zenodo.22756473)) and the **Kairós Sensory Routing Protocol (KRP)**, this MCP Server equips any AI Agent (Claude, OpenWebUI, Llama, Mistral, DeepSeek, Cursor, Gemini) with:

1. **Acoustic, Photic & Topographic Urban Telemetry (ESA Copernicus DEM GLO-90):** Real-time and time-windowed decibel (dB), illuminance (lx), crowd-density, and satellite elevation/biomechanical exertion benchmarks across **94 curated cultural sanctuaries** in **Rome, Paris, London, Mexico City, New York, and Miami**—plus universal Kairós routing for **any city on Earth**.
2. **Kairós Directional Routing Protocol (KRP):** Automatic origin-destination disambiguation (`BOG ✈️ MAD`, `JFK ✈️ FCO`), IATA airport normalization, and great-circle flight duration estimation.
3. **227-Country Sensory Earth Integration:** Direct deep-linking into [**Sensory Earth 3D**](https://spacejourney.app/sensory-earth/), an open WebGL globe preserving regional musical heritage and cultural dedications across 227 countries and territories.
4. **Zero-Trust Privacy & GDPR by Design:** Stateless MCP architecture. Zero personal identifiable information (PII), zero tracking cookies, and full interoperability with local and open-weights LLMs. Review our full [Privacy Policy](https://spacejourney.app/politica-de-privacidad/).

---

## ⚡ Quickstart: Connect in 15 Seconds (Zero-Auth Remote MCP)

You do **not** need API keys or local database setup to use the full engine. Connect any MCP-compatible client directly to our high-availability Streamable HTTP endpoint:

- **Live MCP Endpoint:** `https://space-journey-engine.spacelab-mcp.workers.dev/mcp`

### Option A: Claude Desktop / Cursor / Windsurf / Cline (`mcp_config.json`)

```json
{
  "mcpServers": {
    "space-journey-engine": {
      "url": "https://space-journey-engine.spacelab-mcp.workers.dev/mcp"
    }
  }
}
```

### Option B: Local Stdio Execution (Thin Benchmark Mode)

If you are developing offline or auditing the open Python reference implementation with the local `public_benchmark_index_v3.json` dataset:

```json
{
  "mcpServers": {
    "space-journey-engine": {
      "command": "python",
      "args": ["server.py"]
    }
  }
}
```

---

## 🛠️ Available MCP Tools (v3.9.4 Universal Ingestion)

| Tool Name | Purpose & Output |
| :--- | :--- |
| `plan_contemplative_journey` | **Universal Travel & Itinerary Architect.** Accepts any city worldwide (`destination`), optional `origin` for Kairós IATA flight telemetry, `days` (1–7), and `language` (`en`, `es`, `pt`). Returns high-SIS cultural experiences, golden-hour timing, **1-Click Auto-Import URL** into the [Interactive Itinerary Planner](https://spacejourney.app/planificador-de-viajes/), and verified booking links. |
| `discover_secret_haven` | **Acoustic Sanctuary Finder.** Filters curated urban refuges by maximum decibel threshold (default `55 dB`, aligned with WHO restorative thresholds) to immediately rescue travelers from crowd fatigue. |
| `explore_sensory_earth` | **3D WebGL Globe & Cultural Heritage Portal.** Connects the user to [Sensory Earth](https://spacejourney.app/sensory-earth/) (227 countries, background musical radio, and verified cultural tributes) and [The Sensory Atlas](https://spacejourney.app/play/roma-atlas/) isometric WebGL playable. |
| `generate_booking_card` | **Universal Logistics & Verified Deep-Link Resolver.** Resolves 100% HTTP-200 verified destination deep-links (museums, acoustic audio guides via WeGoTrip, rail, eSIM connectivity, luggage storage, and delay compensation) for any city on Earth. |

---

## 📐 Scientific Methodology: The Sensory Impact Score (SIS)

Defined in our open technical standard ([`/standards/sensory-impact-score/`](https://spacejourney.app/standards/sensory-impact-score/) & [CERN Zenodo DOI `10.5281/zenodo.22756473`](https://doi.org/10.5281/zenodo.22756473)), the **Sensory Impact Score (SIS 0–100)** quantifies the restorative quality of a cultural space:

$$\text{SIS} = 100 - \left( 0.35 \cdot P_{\text{noise}}(dB) + 0.30 \cdot P_{\text{crowd}}(\rho) + 0.20 \cdot P_{\text{exertion}}(E) - 0.15 \cdot B_{\text{light}}(\text{lx}, \theta_{\odot}) \right)$$

Where:
- **$P_{\text{noise}}(dB)$:** Non-linear acoustic penalty anchored to the **WHO 53 dB Lden** threshold.
- **$P_{\text{crowd}}(\rho)$:** Pedestrian density penalty (pax/m²) derived from hourly visitation curves.
- **$P_{\text{exertion}}(E)$:** Biomechanical and thermal friction index computed using **ESA Copernicus DEM GLO-90** satellite elevation (`elevation_m`, `relative_relief_m`).
- **$B_{\text{light}}(\text{lx}, \theta_{\odot})$:** Photic harmony bonus during golden hour and architectural twilight.

| SIS Tier | Score Range | Acoustic Profile | Typical Urban Environment |
| :--- | :---: | :---: | :--- |
| **Tier S — Sanctuary** | `90 – 100` | `38 – 48 dB` | Monastic cloisters, dawn botanical gardens, hidden courtyards |
| **Tier A — Restorative** | `80 – 89` | `49 – 55 dB` | Off-peak galleries, riverside promenades, historic libraries |
| **Tier B — Balanced** | `70 – 79` | `56 – 64 dB` | Open piazzas at sunrise, architectural landmarks with timed entry |
| **Saturated (Filtered Out)** | `< 50` | `> 78 dB` | Midday tourist traps & uncurated mass-transit bottlenecks |

---

## 🏛️ The Triad of Zero-Friction Well-Being Tools

Every response generated by this MCP server empowers the traveler through three open web tools:

1. **[Interactive Contemplative Planner (`spacejourney.app/planificador-de-viajes/`)](https://spacejourney.app/planificador-de-viajes/):** Supports `?import_itinerary=` URL hydration so AI Agents can build a complete multi-day itinerary and hand it off to the user in a single click—plus the **Explorador Cósmico** gamification badge system.
2. **[Sensory Earth 3D (`spacejourney.app/sensory-earth/`)](https://spacejourney.app/sensory-earth/):** Interactive 3D globe with continuous background regional music across 227 countries.
3. **[Space Journey Trip Saver (Browser Extension)](https://spacejourney.app/extension-viajes-chrome-safari/):** Eliminates "40-open-tabs fatigue" by unifying saved sanctuaries and bookings in a calm Solarpunk workspace ([Chrome Web Store](https://chromewebstore.google.com/detail/space-journey-trip-saver/dcnjofebekgknfkcahghcdbkaadgipic)).

---

## 📚 Open Datasets & Academic Citation

Explore our city-level Parquet datasets and interactive explorers on Hugging Face:
- 🤗 **Organization:** [huggingface.co/spacejourney](https://huggingface.co/spacejourney)
  - [`spacejourney/rome-sensory-impact-dataset`](https://huggingface.co/datasets/spacejourney/rome-sensory-impact-dataset)
  - [`spacejourney/paris-sensory-impact-dataset`](https://huggingface.co/datasets/spacejourney/paris-sensory-impact-dataset)
  - [`spacejourney/cdmx-sensory-impact-dataset`](https://huggingface.co/datasets/spacejourney/cdmx-sensory-impact-dataset)
  - Interactive Space: [`spacejourney/sensory-impact-explorer`](https://huggingface.co/spaces/spacejourney/sensory-impact-explorer)
- 🎮 **WebGL Playable Prototype:** [The Sensory Atlas: Roma](https://github.com/spacelabdevteam-hub/the-sensory-atlas-prototype) ([Live Demo](https://spacejourney.app/play/roma-atlas/))
- 🎨 **Solarpunk UX Case Study:** [Behance Showcase](https://www.behance.net/gallery/255668901/Space-Journey-Solarpunk-UX-Itinerary-Planner)

### BibTeX Citation

```bibtex
@dataset{duque_romero_2026_sis,
  author       = {Duque Romero, Adolfo Daniel and {Space Journey Research Lab}},
  title        = {{The Sensory Impact Score (SIS): An Open Acoustic, Photic, and Crowd-Density Benchmark for Contemplative Urban Mobility}},
  year         = 2026,
  publisher    = {Zenodo / CERN},
  version      = {3.3.0},
  doi          = {10.5281/zenodo.22756473},
  url          = {https://doi.org/10.5281/zenodo.22756473}
}
```

## Reproducible verification and publishing credentials

Install Python 3.11+ and Node.js 22+, then run:

```sh
python -m pip install -r requirements.txt
npm test
```

The suite exercises all five named tools in both implementations without real
WordPress writes, plus malformed HTTP requests and an actual Python stdio
initialization/discovery exchange. CI runs the same checks on pushes and PRs.
The public benchmark works without the private literary catalog.

For route publication, set `SPACE_JOURNEY_SYNC_TOKEN` (or `SJ_SYNC_TOKEN`) as a Cloudflare secret binding or
Python environment variable. No publication occurs without that credential, and requests are strictly pinned to `https://spacejourney.app/wp-json/sj/v1/sync-trip`.
Read [SECURITY.md](SECURITY.md) before migrating: the old committed credential
must be revoked on the receiver and replaced in the running deployment together.
Repository tests do not deploy the Worker or alter production WordPress.

M8ven assesses code, execution and adoption independently. Passing this suite
is evidence for verification, not a promise of a particular trust score.
