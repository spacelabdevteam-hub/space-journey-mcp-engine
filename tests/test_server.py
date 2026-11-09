"""
Space Journey MCP Engine - Python Reference Test Suite
Exercises all tools, annotations, and schemas against the local server implementation.
"""
import sys
import unittest
from pathlib import Path

# Ensure parent directory is in python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from server import (
    mcp,
    TOOL_METADATA,
    plan_contemplative_journey,
    discover_secret_haven,
    generate_booking_card,
    explore_sensory_earth,
    publish_itinerary_route,
)


class TestSpaceJourneyMcpServer(unittest.TestCase):
    def test_tools_annotations_declared(self):
        """Audit that all tools declare all 4 hints as booleans."""
        expected_tools = [
            "plan_contemplative_journey",
            "discover_secret_haven",
            "generate_booking_card",
            "explore_sensory_earth",
            "publish_itinerary_route",
        ]
        for name in expected_tools:
            self.assertIn(name, TOOL_METADATA, f"{name} must have metadata")
            meta = TOOL_METADATA[name]
            self.assertIsInstance(meta.get("readOnlyHint"), bool)
            self.assertIsInstance(meta.get("destructiveHint"), bool)
            self.assertIsInstance(meta.get("idempotentHint"), bool)
            self.assertIsInstance(meta.get("openWorldHint"), bool)

            ann = meta.get("annotations", {})
            self.assertIsInstance(ann.get("readOnlyHint"), bool)
            self.assertIsInstance(ann.get("destructiveHint"), bool)
            self.assertIsInstance(ann.get("idempotentHint"), bool)
            self.assertIsInstance(ann.get("openWorldHint"), bool)

    def test_plan_contemplative_journey(self):
        """Test plan_contemplative_journey tool by name."""
        res = plan_contemplative_journey(city="Rome", days=2, locale="es")
        self.assertIn("destination", res)
        self.assertIn("triad_of_wellbeing_tools", res)

    def test_discover_secret_haven(self):
        """Test discover_secret_haven tool by name."""
        res = discover_secret_haven(area_or_landmark="Trastevere", locale="es")
        self.assertIn("havens", res)
        self.assertIn("triad_of_wellbeing_tools", res)

    def test_generate_booking_card(self):
        """Test generate_booking_card tool by name."""
        res = generate_booking_card(haven_id="MIA-3378", locale="es")
        self.assertIn("title", res)
        self.assertIn("affiliate_booking_options", res)
        self.assertIn("direct_experience_url", res)

    def test_explore_sensory_earth(self):
        """Test explore_sensory_earth tool by name."""
        res = explore_sensory_earth(country_or_city="Italia", locale="es")
        self.assertIn("launch_3d_globe_autoplay_url", res)
        self.assertIn("spacejourney.app", res["launch_3d_globe_autoplay_url"])

    def test_publish_itinerary_route(self):
        """Test publish_itinerary_route tool by name."""
        dummy_days = [{"day": 1, "title": "Day 1", "curated_moments": []}]
        res = publish_itinerary_route(destination="Rome", days=dummy_days, language="es")
        self.assertIn(res.get("status"), ("published", "not_published"))
        self.assertIn("shareable_route_url", res)


if __name__ == "__main__":
    unittest.main()
