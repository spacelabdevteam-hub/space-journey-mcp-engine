/**
 * Space Journey MCP Engine - Automated Test Suite
 * Validates MCP 2024-11-05 Specification, Tool Annotations, OpenAI Directory Compliance & Handler Execution
 */

import assert from 'node:assert/strict';
import worker from '../worker.js';

console.log('🧪 Starting Space Journey MCP Engine Test Suite...\n');

// No test may reach WordPress or create public itineraries.
globalThis.fetch = async () => new Response(JSON.stringify({data: [], trip_id: 'fixture-trip', public_shareable_itinerary_url: 'https://spacejourney.app/ruta/?trip=fixture-trip'}), {headers: {'Content-Type': 'application/json'}});
let testsPassed = 0;
let testsFailed = 0;

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    testsFailed++;
  }
}

async function sendMcpRequest(method, params = {}) {
  const req = new Request('https://space-journey-engine.spacelab-mcp.workers.dev/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'test-' + Date.now(),
      method,
      params
    })
  });
  const res = await worker.fetch(req);
  assert.equal(res.status, 200, `Expected HTTP 200, got ${res.status}`);
  return await res.json();
}

// 1. Initialize Protocol Test
await runAsyncTest('MCP Protocol Handshake (initialize)', async () => {
  const data = await sendMcpRequest('initialize');
  assert.equal(data.jsonrpc, '2.0');
  assert.equal(data.result.protocolVersion, '2024-11-05');
  assert.equal(data.result.serverInfo.name, 'space-journey-engine');
  assert.ok(data.result.serverInfo.version);
});

// 2. Tools List & Hint Annotations Audit (OpenAI & M8ven Directory Spec)
await runAsyncTest('Tools Discovery & Full Annotations Audit (OpenAI & M8ven Spec)', async () => {
  const data = await sendMcpRequest('tools/list');
  assert.equal(data.jsonrpc, '2.0');
  const tools = data.result.tools;
  assert.ok(Array.isArray(tools), 'tools should be an array');
  assert.equal(tools.length, 5, `Expected 5 tools, found ${tools.length}`);

  const expectedTools = [
    'plan_contemplative_journey',
    'discover_secret_haven',
    'generate_booking_card',
    'explore_sensory_earth',
    'publish_itinerary_route'
  ];

  for (const toolName of expectedTools) {
    const tool = tools.find(t => t.name === toolName);
    assert.ok(tool, `Tool ${toolName} must be declared`);
    assert.ok(tool.description && tool.description.length > 20, `${toolName} must have descriptive text`);
    assert.ok(tool.inputSchema, `${toolName} must have inputSchema`);

    // Strict validation of the 4 boolean hints required by OpenAI and M8ven
    assert.equal(typeof tool.readOnlyHint, 'boolean', `${toolName}.readOnlyHint must be an explicit boolean`);
    assert.equal(typeof tool.destructiveHint, 'boolean', `${toolName}.destructiveHint must be an explicit boolean`);
    assert.equal(typeof tool.idempotentHint, 'boolean', `${toolName}.idempotentHint must be an explicit boolean`);
    assert.equal(typeof tool.openWorldHint, 'boolean', `${toolName}.openWorldHint must be an explicit boolean`);

    // Verify annotations object mirror
    assert.ok(tool.annotations, `${toolName} must include annotations dictionary`);
    assert.equal(typeof tool.annotations.readOnlyHint, 'boolean', `${toolName}.annotations.readOnlyHint must be boolean`);
    assert.equal(typeof tool.annotations.destructiveHint, 'boolean', `${toolName}.annotations.destructiveHint must be boolean`);
    assert.equal(typeof tool.annotations.idempotentHint, 'boolean', `${toolName}.annotations.idempotentHint must be boolean`);
    assert.equal(typeof tool.annotations.openWorldHint, 'boolean', `${toolName}.annotations.openWorldHint must be boolean`);
  }
});

// 3. Tool Execution: discover_secret_haven
await runAsyncTest('Tool Execution: discover_secret_haven', async () => {
  const res = await sendMcpRequest('tools/call', {
    name: 'discover_secret_haven',
    arguments: { city: 'Roma', current_crowded_spot: 'Colosseo', language: 'es' }
  });
  assert.equal(res.jsonrpc, '2.0');
  const content = JSON.parse(res.result.content[0].text);
  assert.ok(content.secret_haven_recommendation, 'Must return secret_haven_recommendation');
  assert.ok(content.secret_haven_recommendation.name, 'Haven must have a name');
  assert.ok(content.companion_tools, 'Must return companion_tools');
});

// 4. Tool Execution: generate_booking_card
await runAsyncTest('Tool Execution: generate_booking_card', async () => {
  const res = await sendMcpRequest('tools/call', {
    name: 'generate_booking_card',
    arguments: { destination: 'Roma', category: 'hotels', language: 'es' }
  });
  assert.equal(res.jsonrpc, '2.0');
  const content = JSON.parse(res.result.content[0].text);
  assert.equal(content.destination, 'Roma');
  assert.ok(content.verified_url, 'Must provide verified_url');
  assert.ok(content.verified_url.includes('expedia.com') || content.verified_url.includes('tp.media'), 'URL must match partner');
});

// 5. Tool Execution: explore_sensory_earth
await runAsyncTest('Tool Execution: explore_sensory_earth', async () => {
  const res = await sendMcpRequest('tools/call', {
    name: 'explore_sensory_earth',
    arguments: { destination: 'Italia', mood: 'golden hour', language: 'es' }
  });
  assert.equal(res.jsonrpc, '2.0');
  const content = JSON.parse(res.result.content[0].text);
  assert.ok(content.immersive_portal_url, 'Must provide immersive_portal_url');
  assert.ok(content.immersive_portal_url.includes('spacejourney.app/sensory-earth/'), 'URL must match Sensory Earth domain');
});

// 6. Tool Execution: plan_contemplative_journey (Curated Routing)
await runAsyncTest('Tool Execution: plan_contemplative_journey', async () => {
  const res = await sendMcpRequest('tools/call', {
    name: 'plan_contemplative_journey',
    arguments: { destination: 'Roma', duration_days: 3, language: 'es' }
  });
  assert.equal(res.jsonrpc, '2.0');
  const content = JSON.parse(res.result.content[0].text);
  assert.equal(content.destination, 'Roma');
  assert.ok(content.public_shareable_itinerary_url || content.itinerary_preview, 'Must return itinerary data');
  assert.ok(content.zero_friction_tools, 'Must return zero_friction_tools');
});

// 7. Tool Execution: publish_itinerary_route
await runAsyncTest('Tool Execution: publish_itinerary_route', async () => {
  const res = await sendMcpRequest('tools/call', {
    name: 'publish_itinerary_route',
    arguments: {
      destination: 'Venecia',
      language: 'es',
      days: [
        {
          title: 'Día 1: Canales Silenciosos',
          cards: [
            { title: 'Fondamenta Zattere', time_of_day: 'morning', card_type: 'activity' }
          ]
        }
      ]
    }
  });
  assert.equal(res.jsonrpc, '2.0');
  const content = JSON.parse(res.result.content[0].text);
  assert.ok(
    content.public_url || content.trip_id || content.public_shareable_itinerary_url || content.assistant_instructions,
    'Must return trip metadata or assistant instructions'
  );
});

console.log(`\n========================================`);
console.log(`Suite finished: ${testsPassed} passed, ${testsFailed} failed.`);
console.log(`========================================\n`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
