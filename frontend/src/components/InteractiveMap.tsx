import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Plus, 
  Minus, 
  Navigation, 
  X,
  Users,
  TrendingUp,
  Calendar,
  Star,
  Loader2,
  Activity,
  AlertCircle
} from 'lucide-react';

// Fix for default markers in Leaflet with Vite
let DefaultIcon = L.divIcon({
  html: `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.8 12.5 28.5 12.5 28.5s12.5-19.7 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#1b4332"/>
    <circle cx="12.5" cy="12.5" r="6" fill="white"/>
  </svg>`,
  className: 'custom-div-icon',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Current location marker
let CurrentLocationIcon = L.divIcon({
  html: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" fill="#dc2626" stroke="white" stroke-width="2"/>
    <circle cx="10" cy="10" r="3" fill="white"/>
  </svg>`,
  className: 'current-location-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface CityData {
  name: string;
  logins: number;
  newUsers: number;
  returningUsers: number;
  longitude: number;
  latitude: number;
  touristPlaces: string[];
  culture: string[];
}

interface MapComponentProps {
  className?: string;
}

const InteractiveMap: React.FC<MapComponentProps> = ({ className = "" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const currentLocationMarkerRef = useRef<L.Marker | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Jharkhand cities data
  const jharkhandCityData: Record<string, CityData> = {
    "Ranchi": { 
      name: "Ranchi",
      logins: 2482, 
      newUsers: 942, 
      returningUsers: 1540, 
      longitude: 85.3096, 
      latitude: 23.3441,
      touristPlaces: [
        "Pahari Mandir - Ancient hilltop temple with panoramic city views",
        "Jagannath Temple - Sacred Hindu temple complex",
        "Kanke Dam - Scenic reservoir perfect for picnics",
        "Rock Garden - Beautiful landscaped garden with rock formations",
        "Birsa Zoological Park - Wildlife sanctuary and zoo"
      ],
      culture: [
        "Sarhul Festival - Spring festival celebrating nature (March-April)",
        "Karma Festival - Harvest festival with traditional dance (August-September)", 
        "Tusu Parab - Winter folk festival with community celebrations",
        "Local Handicrafts - Traditional metalwork and tribal art",
        "Tribal Dance Forms - Jhumair, Paika, and Chhau dance traditions"
      ]
    },
    "Jamshedpur": { 
      name: "Jamshedpur",
      logins: 1761, 
      newUsers: 668, 
      returningUsers: 1093, 
      longitude: 86.2029, 
      latitude: 22.8046,
      touristPlaces: [
        "Jubilee Park - Historic park with lakes and gardens",
        "Tata Steel Zoological Park - Modern zoo with diverse wildlife",
        "Dimna Lake - Artificial lake ideal for boating and fishing",
        "Bhuvaneshwari Temple - Ancient temple dedicated to Goddess Durga",
        "Dalma Wildlife Sanctuary - Elephant reserve and nature sanctuary"
      ],
      culture: [
        "Industrial Heritage - Legacy of Tata Steel and modern industry",
        "Poila Boishakh - Bengali New Year celebrations",
        "Durga Puja - Grand festival celebrations across the city",
        "Steel City Culture - Unique blend of industrial and traditional life",
        "Multi-cultural Festivals - Diverse community celebrations"
      ]
    },
    "Dhanbad": { 
      name: "Dhanbad",
      logins: 1235, 
      newUsers: 469, 
      returningUsers: 766, 
      longitude: 86.4302, 
      latitude: 23.7957,
      touristPlaces: [
        "Maithon Dam - One of India's first multipurpose river projects",
        "Bhatinda Falls - Natural waterfall surrounded by forests",
        "Shakti Mandir - Popular temple dedicated to Goddess Shakti",
        "Topchanchi Lake - Scenic lake with boating facilities",
        "Parasnath Hills - Sacred Jain pilgrimage site"
      ],
      culture: [
        "Coal Mining Heritage - Rich history of coal mining industry",
        "Jain Traditions - Important pilgrimage center for Jains",
        "Local Folk Music - Traditional Jharkhand folk songs",
        "Makar Sankranti - Kite flying festival celebrations",
        "Tribal Art - Indigenous art forms and craft traditions"
      ]
    },
    "Bokaro": { 
      name: "Bokaro",
      logins: 962, 
      newUsers: 365, 
      returningUsers: 597, 
      longitude: 86.1512, 
      latitude: 23.6693,
      touristPlaces: [
        "Bokaro Steel Plant - Industrial heritage site and guided tours",
        "Jawaharlal Nehru Biological Park - Zoo and botanical garden",
        "Garga Dam - Scenic dam with beautiful surroundings",
        "Parasnath Temple - Historic temple complex",
        "City Park - Well-maintained urban park for recreation"
      ],
      culture: [
        "Steel City Heritage - Modern industrial development",
        "Chhath Puja - Major festival celebrated at Garga Dam",
        "Bengali Culture - Significant Bengali community influence",
        "Modern Urban Culture - Planned city with contemporary lifestyle",
        "Educational Hub - Known for quality educational institutions"
      ]
    },
    "Hazaribagh": {
      name: "Hazaribagh",
      logins: 744, 
      newUsers: 283, 
      returningUsers: 461, 
      longitude: 85.3616, 
      latitude: 24.0023,
      touristPlaces: [
        "Hazaribagh National Park - Tiger reserve and wildlife sanctuary",
        "Canary Hill - Scenic hilltop with panoramic views",
        "Konar Dam - Beautiful reservoir with water sports",
        "Rajrappa Temple - Ancient temple at river confluence",
        "Isko - Hill station with pleasant climate"
      ],
      culture: [
        "Wildlife Conservation - Home to tigers and diverse fauna",
        "Tribal Heritage - Rich tribal culture and traditions",
        "Santhal Dance - Traditional tribal dance performances",
        "Forest Culture - Deep connection with nature and forests",
        "Local Festivals - Unique blend of tribal and Hindu festivals"
      ]
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapRef.current, {
      center: [23.6, 85.3], // Center of Jharkhand
      zoom: 7,
      zoomControl: false, // We'll add custom controls
      attributionControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Create markers layer group
    const markersLayer = L.layerGroup().addTo(map);
    markersRef.current = markersLayer;

    // Add city markers
    Object.entries(jharkhandCityData).forEach(([cityName, data]) => {
      const marker = L.marker([data.latitude, data.longitude], {
        icon: DefaultIcon
      });

      // Create popup content
      const popupContent = `
        <div class="p-3 min-w-64">
          <h3 class="font-bold text-lg text-green-700 mb-2">${cityName}</h3>
          <div class="grid grid-cols-3 gap-2 text-center mb-3">
            <div>
              <div class="text-sm font-bold text-green-600">${data.logins}</div>
              <div class="text-xs text-gray-500">Logins</div>
            </div>
            <div>
              <div class="text-sm font-bold text-blue-600">${data.newUsers}</div>
              <div class="text-xs text-gray-500">New Users</div>
            </div>
            <div>
              <div class="text-sm font-bold text-purple-600">${Math.round((data.returningUsers / data.logins) * 100)}%</div>
              <div class="text-xs text-gray-500">Return Rate</div>
            </div>
          </div>
          <button onclick="window.showCityDetails('${cityName}')" 
                  class="w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      markersLayer.addLayer(marker);
    });

    // Store map instance
    mapInstanceRef.current = map;

    // Map ready handler
    map.whenReady(() => {
      setIsLoading(false);
      setMapReady(true);
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Global function for popup button clicks
  useEffect(() => {
    (window as any).showCityDetails = (cityName: string) => {
      setSelectedCity(cityName);
      setShowInfoPanel(true);
    };

    return () => {
      delete (window as any).showCityDetails;
    };
  }, []);

  const handleCityClick = (cityName: string) => {
    setSelectedCity(cityName);
    setShowInfoPanel(true);
    
    // Focus map on selected city
    if (mapInstanceRef.current && jharkhandCityData[cityName]) {
      const cityData = jharkhandCityData[cityName];
      mapInstanceRef.current.flyTo([cityData.latitude, cityData.longitude], 10, {
        duration: 1.5
      });
    }
  };

  const updateLocationMarker = (lat: number, lng: number) => {
    setCurrentLocation({ lat, lng });
    setLocationError(null);

    if (mapInstanceRef.current) {
      // Remove existing current location marker
      if (currentLocationMarkerRef.current) {
        mapInstanceRef.current.removeLayer(currentLocationMarkerRef.current);
      }

      // Add new current location marker with live indicator
      const marker = L.marker([lat, lng], {
        icon: CurrentLocationIcon
      }).bindPopup(`
        <div class="text-center p-2">
          <strong>${isLiveTracking ? '🔴 Live Location' : 'Your Current Location'}</strong><br>
          <small>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</small>
          ${isLiveTracking ? '<br><small class="text-green-600">Tracking in real-time</small>' : ''}
        </div>
      `);

      marker.addTo(mapInstanceRef.current);
      currentLocationMarkerRef.current = marker;

      // Only fly to location if it's the first time or user isn't live tracking
      if (!isLiveTracking) {
        mapInstanceRef.current.flyTo([lat, lng], 12, {
          duration: 2
        });
      }
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationError(null);
    
    // Try with less aggressive settings first
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocationMarker(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Trying with lower accuracy...';
            // Fallback with lower accuracy
            tryLocationWithLowerAccuracy();
            return;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: false, // Less aggressive for initial try
        timeout: 15000, // Increased timeout
        maximumAge: 300000 // Accept cached location up to 5 minutes old
      }
    );
  };

  const tryLocationWithLowerAccuracy = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocationMarker(position.coords.latitude, position.coords.longitude);
        setLocationError('Location found with reduced accuracy.');
      },
      (error) => {
        setLocationError('Location access failed. Please check your browser settings.');
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 600000 // Accept even older cached locations
      }
    );
  };

  const startLiveTracking = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    if (isLiveTracking) {
      // Stop live tracking
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      setIsLiveTracking(false);
      setLocationError(null);
      return;
    }

    setLocationError(null);

    // Start live tracking with more forgiving settings
    const id = navigator.geolocation.watchPosition(
      (position) => {
        updateLocationMarker(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Error in live tracking:', error);
        
        let errorMessage = 'Live tracking error: ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access denied.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Position unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Timeout - continuing with reduced accuracy.';
            // Don't stop tracking on timeout, just continue
            return;
          default:
            errorMessage += 'Unknown error occurred.';
            break;
        }
        
        setLocationError(errorMessage);
        
        // Only stop tracking for permission or critical errors
        if (error.code === error.PERMISSION_DENIED) {
          setIsLiveTracking(false);
          if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
          }
        }
      },
      {
        enableHighAccuracy: false, // Start with lower accuracy to avoid timeouts
        timeout: 20000, // Longer timeout for live tracking
        maximumAge: 10000 // Update every 10 seconds instead of 5
      }
    );

    setWatchId(id);
    setIsLiveTracking(true);
    setLocationError(null);
  };

  // Cleanup live tracking on component unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  };

  const selectedCityData = selectedCity ? jharkhandCityData[selectedCity] : null;

  return (
    <div className={`relative h-full bg-gradient-to-br from-green-100 to-blue-100 ${className}`}>
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-50 rounded-lg">
          <div className="text-center">
            <Loader2 className="animate-spin w-8 h-8 text-green-600 mx-auto mb-4" />
            <span className="text-green-700 font-medium">Loading Jharkhand map...</span>
          </div>
        </div>
      )}

      {/* Leaflet Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden border-2 border-green-200"
        style={{ minHeight: '400px' }}
      />

      {/* Map Controls */}
      {mapReady && (
        <div className="absolute bottom-5 right-5 flex flex-col gap-2 z-[1000]">
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg border-green-200"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <Plus className="h-4 w-4 text-green-700" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg border-green-200"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <Minus className="h-4 w-4 text-green-700" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg border-green-200"
            onClick={handleLocateMe}
            title="Find My Location"
          >
            <Navigation className="h-4 w-4 text-green-700" />
          </Button>
          <Button
            size="sm"
            variant={isLiveTracking ? "default" : "outline"}
            className={`w-10 h-10 p-0 shadow-lg border-green-200 ${
              isLiveTracking 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/90 hover:bg-white'
            }`}
            onClick={startLiveTracking}
            title={isLiveTracking ? "Stop Live Tracking" : "Start Live Tracking"}
          >
            <Activity className={`h-4 w-4 ${isLiveTracking ? 'text-white animate-pulse' : 'text-green-700'}`} />
          </Button>
        </div>
      )}

      {/* Live Tracking Status */}
      {isLiveTracking && (
        <div className="absolute top-5 right-5 z-[1000]">
          <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Tracking Active</span>
          </div>
        </div>
      )}

      {/* Location Error */}
      {locationError && (
        <div className="absolute top-20 right-5 z-[1000]">
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 max-w-64">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{locationError}</span>
            <Button
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0 ml-2"
              onClick={() => setLocationError(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Info Panel */}
      {showInfoPanel && selectedCityData && (
        <div className="absolute top-5 left-5 w-80 max-h-96 overflow-y-auto z-[1000]">
          <Card className="bg-white/95 backdrop-blur shadow-xl border-green-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  {selectedCityData.name}
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0 hover:bg-red-100"
                  onClick={() => setShowInfoPanel(false)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              {currentLocation && (
                <div className="text-sm text-muted-foreground">
                  {calculateDistance(
                    currentLocation.lat, 
                    currentLocation.lng, 
                    selectedCityData.latitude, 
                    selectedCityData.longitude
                  ).toFixed(1)} km from your location
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* City Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 p-2 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{selectedCityData.logins}</div>
                  <div className="text-xs text-muted-foreground">Total Logins</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{selectedCityData.newUsers}</div>
                  <div className="text-xs text-muted-foreground">New Users</div>
                </div>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{Math.round((selectedCityData.returningUsers / selectedCityData.logins) * 100)}%</div>
                  <div className="text-xs text-muted-foreground">Return Rate</div>
                </div>
              </div>

              {/* Tourist Places */}
              <div>
                <h5 className="font-semibold text-sm mb-2 flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  Tourist Places
                </h5>
                <div className="space-y-2 text-xs max-h-32 overflow-y-auto">
                  {selectedCityData.touristPlaces.map((place, index) => (
                    <div key={index} className="p-2 bg-yellow-50 rounded border-l-3 border-yellow-400 hover:bg-yellow-100 transition-colors">
                      {place}
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Culture */}
              <div>
                <h5 className="font-semibold text-sm mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                  Local Culture
                </h5>
                <div className="space-y-2 text-xs max-h-32 overflow-y-auto">
                  {selectedCityData.culture.map((culture, index) => (
                    <div key={index} className="p-2 bg-purple-50 rounded border-l-3 border-purple-400 hover:bg-purple-100 transition-colors">
                      {culture}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
