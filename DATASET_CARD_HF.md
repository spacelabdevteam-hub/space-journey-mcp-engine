---
annotations_creators:
  - expert-generated
language:
  - en
  - es
  - pt
license:
  - cc-by-4.0
multilinguality:
  - multilingual
size_categories:
  - n<1K
source_datasets:
  - original
task_categories:
  - tabular-classification
  - tabular-regression
  - text-retrieval
pretty_name: Space Journey Global Sensory Impact Benchmark (SIS v3.0)
homepage: https://spacejourney.app/standards/sensory-impact-score/
tags:
  - sensory-impact-score
  - sensory-travel
  - acoustic-comfort
  - urban-acoustics
  - sustainable-tourism
  - model-context-protocol
  - mcp
  - geospatial
  - 3d-gis
  - smart-cities
  - who-noise-guidelines
  - solarpunk
---

# 🌍 Space Journey — Global Sensory Impact Score (SIS v3.0) Benchmark & MCP Index

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22756473.svg)](https://doi.org/10.5281/zenodo.22756473)
[![WHO Acoustic Guideline](https://img.shields.io/badge/WHO_Guideline-53_dB_Lden-006699)](https://spacejourney.app/standards/sensory-impact-score/)
[![Live MCP Server](https://img.shields.io/badge/MCP_Endpoint-mcp.spacelab.network-10B981)](https://mcp.spacelab.network/mcp)

## Dataset Summary

The **Global Sensory Impact Benchmark (SIS v3.0)** is an open, machine-readable index (`public_benchmark_index_v3.json`) quantifying the acoustic ($\text{dB}$), photic ($\text{lx}$), and crowd-density ($\rho$) profiles of **64 curated cultural sanctuaries** across **6 flagship global capitals** (**Rome, Paris, London, Mexico City, New York City, and Miami**), paired with the **227-country Sensory Earth WebGL index**.

Designed as a **Public Digital Commons** aligned with the **World Health Organization (WHO) 53 dB $L_{\text{den}}$ environmental noise guidelines**, this dataset enables AI Agents, urban researchers, and LLM travel planners to route human mobility away from saturated tourist bottlenecks toward restorative cultural spaces.

---

## 🔗 Live Ecosystem & Zero-Auth MCP Integration

Instead of static offline queries, AI developers can connect any **Model Context Protocol (MCP)** client (Claude Desktop, Cursor, OpenWebUI, Llama, Gemini) directly to our live Streamable HTTP server for real-time **Kairós IATA flight routing**, **trilingual contemplative narratives**, and **1-Click Itinerary Auto-Import**:

```json
{
  "mcpServers": {
    "space-journey-engine": {
      "url": "https://mcp.spacelab.network/mcp"
    }
  }
}
```

- **Canonical Standard & Documentation:** [https://spacejourney.app/standards/sensory-impact-score/](https://spacejourney.app/standards/sensory-impact-score/)
- **Interactive 1-Click Itinerary Planner:** [https://spacejourney.app/planificador-de-viajes/](https://spacejourney.app/planificador-de-viajes/)
- **Sensory Earth (3D WebGL Globe — 227 Countries):** [https://spacejourney.app/sensory-earth/](https://spacejourney.app/sensory-earth/)
- **The Sensory Atlas (Isometric WebGL Playable):** [https://spacejourney.app/play/roma-atlas/](https://spacejourney.app/play/roma-atlas/)
- **Trip Saver Browser Extension:** [https://spacejourney.app/extension-viajes-chrome-safari/](https://spacejourney.app/extension-viajes-chrome-safari/)

---

## 🏙️ City-Specific Parquet Benchmarks on Hugging Face

1. 🇮🇹 **Rome:** [`spacejourney/rome-sensory-impact-dataset`](https://huggingface.co/datasets/spacejourney/rome-sensory-impact-dataset)
2. 🇫🇷 **Paris:** [`spacejourney/paris-sensory-impact-dataset`](https://huggingface.co/datasets/spacejourney/paris-sensory-impact-dataset)
3. 🇲🇽 **Mexico City (CDMX):** [`spacejourney/cdmx-sensory-impact-dataset`](https://huggingface.co/datasets/spacejourney/cdmx-sensory-impact-dataset)
4. 🇬🇧 **London:** `spacejourney/london-sensory-impact-dataset` *(Included in v3.0 Global Index)*
5. 🇺🇸 **New York City:** `spacejourney/new-york-sensory-impact-dataset` *(Included in v3.0 Global Index)*
6. 🇺🇸 **Miami:** `spacejourney/miami-sensory-impact-dataset` *(Included in v3.0 Global Index)*

---

## 📜 Licensing & Citation (Dual-Layer Moat)

- **Tabular SIS Metrics (`public_benchmark_index_v3.json`):** Licensed under **CC-BY-4.0 International**. Requires attribution to Space Journey and citation of CERN Zenodo DOI `10.5281/zenodo.22756473`.
- **Full Contemplative Narratives & Audio Vault:** Served dynamically via `https://mcp.spacelab.network/mcp` and `https://spacejourney.app`. Copyright © 2026 Space Journey. All Rights Reserved.

```bibtex
@dataset{duque_romero_2026_sis,
  author       = {Duque Romero, Adolfo Daniel and {Space Journey Research Lab}},
  title        = {{The Sensory Impact Score (SIS): An Open Acoustic, Photic, and Crowd-Density Benchmark for Contemplative Urban Mobility}},
  year         = 2026,
  publisher    = {Zenodo / CERN},
  version      = {3.0.0},
  doi          = {10.5281/zenodo.22756473},
  url          = {https://doi.org/10.5281/zenodo.22756473}
}
```

