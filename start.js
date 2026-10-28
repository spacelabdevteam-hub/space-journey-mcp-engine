module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env",
        message: [
          "python server.py"
        ],
        on: [{
          event: "/.*/",
          done: true
        }]
      }
    }
  ]
}
