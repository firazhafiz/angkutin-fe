"use client";

import React, { useRef, useEffect, useState } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";

// Mapbox GL JS types
let mapboxgl: any = null;

/** Haversine distance between two lat/lng points in meters */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface MapboxMarker {
  id: string;
  lat: number;
  lng: number;
  type: "user" | "courier" | "destination" | "pickup";
  label?: string;
  isOnline?: boolean;
}

interface MapboxViewProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  markers?: MapboxMarker[];
  className?: string;
  interactive?: boolean;
  showRoute?: boolean;
  routeFrom?: [number, number];
  routeTo?: [number, number];
  onRouteUpdate?: (info: { duration: number; distance: number }) => void;
  /** Enable animated courier movement along route polyline */
  animateCourier?: boolean;
  /** Speed of animation: ms per coordinate step (lower = faster). Default 800 */
  animationSpeed?: number;
  /** Callback when courier reaches near destination (~500m) */
  onCourierArrived?: () => void;
}

export default function MapboxView({
  center = [112.7521, -7.2575], // Default: Surabaya
  zoom = 14,
  markers = [],
  className = "w-full h-64",
  interactive = true,
  showRoute = false,
  routeFrom,
  routeTo,
  onRouteUpdate,
  animateCourier = false,
  animationSpeed = 800,
  onCourierArrived,
}: MapboxViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeCoordinatesRef = useRef<[number, number][]>([]);
  const animationIndexRef = useRef(0);
  const animationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const arrivedFiredRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Check for valid token
    if (!token || token.startsWith("pk.placeholder")) {
      setError(true);
      return;
    }

    const initMap = async () => {
      try {
        const mb = await import("mapbox-gl");
        await import("mapbox-gl/dist/mapbox-gl.css");
        mapboxgl = mb.default;
        mapboxgl.accessToken = token;

        const validCenter = center && !isNaN(center[0]) && !isNaN(center[1]) 
          ? center 
          : [112.7521, -7.2575];

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/streets-v12",
          center: validCenter as [number, number],
          zoom,
          interactive,
          attributionControl: false,
        });

        map.current.on("load", () => setLoaded(true));
      } catch (err) {
        console.error("Mapbox init failed:", err);
        setError(true);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [token]);

  // Update center
  useEffect(() => {
    if (!map.current || !loaded) return;
    const validCenter = center && !isNaN(center[0]) && !isNaN(center[1]) 
      ? center 
      : [112.7521, -7.2575];
    map.current.flyTo({ center: validCenter as [number, number], zoom, duration: 1000 });
  }, [center[0], center[1], zoom, loaded]);

  // Update markers
  useEffect(() => {
    if (!map.current || !loaded || !mapboxgl) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    markers.forEach((m) => {
      if (isNaN(m.lat) || isNaN(m.lng)) return;

      const el = document.createElement("div");
      el.className = "mapbox-custom-marker";

      if (m.type === "courier") {
        el.innerHTML = `
          <div style="
            width: 36px; height: 36px; border-radius: 50%;
            background: ${m.isOnline !== false ? '#016a70' : '#9ca3af'};
            display: flex; align-items: center; justify-content: center;
            border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
          </div>
          ${m.label ? `<div style="
            font-size: 9px; font-weight: 800; color: #1a1a2e;
            background: white; padding: 2px 6px; border-radius: 99px;
            margin-top: 4px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.15);
            white-space: nowrap;
          ">${m.label}</div>` : ''}
        `;
      } else if (m.type === "user" || m.type === "pickup") {
        el.innerHTML = `
          <div style="
            width: 40px; height: 40px; border-radius: 50%;
            background: #059669;
            display: flex; align-items: center; justify-content: center;
            border: 3px solid white; box-shadow: 0 2px 10px rgba(5,150,105,0.4);
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3" fill="#059669" stroke="#059669"/>
            </svg>
          </div>
          ${m.label ? `<div style="
            font-size: 9px; font-weight: 800; color: #1a1a2e;
            background: white; padding: 2px 6px; border-radius: 99px;
            margin-top: 4px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.15);
            white-space: nowrap;
          ">${m.label}</div>` : ''}
        `;
      } else {
        el.innerHTML = `
          <div style="
            width: 36px; height: 36px; border-radius: 50%;
            background: #ef4444;
            display: flex; align-items: center; justify-content: center;
            border: 3px solid white; box-shadow: 0 2px 8px rgba(239,68,68,0.4);
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            </svg>
          </div>
        `;
      }

      el.style.display = "flex";
      el.style.flexDirection = "column";
      el.style.alignItems = "center";
      el.style.cursor = "pointer";

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([m.lng, m.lat])
        .addTo(map.current);

      // Tag courier markers for animation lookup
      (marker as any)._courierType = m.type;

      markersRef.current.push(marker);
    });
  }, [markers, loaded]);

  // Draw route polyline
  useEffect(() => {
    if (!map.current || !loaded || !mapboxgl) return;

    const sourceId = "route-source";
    const layerId = "route-layer";

    // Clean up existing route
    if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
    if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);

    if (!showRoute) return;

    let from = routeFrom;
    let to = routeTo;

    // Fallback to markers if routeFrom/to not provided explicitly
    if ((!from || !to) && markers.length >= 2) {
      const courierMarker = markers.find(m => m.type === "courier") || markers[0];
      const destMarker = markers.find(m => m.type !== "courier") || markers[1];
      
      if (!isNaN(courierMarker.lng) && !isNaN(courierMarker.lat) && !isNaN(destMarker.lng) && !isNaN(destMarker.lat)) {
        from = [courierMarker.lng, courierMarker.lat];
        to = [destMarker.lng, destMarker.lat];
      }
    }

    if (from && to && !isNaN(from[0]) && !isNaN(from[1]) && !isNaN(to[0]) && !isNaN(to[1])) {
      const fetchRoute = async () => {
        try {
          const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${from![0]},${from![1]};${to![0]},${to![1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
          );
          const json = await query.json();
          const data = json.routes[0];
          const route = data.geometry.coordinates;

          // Store route coordinates for animation
          routeCoordinatesRef.current = route;
          animationIndexRef.current = 0;
          arrivedFiredRef.current = false;

          // Notify parent of route info (duration in seconds, distance in meters)
          if (onRouteUpdate) {
            onRouteUpdate({
              duration: data.duration,
              distance: data.distance
            });
          }

          if (!map.current) return;
          
          if (map.current.getSource(sourceId)) {
             (map.current.getSource(sourceId) as any).setData({
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: route,
                },
             });
          } else {
            map.current.addSource(sourceId, {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: route,
                },
              },
            });

            map.current.addLayer({
              id: layerId,
              type: "line",
              source: sourceId,
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#016a70",
                "line-width": 4,
                "line-dasharray": [2, 2],
                "line-opacity": 0.6,
              },
            });
          }
        } catch (err) {
          console.error("Failed to fetch route:", err);
        }
      };

      fetchRoute();
    }
  }, [showRoute, routeFrom, routeTo, markers, loaded]);

  // Animated courier movement along polyline
  useEffect(() => {
    if (!animateCourier || !loaded || !mapboxgl || routeCoordinatesRef.current.length < 2) {
      return;
    }

    // Clear any previous animation
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }

    const coords = routeCoordinatesRef.current;
    // Start from beginning if not started
    if (animationIndexRef.current >= coords.length) {
      animationIndexRef.current = 0;
    }

    animationTimerRef.current = setInterval(() => {
      const idx = animationIndexRef.current;
      if (idx >= coords.length) {
        if (animationTimerRef.current) clearInterval(animationTimerRef.current);
        return;
      }

      const [lng, lat] = coords[idx];

      // Find courier marker and move it
      const courierMarkerObj = markersRef.current.find((m: any) => m._courierType === "courier");
      if (courierMarkerObj) {
        courierMarkerObj.setLngLat([lng, lat]);
      }

      // Check distance to destination (last coordinate)
      const dest = coords[coords.length - 1];
      const distMeters = haversineDistance(lat, lng, dest[1], dest[0]);
      if (distMeters < 500 && !arrivedFiredRef.current) {
        arrivedFiredRef.current = true;
        onCourierArrived?.();
      }

      animationIndexRef.current = idx + 1;
    }, animationSpeed);

    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [animateCourier, loaded, animationSpeed, onCourierArrived, routeCoordinatesRef.current.length]);

  // Fallback UI when token is placeholder/missing
  if (error || !token || token.startsWith("pk.placeholder")) {
    return (
      <div className={`relative bg-gray-100 overflow-hidden ${className}`}>
        {/* Fallback grid map */}
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapgrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#e5e7eb" />
              <line x1="20" y1="0" x2="20" y2="40" stroke="#d1d5db" strokeWidth="1" />
              <line x1="0" y1="20" x2="40" y2="20" stroke="#d1d5db" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid)" />
        </svg>

        {/* Render markers as absolute positioned pins */}
        {markers.slice(0, 6).map((m, i) => (
          <div
            key={m.id}
            className="absolute z-10 flex flex-col items-center"
            style={{
              top: `${20 + (i * 12) % 60}%`,
              left: `${15 + (i * 17) % 70}%`,
            }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
              m.type === "courier"
                ? m.isOnline !== false ? "bg-primary" : "bg-gray-400"
                : m.type === "user" ? "bg-secondary" : "bg-red-500"
            }`}>
              {m.type === "courier" ? (
                <Navigation size={14} className="text-white" />
              ) : (
                <MapPin size={14} className="text-white" />
              )}
            </div>
            {m.label && (
              <span className="text-[8px] font-black bg-white px-1.5 py-0.5 rounded-full shadow-sm mt-1 text-dark whitespace-nowrap">
                {m.label}
              </span>
            )}
          </div>
        ))}

        <div className="absolute bottom-2 left-2 right-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
          <p className="text-[9px] font-bold text-gray-400">
            Mapbox token belum dikonfigurasi • Fallback view
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .mapboxgl-ctrl-logo { display: none !important; }
        .mapboxgl-ctrl-attrib { display: none !important; }
      `}} />
      <div ref={mapContainer} className="w-full h-full" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 size={24} className="text-primary animate-spin" />
        </div>
      )}
    </div>
  );
}
