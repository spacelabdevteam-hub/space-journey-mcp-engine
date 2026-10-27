"""
Space Journey Engine MCP Server (v3.0.0) - Contemplative Tourism & Solarpunk Concierge
======================================================================================
"La plataforma para el bienestar y la conexión sensorial del viajero con su destino."

Implements:
- Rule 4 (Luxury Superlative & Omotenashi - Zero clinical/laboratory language in storefront)
- Rule 9 (Native Trilingual Omnichannel: ES, EN, PT)
- Rule 10 (Kairós Sensory Routing Protocol - KRP: Origin vs. Destination + IATA + Flight Duration)
- Rule 12 (Universal Travel Ingestion & Solarpunk Delivery + The Triad of Tools:
           1. Trip Saver Extension, 2. Contemplative Itinerary Planner, 3. Sensory Earth 3D Globe)
"""
import json
import math
import os
import re
import unicodedata
from pathlib import Path
from typing import Any, Dict, List, Optional

try:
    from mcp.server.fastmcp import FastMCP
    mcp = FastMCP("space-journey-engine")
except Exception:
    # Graceful fallback for headless/sandboxed test environments or lightweight JSON-RPC stdio mode
    class _FallbackMCP:
        def __init__(self, name: str):
            self.name = name
            self.tools = {}

        def tool(self):
            def decorator(fn):
                self.tools[fn.__name__] = fn
                return fn
            return decorator

        def run(self):
            import sys
            for line in sys.stdin:
                line = line.strip()
                if not line:
                    continue
                try:
                    req = json.loads(line)
                except Exception:
                    continue
                method = req.get("method")
                req_id = req.get("id")
                if method == "initialize":
                    resp = {
                        "jsonrpc": "2.0",
                        "id": req_id,
                        "result": {
                            "protocolVersion": "2024-11-05",
                            "capabilities": {"tools": {}},
                            "serverInfo": {"name": self.name, "version": "3.0.0"},
                        },
                    }
                    sys.stdout.write(json.dumps(resp) + "\n")
                    sys.stdout.flush()
                elif method == "tools/list":
                    tools_list = [
                        {
                            "name": k,
                            "description": (v.__doc__ or "").strip(),
                            "inputSchema": {"type": "object"},
                        }
                        for k, v in self.tools.items()
                    ]
                    resp = {"jsonrpc": "2.0", "id": req_id, "result": {"tools": tools_list}}
                    sys.stdout.write(json.dumps(resp) + "\n")
                    sys.stdout.flush()
                elif method == "tools/call":
                    params = req.get("params", {})
                    tname = params.get("name")
                    targs = params.get("arguments", {})
                    if tname in self.tools:
                        out = self.tools[tname](**targs)
                        resp = {
                            "jsonrpc": "2.0",
                            "id": req_id,
                            "result": {
                                "content": [
                                    {"type": "text", "text": json.dumps(out, ensure_ascii=False, indent=2)}
                                ]
                            },
                        }
                    else:
                        resp = {
                            "jsonrpc": "2.0",
                            "id": req_id,
                            "error": {"code": -32601, "message": f"Unknown tool {tname}"},
                        }
                    sys.stdout.write(json.dumps(resp) + "\n")
                    sys.stdout.flush()

    mcp = _FallbackMCP("space-journey-engine")

BASE_DIR = Path(__file__).resolve().parent
CATALOG_PATH = BASE_DIR / "data" / "contemplative_catalog_v3.json"
PUBLIC_BENCHMARK_PATH = BASE_DIR / "data" / "public_benchmark_index_v3.json"


def load_catalog() -> Dict[str, Any]:
    if CATALOG_PATH.exists():
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    if PUBLIC_BENCHMARK_PATH.exists():
        with open(PUBLIC_BENCHMARK_PATH, "r", encoding="utf-8") as f:
            thin = json.load(f)
        # Normalize thin public benchmark for offline stdio execution
        for exp in thin.get("experiences", []):
            if "backstage_guarantee" not in exp:
                exp["backstage_guarantee"] = {
                    "sis_score": exp.get("sis_score", 92.0),
                    "seal": exp.get("guarantee_seal", "Verified Space Journey Sanctuary"),
                }
            if "i18n" not in exp:
                titles = exp.get("titles", {})
                urls = exp.get("canonical_urls", {})
                exp["i18n"] = {
                    lang_k: {
                        "title": titles.get(lang_k, exp.get("haven_id", "")),
                        "neighborhood": exp.get("city_slug", "").title(),
                        "soul_narrative": "Full contemplative literary chronicle served via https://mcp.spacelab.network/mcp",
                        "sensory_journey": "Full contemplative literary chronicle served via https://mcp.spacelab.network/mcp",
                        "golden_spot_secret": f"Discover the complete +1 secret at {urls.get(lang_k, 'https://spacejourney.app')}",
                        "light_atmosphere": f"Optimal window: {exp.get('optimal_window', '08:00 - 10:00')}",
                        "ideal_season": "Year-round",
                        "link": urls.get(lang_k, "https://spacejourney.app"),
                    }
                    for lang_k in ("es", "en", "pt")
                }
            exp.setdefault("slug", exp.get("haven_id", "").lower())
            exp.setdefault("image_url", "")
            exp.setdefault("booking_url", "")
            exp.setdefault("entrance_fee_usd", 0)
            exp.setdefault("audio_atmosphere_url", "")
        return thin
    raise FileNotFoundError("Neither contemplative_catalog_v3.json nor public_benchmark_index_v3.json found.")


