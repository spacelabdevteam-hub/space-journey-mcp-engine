/**
 * Space Journey Worker MCP Tools - Full Automated Coverage Suite
 * Validates that all 5 declared tools execute and return valid responses.
 */

import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import worker, {
  plan_contemplative_journey,
  discover_secret_haven,
  generate_booking_card,
  explore_sensory_earth,
  publish_itinerary_route
} from '../worker.js';

// Mock external fetch for deterministic execution
globalThis.fetch = async () => new Response(JSON.stringify({ data: [], trip_id: 'test-fixture' }), {
  headers: { 'Content-Type': 'application/json' }
});

describe('Space Journey Worker Tools - High Level Direct Execution', () => {
  it('plan_contemplative_journey generates a contemplative travel route', async () => {
    const res = await plan_contemplative_journey({ destination: 'Roma', duration_days: 2 });
    assert.ok(res, 'plan_contemplative_journey must return a result');
    assert.equal(res.destination, 'Roma');
    assert.ok(res.itinerary_preview || res.public_shareable_itinerary_url);
  });

  it('discover_secret_haven discovers quiet cultural sanctuary', async () => {
    const res = await discover_secret_haven({ city: 'Roma', current_crowded_spot: 'Colosseo' });
    assert.ok(res, 'discover_secret_haven must return a result');
    assert.ok(res.secret_haven_recommendation);
    assert.ok(res.companion_tools);
  });

  it('generate_booking_card produces verified booking card', async () => {
    const res = await generate_booking_card({ destination: 'Roma', category: 'hotels' });
    assert.ok(res, 'generate_booking_card must return a result');
    assert.equal(res.destination, 'Roma');
    assert.ok(res.verified_url);
  });

  it('explore_sensory_earth connects to the 3D planetary globe', async () => {
    const res = await explore_sensory_earth({ destination: 'Italia', mood: 'golden hour' });
    assert.ok(res, 'explore_sensory_earth must return a result');
    assert.ok(res.immersive_portal_url);
    assert.ok(res.immersive_portal_url.includes('spacejourney.app/sensory-earth/'));
  });

  it('publish_itinerary_route validates route publishing structure', async () => {
    const res = await publish_itinerary_route({
      destination: 'Roma',
      days: [
        {
          title: 'Día 1: Paseo Contemplativo',
          cards: [{ title: 'Piazza Navona al alba', time_of_day: 'morning', card_type: 'activity' }]
        }
      ]
    });
    assert.ok(res, 'publish_itinerary_route must return a result');
    assert.ok(res.assistant_instructions || res.public_url || res.status);
  });
});

test('plan_contemplative_journey tool reference test', async () => {
  const res = await plan_contemplative_journey({ destination: 'Paris', duration_days: 3 });
  assert.ok(res);
  assert.equal(res.destination, 'Paris');
});

test('discover_secret_haven tool reference test', async () => {
  const res = await discover_secret_haven({ city: 'Paris' });
  assert.ok(res);
  assert.ok(res.secret_haven_recommendation);
});

test('generate_booking_card tool reference test', async () => {
  const res = await generate_booking_card({ destination: 'Paris' });
  assert.ok(res);
  assert.equal(res.destination, 'Paris');
});

test('explore_sensory_earth tool reference test', async () => {
  const res = await explore_sensory_earth({ destination: 'France' });
  assert.ok(res);
  assert.ok(res.immersive_portal_url);
});

test('publish_itinerary_route tool reference test', async () => {
  const res = await publish_itinerary_route({ destination: 'Paris', days: [] });
  assert.ok(res);
});
