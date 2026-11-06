"""
Space Journey MCP Engine - Full Tool Coverage Verification Test
Explicitly verifies and references all 5 tools by name to ensure 100% test coverage.
"""
import unittest
from unittest.mock import patch
from server import (
    plan_contemplative_journey,
    discover_secret_haven,
    generate_booking_card,
    explore_sensory_earth,
    publish_itinerary_route,
)


class TestToolsCoverageByName(unittest.TestCase):
    def setUp(self):
        self.net = patch('server.urllib.request.urlopen', side_effect=OSError('offline test'))
        self.net.start()
        self.addCleanup(self.net.stop)

    def test_plan_contemplative_journey(self):
        """Reference and test tool plan_contemplative_journey by name."""
        result = plan_contemplative_journey(city="Paris", days=2, locale="es")
        self.assertIn("destination", result)

    def test_discover_secret_haven(self):
        """Reference and test tool discover_secret_haven by name."""
        result = discover_secret_haven(area_or_landmark="Montmartre", locale="es")
        self.assertIn("havens", result)

    def test_generate_booking_card(self):
        """Reference and test tool generate_booking_card by name."""
        result = generate_booking_card(haven_id="MIA-3378", locale="es")
        self.assertIn("title", result)

    def test_explore_sensory_earth(self):
        """Reference and test tool explore_sensory_earth by name."""
        result = explore_sensory_earth(country_or_city="France", locale="es")
        self.assertIn("launch_3d_globe_autoplay_url", result)

    def test_publish_itinerary_route(self):
        """Reference and test tool publish_itinerary_route by name."""
        dummy_days = [{"day": 1, "title": "Jour 1", "curated_moments": []}]
        with patch("server.sync_trip_to_wordpress", return_value={"trip_id": "cov-fixture", "public_url": "https://spacejourney.app/ruta/?trip=cov-fixture"}):
            result = publish_itinerary_route(destination="Paris", days=dummy_days, language="es")
        self.assertEqual(result.get("status"), "published")


if __name__ == "__main__":
    unittest.main()
