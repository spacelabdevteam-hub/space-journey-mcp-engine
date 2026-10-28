module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env",
        message: [
          "pip install -r requirements.txt"
        ]
      }
    },
    {
      method: "notify",
      params: {
        html: "Space Journey MCP Engine installed successfully! Ready for Claude Desktop, Cursor, and local LLMs."
      }
    }
  ]
}