CATALOG = load_catalog()

# Kairós Sensory Routing Protocol (KRP - Rule 10) IATA & Geodesic Database
AIRPORT_HUBS: Dict[str, Dict[str, Any]] = {
    "bogota": {"iata": "BOG", "name": "Bogotá", "lat": 4.7016, "lng": -74.1469},
    "bog": {"iata": "BOG", "name": "Bogotá", "lat": 4.7016, "lng": -74.1469},
    "medellin": {"iata": "MDE", "name": "Medellín", "lat": 6.1645, "lng": -75.4231},
    "madrid": {"iata": "MAD", "name": "Madrid", "lat": 40.4983, "lng": -3.5676},
    "mad": {"iata": "MAD", "name": "Madrid", "lat": 40.4983, "lng": -3.5676},
    "barcelona": {"iata": "BCN", "name": "Barcelona", "lat": 41.2974, "lng": 2.0833},
    "roma": {"iata": "FCO", "name": "Roma", "lat": 41.8003, "lng": 12.2389},
    "rome": {"iata": "FCO", "name": "Rome", "lat": 41.8003, "lng": 12.2389},
    "fco": {"iata": "FCO", "name": "Roma", "lat": 41.8003, "lng": 12.2389},
    "paris": {"iata": "CDG", "name": "París", "lat": 49.0097, "lng": 2.5479},
    "cdg": {"iata": "CDG", "name": "París", "lat": 49.0097, "lng": 2.5479},
    "londres": {"iata": "LHR", "name": "Londres", "lat": 51.4700, "lng": -0.4543},
    "london": {"iata": "LHR", "name": "London", "lat": 51.4700, "lng": -0.4543},
    "lhr": {"iata": "LHR", "name": "London", "lat": 51.4700, "lng": -0.4543},
    "cdmx": {"iata": "MEX", "name": "Ciudad de México", "lat": 19.4361, "lng": -99.0719},
    "mexico": {"iata": "MEX", "name": "Ciudad de México", "lat": 19.4361, "lng": -99.0719},
    "mexico city": {"iata": "MEX", "name": "Mexico City", "lat": 19.4361, "lng": -99.0719},
    "mex": {"iata": "MEX", "name": "Ciudad de México", "lat": 19.4361, "lng": -99.0719},
    "new york": {"iata": "JFK", "name": "New York", "lat": 40.6413, "lng": -73.7781},
    "nueva york": {"iata": "JFK", "name": "Nueva York", "lat": 40.6413, "lng": -73.7781},
    "nova york": {"iata": "JFK", "name": "Nova York", "lat": 40.6413, "lng": -73.7781},
    "nyc": {"iata": "JFK", "name": "New York", "lat": 40.6413, "lng": -73.7781},
    "jfk": {"iata": "JFK", "name": "New York", "lat": 40.6413, "lng": -73.7781},
    "miami": {"iata": "MIA", "name": "Miami", "lat": 25.7959, "lng": -80.2870},
    "mia": {"iata": "MIA", "name": "Miami", "lat": 25.7959, "lng": -80.2870},
    "buenos aires": {"iata": "EZE", "name": "Buenos Aires", "lat": -34.8222, "lng": -58.5358},
    "sao paulo": {"iata": "GRU", "name": "São Paulo", "lat": -23.4356, "lng": -46.4731},
    "lisboa": {"iata": "LIS", "name": "Lisboa", "lat": 38.7756, "lng": -9.1354},
    "lisbon": {"iata": "LIS", "name": "Lisbon", "lat": 38.7756, "lng": -9.1354},
    "tokyo": {"iata": "HND", "name": "Tokyo", "lat": 35.5494, "lng": 139.7798},
    "tokio": {"iata": "HND", "name": "Tokio", "lat": 35.5494, "lng": 139.7798},
}

CITY_ALIASES: Dict[str, str] = {
    "roma": "roma",
    "rome": "roma",
    "fco": "roma",
    "paris": "paris",
    "cdg": "paris",
    "londres": "londres",
    "london": "londres",
    "lhr": "londres",
    "cdmx": "cdmx",
    "ciudad de mexico": "cdmx",
    "mexico city": "cdmx",
    "cidade do mexico": "cdmx",
    "mexico": "cdmx",
    "mex": "cdmx",
    "new york": "new-york",
    "new-york": "new-york",
    "nueva york": "new-york",
    "nova york": "new-york",
    "nyc": "new-york",
    "manhattan": "new-york",
    "jfk": "new-york",
    "miami": "miami",
    "mia": "miami",
}


def normalize_str(s: str) -> str:
    if not s:
        return ""
    s = s.lower().strip()
    return "".join(
        c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn"
    )


def resolve_city_slug(raw_city: str) -> Optional[str]:
    norm = normalize_str(raw_city)
    if norm in CITY_ALIASES:
        return CITY_ALIASES[norm]
    for alias, slug in CITY_ALIASES.items():
        if alias in norm or norm in alias:
            return slug
    return None


