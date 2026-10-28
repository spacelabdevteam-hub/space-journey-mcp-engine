module.exports = {
  version: "3.0",
  title: "Space Journey MCP Engine (Sensory AI Travel Router)",
  description: "Universal Model Context Protocol (MCP) server for contemplative travel planning, urban acoustic health (WHO 53 dB Lden aligned), and Sensory Impact Score (SIS) routing across Claude, Cursor, Windsurf, OpenWebUI, and local LLMs.",
  icon: "https://spacejourney.app/wp-content/uploads/2026/02/512FaviconSpaceJourneyFullGold.jpg",
  menu: async (kernel, info) => {
    let installed = info.exists("env")
    let running = {
      install: info.running("install.js"),
      start: info.running("start.js")
    }
    if (running.install) {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Installing Space Journey MCP...",
        href: "install.js"
      }]
    } else if (installed) {
      if (running.start) {
        return [{
          default: true,
          icon: "fa-solid fa-terminal",
          text: "MCP Server Running (STDIO)",
          href: "start.js"
        }]
      } else {
        return [{
          default: true,
          icon: "fa-solid fa-power-off",
          text: "Start MCP Server",
          href: "start.js"
        }, {
          icon: "fa-solid fa-globe",
          text: "Open Sensory Earth 3D",
          href: "https://spacejourney.app/sensory-earth/?utm_source=pinokio&utm_medium=mcp_launcher&utm_campaign=sis_v3",
          popout: true
        }, {
          icon: "fa-solid fa-database",
          text: "Hugging Face Benchmark",
          href: "https://huggingface.co/datasets/spacejourney/global-sensory-impact-benchmark",
          popout: true
        }]
      }
    } else {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Install 1-Click MCP Server",
        href: "install.js"
      }]
    }
  }
}
