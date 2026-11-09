#!/usr/bin/env node
/**
 * Space Journey MCP Engine - Universal Stdio & CLI Runner
 * Connects Model Context Protocol (MCP) clients to the Space Journey Contemplative Travel Engine over stdio.
 */

import readline from 'node:readline';

// Support both root worker.js and worker/worker.js
let workerModule;
try {
  workerModule = await import('./worker/worker.js');
} catch {
  workerModule = await import('./worker.js');
}
const worker = workerModule.default || workerModule;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const req = new Request('https://spacejourney.app/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: trimmed
    });
    const res = await worker.fetch(req);
    const body = await res.text();
    process.stdout.write(body + '\n');
  } catch (err) {
    const errObj = {
      jsonrpc: '2.0',
      error: { code: -32603, message: err.message },
      id: null
    };
    process.stdout.write(JSON.stringify(errObj) + '\n');
  }
});