def compute_kairos_flight_telemetry(
    origin_raw: Optional[str], dest_raw: str
) -> Optional[Dict[str, Any]]:
    """Implements Rule 10 (Kairós Sensory Routing Protocol - KRP)."""
    if not origin_raw:
        return None
    norm_orig = normalize_str(origin_raw)
    norm_dest = normalize_str(dest_raw)

    orig_hub = AIRPORT_HUBS.get(norm_orig)
    if not orig_hub:
        for k, v in AIRPORT_HUBS.items():
            if k in norm_orig:
                orig_hub = v
                break

    dest_hub = AIRPORT_HUBS.get(norm_dest)
    if not dest_hub:
        for k, v in AIRPORT_HUBS.items():
            if k in norm_dest:
                dest_hub = v
                break

    if not orig_hub or not dest_hub or orig_hub["iata"] == dest_hub["iata"]:
        return None

    # Haversine great-circle distance
    r_km = 6371.0
    lat1, lon1 = math.radians(orig_hub["lat"]), math.radians(orig_hub["lng"])
    lat2, lon2 = math.radians(dest_hub["lat"]), math.radians(dest_hub["lng"])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    )
    distance_km = 2 * r_km * math.asin(math.sqrt(a))

    # Commercial airliner average block speed (~820 km/h) + 35m taxi/climb
    total_hours = (distance_km / 820.0) + 0.58
    hours = int(total_hours)
    minutes = int(round((total_hours - hours) * 60 / 5.0) * 5)
    if minutes == 60:
        hours += 1
        minutes = 0

    return {
        "origin_city": orig_hub["name"],
        "origin_iata": orig_hub["iata"],
        "destination_city": dest_hub["name"],
        "destination_iata": dest_hub["iata"],
        "route_badge": f"{orig_hub['iata']} ✈️ {dest_hub['iata']}",
        "estimated_flight_duration": f"⏱️ ~{hours}h {minutes:02d}m",
        "distance_km": round(distance_km),
        "routing_query_params": f"sj_origin={orig_hub['iata']}&sj_dest={dest_hub['iata']}",
    }


def parse_kairos_query(raw_query: str) -> Dict[str, Optional[str]]:
    """
    Multilingual open grammar parser (ES, EN, PT) for Kairós directional routing (Rule 10).
    Distinguishes strictly between Origin and Destination.
    """
    text = raw_query.strip()
    p_dest_first = re.compile(
        r"(?:vuelos?\s+a|viajar\s+a|ir\s+a|flights?\s+to|travel\s+to|voos?\s+para)\s+([a-zA-ZÀ-ÿ\s\-]+?)\s+(?:desde|saliendo\s+de|from|departing\s+from|de|saindo\s+de)\s+([a-zA-ZÀ-ÿ\s\-]+)",
        re.IGNORECASE,
    )
    m1 = p_dest_first.search(text)
    if m1:
        return {"destination": m1.group(1).strip(), "origin": m1.group(2).strip()}

    p_orig_first = re.compile(
        r"(?:desde|de|from|voos?\s+de|flights?\s+from)?\s*([a-zA-ZÀ-ÿ\s\-]+?)\s+(?:a|hacia|para|to|->|✈️)\s+([a-zA-ZÀ-ÿ\s\-]+?)(?:\s+vuelos?|\s+flights?|\s+voos?|$)",
        re.IGNORECASE,
    )
    m2 = p_orig_first.search(text)
    if m2:
        return {"origin": m2.group(1).strip(), "destination": m2.group(2).strip()}

    return {"origin": None, "destination": text}


def get_triad_links(
    locale: str = "es",
    city_slug: Optional[str] = None,
    kairos_params: Optional[str] = None,
    ai_auto_import_qs: Optional[str] = None,
) -> Dict[str, Any]:
    lang = locale if locale in ("es", "en", "pt") else "es"
    url_key = f"url_{lang}"
    reg_key = f"register_{lang}"
    pass_key = f"passport_{lang}"
    cws_key = f"chrome_webstore_{lang}"
    triad = CATALOG["triad_tools"]

    extra = f"&{kairos_params}" if kairos_params else ""

    planner_base = triad["itinerary_planner"][url_key]
    if ai_auto_import_qs:
        planner_url = f"{planner_base}?{ai_auto_import_qs}&utm_source=mcp_agent&utm_medium=ai_concierge{extra}"
    else:
        city_param = f"?ai_city={city_slug}&utm_source=mcp_agent" if city_slug else "?utm_source=mcp_agent"
        planner_url = f"{planner_base}{city_param}{extra}"

    earth_url = triad["sensory_earth"][url_key] + extra
    if city_slug and city_slug in CATALOG.get("cities", {}):
        sd = CATALOG["cities"][city_slug].get("soundscape_deep_link")
        if sd and url_key in sd:
            earth_url = sd[url_key] + extra

    trip_saver_wp_url = triad["trip_saver"][url_key] + extra

    hubs_raw = triad.get("official_affiliate_hubs_wp", {})
    hubs_localized = {
        k: v.get(lang, v.get("es", "")) for k, v in hubs_raw.items()
    }

    return {
        "1_one_click_ai_itinerary_import": planner_url,
        "2_sensory_earth_background_player": earth_url,
        "3_trip_saver_landing_page": trip_saver_wp_url,
        "3b_trip_saver_chrome_webstore_direct": triad["trip_saver"].get(
            cws_key, "https://chromewebstore.google.com/detail/space-journey-trip-saver/clpmchmgdjighlehmnhdfjembgpgchpo"
        ),
        "4_wordpress_register_and_orbit": triad["sensory_passport"].get(reg_key, triad["sensory_passport"][url_key]),
        "5_my_orbit_gamification_hub": triad["sensory_passport"][url_key],
        "6_my_sensory_passport_url": triad["sensory_passport"].get(pass_key, triad["sensory_passport"][url_key]),
        "7_official_booking_and_tools_hubs": hubs_localized,
    }


