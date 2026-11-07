import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/worker.js';
const call = (body, env = {}) => worker.fetch(new Request('https://example.test/mcp', {method:'POST',body:JSON.stringify(body)}), env);
for (const payload of [null, [], {}, {jsonrpc:'1.0',method:'tools/list'}]) test('invalid envelope '+JSON.stringify(payload), async()=>{const r=await call(payload);assert.equal(r.status,400);assert.equal((await r.json()).error.code,-32600);});
test('arguments cannot be an array',async()=>{const r=await call({jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'publish_itinerary_route',arguments:[]}});assert.equal((await r.json()).error.code,-32602);});
test('initialization notification has no JSON-RPC response',async()=>{const r=await call({jsonrpc:'2.0',method:'notifications/initialized'});assert.equal(r.status,202);assert.equal(await r.text(),'');});
test('publish_itinerary_route does not write without configured secret',async()=>{let writes=0;globalThis.fetch=async(u,o)=>{if(o?.method==='POST')writes++;return Response.json({data:[]});};const r=await call({jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'publish_itinerary_route',arguments:{destination:'Roma',days:[{title:'Test',cards:[{title:'Colosseum',time_of_day:'morning',card_type:'activity'}]}]}}});assert.equal(writes,0);const data=JSON.parse((await r.json()).result.content[0].text);assert.equal(data.trip_id,'');});

test('failed publication never fabricates a public itinerary', async()=>{
  globalThis.fetch=async()=>Response.json({error:'upstream unavailable'},{status:503});
  const r=await call({jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'publish_itinerary_route',arguments:{destination:'Roma',days:[{title:'Day 1',cards:[{title:'Colosseum',time_of_day:'morning',card_type:'activity'}]}]}}},{SJ_SYNC_TOKEN:'fixture-only'});
  const out=JSON.parse((await r.json()).result.content[0].text);
  assert.equal(out.trip_id,'');
  assert.equal(out.public_shareable_itinerary_url,'');
});
