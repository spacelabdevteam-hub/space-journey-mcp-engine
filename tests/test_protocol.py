import unittest
import os
import sys
from pathlib import Path
from unittest.mock import patch
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import server

class ProtocolTests(unittest.IsolatedAsyncioTestCase):
    async def test_stdio_initialization_and_discovery(self):
        params = StdioServerParameters(command=sys.executable,args=[str(Path(__file__).resolve().parents[1]/'server.py')],env={**os.environ, 'SPACE_JOURNEY_SYNC_TOKEN':'', 'SJ_SYNC_TOKEN':''})
        import asyncio
        async with asyncio.timeout(20), stdio_client(params) as (reader, writer):
            async with ClientSession(reader, writer) as session:
                result = await session.initialize()
                self.assertEqual(result.serverInfo.name,'space-journey-engine')
                tools = (await session.list_tools()).tools
                self.assertEqual({t.name for t in tools},set(server.TOOL_METADATA))
                self.assertTrue(all(t.annotations is not None for t in tools))
    async def test_publish_itinerary_route_fails_closed_without_secret(self):
        with patch.dict(os.environ, {'SPACE_JOURNEY_SYNC_TOKEN':'', 'SJ_SYNC_TOKEN':''}), patch('server.urllib.request.urlopen', side_effect=OSError('offline')):
            result=server.publish_itinerary_route('Roma',[{'day':1}])
            self.assertEqual(result['status'],'not_published')
            self.assertFalse(result['trip_id'])