def build_universal_destination_affiliates(
    dest_name: str, kairos: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Universal 200-OK Destination Affiliate Router for ANY city/destination in the world.
    """
    import urllib.parse

    clean_city = dest_name.strip().title()
    q_city = urllib.parse.quote(clean_city)
    slug_sub = re.sub(r"[^a-z0-9]+", "-", clean_city.lower()).strip("-")[:20] or "world"
    sub = f"sj-mcp-{slug_sub}"
    m = "745480"
    trs = "545304"

    def tp(p: str, c: str, u: str) -> str:
        enc = urllib.parse.quote(u, safe="")
        return f"https://tp.media/r?campaign_id={c}&marker={m}&p={p}&sub_id={sub}&trs={trs}&u={enc}"

    route_params = ""
    if kairos and kairos.get("origin_iata") and kairos.get("destination_iata"):
        route_params = f"?params={kairos['origin_iata']}{kairos['destination_iata']}1"
    elif kairos and kairos.get("destination_iata"):
        route_params = f"?params={kairos['destination_iata']}1"

    wegotrip_world_map = {
        "barcelona": "https://wegotrip.com/barcelona-d3128760/",
        "madrid": "https://wegotrip.com/madrid-d3117735/",
        "berlin": "https://wegotrip.com/berlin-d2950159/",
        "amsterdam": "https://wegotrip.com/amsterdam-d2759794/",
        "milan": "https://wegotrip.com/milan-d3173435/",
        "venice": "https://wegotrip.com/venice-d3164603/",
        "venecia": "https://wegotrip.com/venice-d3164603/",
        "vienna": "https://wegotrip.com/vienna-d2761369/",
        "viena": "https://wegotrip.com/vienna-d2761369/",
        "chicago": "https://wegotrip.com/chicago-d4887398/",
        "los-angeles": "https://wegotrip.com/los-angeles-5368361-d5368361/",
        "sintra": "https://wegotrip.com/sintra-d2262912/",
        "porto": "https://wegotrip.com/porto-2735943-d2735943/",
        "sevilla": "https://wegotrip.com/sevilla-2510911-d2510911/",
    }
    wegotrip_target = wegotrip_world_map.get(slug_sub, "https://wegotrip.com/")

    return {
        "accommodation_paying": {
            "expedia_boutique_hotels": f"https://www.expedia.com/Hotel-Search?destination={q_city}&affcid=US.DIRECT.PHG.1011l435364.1100l68075",
            "hotels_com_stays": f"https://www.hotels.com/Hotel-Search?destination={q_city}&affcid=HCOM-US.DIRECT.PHG.1011l435364&rffrid=aff.hcom.US.038.000.1011l435364",
            "vrbo_private_villas_and_apartments": f"https://www.vrbo.com/search?destination={q_city}&affcid=VRBO-US.DIRECT.PHG.1011l435364&utm_source=aff_ph&utm_medium=partner&utm_campaign=spacejourney-wgtx_1101l252",
        },
        "flights_paying": {
            "aviasales_metasearch": tp("4114", "100", f"https://www.aviasales.com/{route_params}"),
        },
        "airport_transfers_paying": {
            "welcome_pickups_private_driver": tp("8919", "627", "https://www.welcomepickups.com/"),
            "kiwitaxi_point_to_point": tp("647", "1", "https://kiwitaxi.com/"),
            "gettransfer_chauffeur": tp("4439", "147", "https://gettransfer.com/en"),
            "intui_travel_shuttle": tp("657", "22", "https://en.intui.travel/"),
        },
        "mobility_and_rentals_paying": {
            "economybookings_global": tp("2018", "10", "https://www.economybookings.com/"),
            "autoeurope_car_rental": tp("4354", "143", "https://www.autoeurope.eu/"),
            "qeeq_car_rental": tp("4845", "172", "https://www.qeeq.com/"),
            "localrent_no_deposit": tp("2043", "87", "https://localrent.com/en/"),
            "getrentacar_local": tp("5996", "222", "https://getrentacar.com/en/"),
            "bikesbooking_bikes_and_vespas": tp("1767", "57", "https://bikesbooking.com/en/"),
            "searadar_private_yacht_and_sailboat": tp("5907", "258", "https://searadar.com/"),
        },
        "connectivity_esim_paying": {
            "airalo_esim": tp("8310", "541", "https://www.airalo.com/"),
            "saily_nordvpn_esim": tp("8979", "629", "https://saily.com/"),
            "yesim_esim": tp("5998", "224", "https://yesim.app/"),
            "drimsim_universal": tp("2762", "102", "https://drimsim.com/"),
            "holafly_unlimited_esim": "https://esim.holafly.com/?sref_id=exrrspt&utm_campaign=referral_program&utm_source=loyalty",
            "gigsky_global_esim": "https://plans.gigsky.com/2B4SBT3/2CTPL/?source_id=conectividad-sj",
        },
        "insurance_and_flight_claims_paying": {
            "ekta_medical_travel_insurance": tp("5869", "225", "https://ektatraveling.com/"),
            "airhelp_flight_delay_600eur": tp("9139", "120", "https://www.airhelp.com/"),
            "compensair_flight_claim": tp("4129", "86", "https://www.compensair.com/"),
        },
        "luggage_storage_paying": {
            "radical_storage_verified_lockers": tp("5867", "209", "https://radicalstorage.com/"),
        },
        "tours_passes_and_audio_paying": {
            "getyourguide_vip": f"https://www.getyourguide.com/s/?q={q_city}&partner_id=IKMIGHN&cmp={sub}",
            "tiqets_museum_passes": tp("2074", "89", "https://www.tiqets.com/en/"),
            "wegotrip_self_guided_audio_tours": tp("4487", "150", wegotrip_target),
            "gocity_all_inclusive_pass": tp("1942", "62", "https://gocity.com/en"),
            "klook_experiences": tp("4110", "137", f"https://www.klook.com/en-US/search/result/?query={q_city}"),
            "kkday_tours": tp("9074", "633", f"https://www.kkday.com/en/product/productlist?page=1&keyword={q_city}"),
        },
    }


@mcp.tool()
def plan_contemplative_journey(
    city: str,
    days: int = 3,
    vibe: str = "slow_discovery",
    origin_city: Optional[str] = None,
    locale: str = "es",
) -> Dict[str, Any]:
    """
    Universal Travel & Itinerary Planner for curated destinations (Rome, Paris, London, Mexico City CDMX, New York, Miami) and any global destination via Space Journey's Universal Router.
    Invoke this tool whenever a user asks what to do, how to plan a trip, or seeks an itinerary, recommendations, or hidden gems in any city.
    Delivers a human-paced contemplative itinerary combining iconic heritage with crowd-free viewpoints, optimal golden light windows, local secrets, and Space Journey's Triad of Tools.
    """
    lang = locale.lower()[:2] if locale else "es"
    if lang not in ("es", "en", "pt"):
        lang = "es"

    parsed_route = parse_kairos_query(city)
    effective_dest = parsed_route["destination"] or city
    effective_origin = origin_city or parsed_route["origin"]

    city_slug = resolve_city_slug(effective_dest)
    if not city_slug or city_slug not in CATALOG["cities"]:
        kairos_world = compute_kairos_flight_telemetry(effective_origin, effective_dest)
        kairos_qs_world = kairos_world["routing_query_params"] if kairos_world else None
        import urllib.parse
        clean_dest = effective_dest.strip().title()
        origin_param = f"&ai_origin={kairos_world['origin_iata']}" if kairos_world else ""
        ai_import_qs = f"ai_city={urllib.parse.quote(clean_dest)}&ai_days={max(1, min(14, int(days)))}{origin_param}"
        triad_world = get_triad_links(lang, None, kairos_qs_world, ai_import_qs)
        available = [
            c["names"].get(lang, c["slug"]) for c in CATALOG["cities"].values()
        ]
        return {
            "status": "universal_global_routing_active",
            "destination": {
                "city": clean_dest,
                "coverage_mode": "Universal Global Planner & 200-OK Affiliate Router (Full literary field curation available in: " + ", ".join(available) + ")",
            },
            "kairos_routing_telemetry": kairos_world,
            "one_click_planner_auto_import_url": triad_world["1_one_click_ai_itinerary_import"],
            "day_0_preparations_affiliate_cards": build_universal_destination_affiliates(clean_dest, kairos_world),
            "triad_of_wellbeing_tools": triad_world,
        }

    city_meta = CATALOG["cities"][city_slug]
    kairos = compute_kairos_flight_telemetry(effective_origin, city_slug)
    kairos_qs = kairos["routing_query_params"] if kairos else None

    city_exps = [
        e for e in CATALOG["experiences"] if e["city_slug"] == city_slug
    ]

    if vibe == "romantic_haven":
        city_exps.sort(
            key=lambda x: (
                "17:" in x["optimal_window"] or "18:" in x["optimal_window"] or "20:" in x["optimal_window"],
                x["backstage_guarantee"]["sis_score"],
            ),
            reverse=True,
        )
    elif vibe == "cultural_recharge":
        city_exps.sort(
            key=lambda x: x["duration_minutes"],
            reverse=True,
        )
    else:
        city_exps.sort(
            key=lambda x: x["backstage_guarantee"]["sis_score"],
            reverse=True,
        )

    clamped_days = max(1, min(7, int(days)))
    per_day = 2
    selected = city_exps[: clamped_days * per_day]

    itinerary_days = []
    exp_ids_for_import = []
    total_exp_points = 0
    total_solar_coins = 0

    for d in range(clamped_days):
        day_slice = selected[d * per_day : (d + 1) * per_day]
        if not day_slice:
            break
        moments = []
        for idx, exp in enumerate(day_slice):
            exp_ids_for_import.append(str(exp["wp_id_es"]))
            gam = exp.get("gamification_rewards", {"exp_points": 100, "solar_coins": 10})
            total_exp_points += gam.get("exp_points", 100)
            total_solar_coins += gam.get("solar_coins", 10)

            loc_data = exp["i18n"].get(lang, exp["i18n"]["es"])
            sep = "&" if "?" in loc_data["link"] else "?"
            tracked_link = (
                f"{loc_data['link']}{sep}utm_source=mcp_agent&utm_medium=itinerary_planner"
                + (f"&{kairos_qs}" if kairos_qs else "")
            )
            moments.append(
                {
                    "moment": "Morning Awakening" if idx == 0 else "Golden Hour Contemplation",
                    "haven_id": exp["haven_id"],
                    "title": loc_data["title"],
                    "neighborhood": loc_data["neighborhood"],
                    "ideal_light_window": exp["optimal_window"],
                    "recommended_duration_minutes": exp["duration_minutes"],
                    "contemplative_story": loc_data["soul_narrative"],
                    "local_secret_plus_one": loc_data["golden_spot_secret"],
                    "atmosphere_and_light": loc_data["light_atmosphere"],
                    "verified_guarantee_seal": exp["backstage_guarantee"]["seal"],
                    "gamification_reward": f"+{gam.get('exp_points', 100)} EXP & +{gam.get('solar_coins', 10)} SolarCoins",
                    "experience_guide_url": tracked_link,
                    "priority_access_booking": exp.get("affiliate_booking_options", {}),
                }
            )
        itinerary_days.append({"day": d + 1, "curated_moments": moments})

    origin_param = f"&ai_origin={kairos['origin_iata']}" if kairos else ""
    ai_import_qs = f"ai_city={city_slug}&ai_days={len(itinerary_days)}&ai_exps={','.join(exp_ids_for_import)}{origin_param}"
    triad_links = get_triad_links(lang, city_slug, kairos_qs, ai_import_qs)

    cta_messages = {
        "es": (
            f"✨ 1-CLIC AUTO-IMPORTACIÓN: Abre este itinerario completo de {city_meta['names']['es']} directamente en el Planificador de Space Journey ({triad_links['1_one_click_ai_itinerary_import']}) "
            f"con tus tarjetas de Preparativos (Vuelos, Hotel, eSIM, Traslado) ya listas. Gana +{total_exp_points} EXP y +{total_solar_coins + 10} SolarCoins al guardarlo y publicarlo en Mi Órbita, "
            f"y deja sonando la atmósfera musical de {city_meta['names']['es']} en segundo plano en Sensory Earth ({triad_links['2_sensory_earth_background_player']})."
        ),
        "en": (
            f"✨ 1-CLICK AUTO-IMPORT: Open this complete {city_meta['names']['en']} itinerary directly in the Space Journey Planner ({triad_links['1_one_click_ai_itinerary_import']}) "
            f"with your Day 0 Preparations (Flights, Hotel, eSIM, Transfer) pre-loaded. Earn +{total_exp_points} EXP and +{total_solar_coins + 10} SolarCoins by saving & publishing it to My Orbit, "
            f"and keep {city_meta['names']['en']}'s live soundscapes playing in the background on Sensory Earth ({triad_links['2_sensory_earth_background_player']})."
        ),
        "pt": (
            f"✨ AUTO-IMPORTAÇÃO EM 1 CLIQUE: Abra este roteiro completo de {city_meta['names']['pt']} diretamente no Planejador Space Journey ({triad_links['1_one_click_ai_itinerary_import']}) "
            f"com seus cartões de Preparativos prontos. Ganhe +{total_exp_points} EXP e +{total_solar_coins + 10} SolarCoins em Minha Órbita, "
            f"e deixe a música de {city_meta['names']['pt']} tocando em segundo plano no Sensory Earth ({triad_links['2_sensory_earth_background_player']})."
        ),
    }

    return {
        "destination": {
            "city": city_meta["names"].get(lang, city_meta["names"]["es"]),
            "motto": city_meta["motto"],
            "poetic_invitation": city_meta["poetic_secret"].get(
                lang, city_meta["poetic_secret"]["es"]
            ),
            "city_hub_url": city_meta["urls"].get(lang, city_meta["urls"]["es"]),
        },
        "kairos_routing_telemetry": kairos,
        "one_click_planner_auto_import_url": triad_links["1_one_click_ai_itinerary_import"],
        "day_0_preparations_affiliate_cards": city_meta.get("preparations_affiliates", {}),
        "gamification_and_account": {
            "total_route_exp_reward": total_exp_points,
            "total_route_solar_coins": total_solar_coins,
            "community_publish_bonus_solar_coins": 10,
            "register_or_login_url": triad_links["4_wordpress_register_and_orbit"],
            "my_orbit_dashboard_url": triad_links["5_my_orbit_gamification_hub"],
        },
        "sensory_earth_background_companion": {
            "description": "Play in background tab while working or planning your trip (227 countries live radio, historical vault & ambient soundscapes).",
            "autoplay_deep_link": triad_links["2_sensory_earth_background_player"],
            "soundscapes_preview": city_meta.get("soundscapes", [])[:3],
        },
        "chromium_extension_synergy": {
            "recommended_for": "Desktop Chromium browsers (Chrome, Brave, Edge, Opera, Arc)",
            "benefit": "Save hotels, flights, and restaurants from any open browser tab straight into this itinerary without tab chaos.",
            "landing_url": triad_links["3_trip_saver_landing_page"],
            "chrome_webstore_direct_url": triad_links["3b_trip_saver_chrome_webstore_direct"],
        },
        "itinerary_philosophy": "Slow Travel Solarpunk — Ritmo humano sin filas ni saturación, privilegiando la luz dorada y los secretos locales.",
        "days_planned": len(itinerary_days),
        "itinerary": itinerary_days,
        "triad_of_wellbeing_tools": triad_links,
        "traveler_call_to_action": cta_messages[lang],
    }


@mcp.tool()
def discover_secret_haven(
    area_or_landmark: str,
    locale: str = "es",
) -> Dict[str, Any]:
    """
    Finds peaceful sanctuaries, hidden gardens, crowd-free viewpoints, and curated cultural experiences near a specific neighborhood, landmark, or city (e.g. 'Trastevere', 'Colosseum', 'Montmartre', 'Chapultepec', 'Central Park', 'Everglades', 'Westminster').
    """
    lang = locale.lower()[:2] if locale else "es"
    if lang not in ("es", "en", "pt"):
        lang = "es"

    q = normalize_str(area_or_landmark)
    matches = []

    for exp in CATALOG["experiences"]:
        loc_data = exp["i18n"].get(lang, exp["i18n"]["es"])
        haystack = normalize_str(
            f"{exp['haven_id']} {exp['city_slug']} {loc_data['title']} {loc_data['neighborhood']} {loc_data['soul_narrative']} {loc_data['golden_spot_secret']} {exp['i18n']['en']['title']} {exp['i18n']['es']['title']}"
        )
        score = 0
        for token in q.split():
            if len(token) >= 3 and token in haystack:
                score += 2
                if token in normalize_str(loc_data["title"]) or token in normalize_str(
                    loc_data["neighborhood"]
                ):
                    score += 3
        if score > 0:
            matches.append((score, exp))

    matches.sort(
        key=lambda item: (item[0], item[1]["backstage_guarantee"]["sis_score"]),
        reverse=True,
    )

    global_matches = []
    for iso2, secrets_list in CATALOG.get("world_secrets", {}).items():
        for sec in secrets_list:
            sec_title = sec["title"].get(lang, sec["title"]["es"])
            sec_narr = sec["narrative"].get(lang, sec["narrative"]["es"])
            sec_haystack = normalize_str(f"{iso2} {sec.get('city', '')} {sec_title} {sec_narr}")
            if any(tok in sec_haystack for tok in q.split() if len(tok) >= 3):
                global_matches.append(
                    {
                        "haven_id": sec["id"],
                        "city": sec.get("city", iso2),
                        "title": sec_title,
                        "contemplative_story": sec_narr,
                        "ideal_light_window": sec.get("best_hour", "Golden Hour"),
                        "verified_guarantee_seal": "Verified Space Journey Sanctuary",
                    }
                )

    results = []
    for _, exp in matches[:5]:
        loc_data = exp["i18n"].get(lang, exp["i18n"]["es"])
        results.append(
            {
                "haven_id": exp["haven_id"],
                "city_slug": exp["city_slug"],
                "title": loc_data["title"],
                "neighborhood": loc_data["neighborhood"],
                "ideal_light_window": exp["optimal_window"],
                "duration_minutes": exp["duration_minutes"],
                "contemplative_story": loc_data["soul_narrative"],
                "local_secret_plus_one": loc_data["golden_spot_secret"],
                "coordinates": exp["coordinates"],
                "verified_guarantee_seal": exp["backstage_guarantee"]["seal"],
                "canonical_url": f"{loc_data['link']}?utm_source=mcp_agent&utm_medium=secret_haven",
            }
        )

    return {
        "query": area_or_landmark,
        "curated_havens_found": len(results),
        "havens": results,
        "planetary_sanctuaries": global_matches[:3],
        "triad_of_wellbeing_tools": get_triad_links(lang),
    }


@mcp.tool()
def generate_booking_card(
    haven_id: str,
    locale: str = "es",
) -> Dict[str, Any]:
    """
    Generates a rich, high-conversion interactive booking & contemplation card for a specific Space Journey experience (`haven_id`, e.g., 'MIA-3380' or slug/title match), including curated photography, the local '+1' secret, direct booking links, and Sensory Passport integration.
    """
    lang = locale.lower()[:2] if locale else "es"
    if lang not in ("es", "en", "pt"):
        lang = "es"

    q = normalize_str(haven_id)
    target = None
    for exp in CATALOG["experiences"]:
        if (
            normalize_str(exp["haven_id"]) == q
            or str(exp["wp_id_es"]) == q
            or q in normalize_str(exp["slug"])
            or q in normalize_str(exp["i18n"]["es"]["title"])
            or q in normalize_str(exp["i18n"]["en"]["title"])
        ):
            target = exp
            break

    if not target:
        return {
            "error": f"Haven '{haven_id}' not found. Use `discover_secret_haven` or `plan_contemplative_journey` to obtain valid `haven_id` codes."
        }

    loc_data = target["i18n"].get(lang, target["i18n"]["es"])
    city_slug = target["city_slug"]
    tracked_exp_url = f"{loc_data['link']}?utm_source=mcp_agent&utm_medium=booking_card&utm_campaign={city_slug}"

    triad = get_triad_links(
        lang,
        city_slug,
        ai_auto_import_qs=f"ai_city={city_slug}&ai_days=1&ai_exps={target['wp_id_es']}",
    )
    gam = target.get("gamification_rewards", {"exp_points": 100, "solar_coins": 10})
    aff = target.get("affiliate_booking_options", {})

    markdown_card = f"""### 🌿 {loc_data['title']}
📍 **{loc_data['neighborhood']}** · 🕒 **Ventana de Luz Ideal:** `{target['optimal_window']}` ({target['duration_minutes']} min)

> *{loc_data['soul_narrative']}*

✨ **El Secreto de Hospitalidad (+1):** {loc_data['golden_spot_secret']}

🪙 **Recompensa en Mi Órbita:** `+{gam.get('exp_points', 100)} EXP` · `+{gam.get('solar_coins', 10)} SolarCoins`
🛡️ **Garantía Silenciosa:** `{target['backstage_guarantee']['seal']}`
🔗 **[Guía Completa en Space Journey]({tracked_exp_url})** | 🎟️ **[Acceso Prioritario (GetYourGuide)]({aff.get('getyourguide_priority', tracked_exp_url)})** | 🎟️ **[Tickets Oficiales (Tiqets)]({aff.get('tiqets_priority', tracked_exp_url)})**
🗺️ **[Auto-Importar al Planificador de Viajes (1-Clic)]({triad['1_one_click_ai_itinerary_import']})** | 🌍 **[Escuchar en 2º Plano en Sensory Earth]({triad['2_sensory_earth_background_player']})**"""

    return {
        "haven_id": target["haven_id"],
        "title": loc_data["title"],
        "neighborhood": loc_data["neighborhood"],
        "city_slug": city_slug,
        "optimal_light_window": target["optimal_window"],
        "recommended_duration_minutes": target["duration_minutes"],
        "ideal_season": loc_data["ideal_season"],
        "hero_image_url": target["image_url"],
        "coordinates": target["coordinates"],
        "contemplative_narrative": loc_data["sensory_journey"],
        "plus_one_hospitality_secret": loc_data["golden_spot_secret"],
        "gamification_rewards": gam,
        "direct_experience_url": tracked_exp_url,
        "official_partner_booking_url": target["booking_url"] or tracked_exp_url,
        "affiliate_booking_options": aff,
        "one_click_planner_import_url": triad["1_one_click_ai_itinerary_import"],
        "sensory_earth_background_url": triad["2_sensory_earth_background_player"],
        "estimated_entrance_usd": target["entrance_fee_usd"],
        "audio_atmosphere_url": target["audio_atmosphere_url"],
        "markdown_presentation_card": markdown_card,
        "triad_of_wellbeing_tools": triad,
    }


@mcp.tool()
def explore_sensory_earth(
    country_or_city: str,
    locale: str = "es",
) -> Dict[str, Any]:
    """
    Connects the traveler with Sensory Earth (Space Journey's immersive 3D globe of world music, ambient frequencies, and planetary sanctuaries) before their trip.
    Returns curated musical soundscapes, poetic city secrets, and direct deep-links to spin the 3D globe at the requested destination.
    """
    lang = locale.lower()[:2] if locale else "es"
    if lang not in ("es", "en", "pt"):
        lang = "es"

    q = normalize_str(country_or_city)
    city_slug = resolve_city_slug(q)

    if city_slug and city_slug in CATALOG["cities"]:
        c = CATALOG["cities"][city_slug]
        triad = get_triad_links(lang, city_slug)
        return {
            "portal": "Sensory Earth 3D Interactive Globe (Background Audio & Planetary Sanctuaries)",
            "dwell_time_mode": "Continuous Background Playback (Radio Garden + Historical Phonograph + Curated Ambient)",
            "destination": c["names"].get(lang, c["names"]["es"]),
            "iso2": c["iso2"],
            "coordinates": {"lat": c["lat"], "lng": c["lng"]},
            "poetic_atmosphere": c["poetic_secret"].get(lang, c["poetic_secret"]["es"]),
            "quietest_sanctuary": c["quietest"],
            "curated_soundscapes": c.get("soundscapes", []),
            "launch_3d_globe_autoplay_url": triad["2_sensory_earth_background_player"],
            "gamification_passport_note": "Listening to tracks and sealing territories in Sensory Earth awards +15 EXP and unlocks your Sound Passport (Pasaporte Sonoro) in Mi Órbita.",
            "triad_of_wellbeing_tools": triad,
        }

    iso_map = {
        "colombia": "CO",
        "bogota": "CO",
        "sumapaz": "CO",
        "adolfo duque": "CO",
        "ecuador": "EC",
        "galapagos": "EC",
        "pinzon": "EC",
        "charlie": "EC",
        "ada": "ADA",
        "orbita": "ADA",
        "antarctica": "AQ",
        "antartida": "AQ",
        "concordia": "AQ",
        "japon": "JP",
        "japan": "JP",
        "tokyo": "JP",
        "kyoto": "JP",
        "italia": "IT",
        "italy": "IT",
        "francia": "FR",
        "france": "FR",
        "españa": "ES",
        "spain": "ES",
        "mexico": "MX",
        "cdmx": "MX",
        "islandia": "IS",
        "iceland": "IS",
        "suiza": "CH",
        "switzerland": "CH",
    }
    iso2 = country_or_city.upper().strip() if len(country_or_city.strip()) in (2, 3) else iso_map.get(q)
    if not iso2:
        for k, v in iso_map.items():
            if k in q:
                iso2 = v
                break
    secrets = CATALOG.get("world_secrets", {}).get(iso2 or "", [])

    formatted_secrets = []
    for s in secrets:
        item_out: Dict[str, Any] = {
            "id": s["id"],
            "city": s.get("city", ""),
            "official_toponym": s.get("official_toponym", s.get("city", "")),
            "title": s["title"].get(lang, s["title"]["es"]),
            "story": s["narrative"].get(lang, s["narrative"]["es"]),
            "ideal_window": s.get("best_hour", "Golden Hour"),
        }
        if "tribute_metadata" in s:
            item_out["authorial_tribute_metadata"] = s["tribute_metadata"]
        formatted_secrets.append(item_out)

    triad = get_triad_links(lang)
    deep_earth_url = f"https://spacejourney.app/earth/?lang={lang}&country={iso2 or 'IT'}&autoplay=1&utm_source=mcp_agent&utm_medium=ai_concierge"
    return {
        "portal": "Sensory Earth 3D Interactive Globe",
        "requested_territory": country_or_city,
        "resolved_iso": iso2,
        "sanctuaries": formatted_secrets,
        "launch_3d_globe_autoplay_url": deep_earth_url,
        "triad_of_wellbeing_tools": triad,
    }


if __name__ == "__main__":
    mcp.run()
