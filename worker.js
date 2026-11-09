/**
 * Space Journey MCP Engine - Root Worker Re-Export
 * Exposes the full Cloudflare Worker module for root imports, package.json "main" resolution, and stdio runners.
 */
export * from './worker/worker.js';
import worker from './worker/worker.js';
export default worker;
