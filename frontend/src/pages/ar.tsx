import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Camera, RotateCcw, ZoomIn, ZoomOut, Maximize2, Navigation, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Import images properly
import aerial1 from '@/assets/aerial-drone-view-chisinau-downtown-panorama-view-multiple-buildings-roads[1].jpg';
import jharkhandImage from '@/assets/IMG-20250908-WA0012[1].jpg';
import jharkhandHero from '@/assets/jharkhand-hero.jpg';

interface Photo360 {
  id: string;
  title: string;
  description: string;
  location: string;
  url: string;
  thumbnail?: string;
}

const Photo360Viewer = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Jharkhand tourism 360-degree photos with working URLs
  const photos: Photo360[] = [
    {
      id: '1',
      title: 'Chisinau Downtown Aerial View',
      description: 'Panoramic aerial view of downtown area showcasing urban development',
      location: 'City Center',
      url: aerial1,
    },
    {
      id: '2',
      title: 'Jharkhand Cultural Heritage',
      description: 'Traditional architecture and cultural landmarks',
      location: 'Heritage Site, Jharkhand',
      url: jharkhandImage,
    },
    {
      id: '3',
      title: 'Jharkhand Landscape',
      description: 'Beautiful natural landscape of Jharkhand',
      location: 'Jharkhand, India',
      url: jharkhandHero,
    },
    {
      id: '4',
      title: 'Forest Canopy View',
      description: 'Immersive forest experience with 360° view',
      location: 'Betla National Park',
      url: 'https://threejs.org/examples/textures/equirectangular/forest_slope_1k.jpg',
    },
    {
      id: '5',
      title: 'Sunset Hills',
      description: 'Panoramic sunset view from Netarhat hills',
      location: 'Netarhat, Jharkhand',
      url: 'https://threejs.org/examples/textures/equirectangular/pedestrian_overpass_1k.jpg',
    },
    {
      id: '6',
      title: 'Quarry Landscape',
      description: 'Industrial heritage and mining landscape',
      location: 'Mining Area, Jharkhand',
      url: 'https://threejs.org/examples/textures/equirectangular/quarry_01_1k.jpg',
    }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create sphere geometry for 360 photo
    const geometry = new THREE.SphereGeometry(500, 32, 16);
    // Flip the geometry inside out
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    sphereRef.current = sphere;

    // Load initial texture
    loadTexture(photos[currentPhoto].url);

    // Mouse controls
    const onMouseDown = (event: MouseEvent) => {
      mouseRef.current.isDown = true;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      if (renderer.domElement) {
        renderer.domElement.style.cursor = 'grabbing';
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!mouseRef.current.isDown) return;

      const deltaX = event.clientX - mouseRef.current.x;
      const deltaY = event.clientY - mouseRef.current.y;

      camera.rotation.y += deltaX * 0.005;
      camera.rotation.x += deltaY * 0.005;

      // Limit vertical rotation
      camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));

      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const onMouseUp = () => {
      mouseRef.current.isDown = false;
      if (renderer.domElement) {
        renderer.domElement.style.cursor = 'grab';
      }
    };

    // Touch controls for mobile
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        mouseRef.current.isDown = true;
        mouseRef.current.x = event.touches[0].clientX;
        mouseRef.current.y = event.touches[0].clientY;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!mouseRef.current.isDown || event.touches.length !== 1) return;
      event.preventDefault();

      const deltaX = event.touches[0].clientX - mouseRef.current.x;
      const deltaY = event.touches[0].clientY - mouseRef.current.y;

      camera.rotation.y += deltaX * 0.005;
      camera.rotation.x += deltaY * 0.005;

      camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));

      mouseRef.current.x = event.touches[0].clientX;
      mouseRef.current.y = event.touches[0].clientY;
    };

    const onTouchEnd = () => {
      mouseRef.current.isDown = false;
    };

    // Wheel zoom
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.fov += event.deltaY * 0.05;
      camera.fov = Math.max(10, Math.min(100, camera.fov));
      camera.updateProjectionMatrix();
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    if (renderer.domElement) {
      renderer.domElement.style.cursor = 'grab';
    }

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const loadTexture = (url: string, isRetry: boolean = false) => {
    if (!sphereRef.current) return;
    
    setIsLoading(true);
    if (!isRetry) setError(null);
    
    const loader = new THREE.TextureLoader();
    
    // Handle cross-origin for external URLs
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      url,
      (texture) => {
        try {
          if (sphereRef.current && sphereRef.current.material instanceof THREE.MeshBasicMaterial) {
            // Dispose of previous texture to prevent memory leaks
            if (sphereRef.current.material.map) {
              sphereRef.current.material.map.dispose();
            }
            
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            
            sphereRef.current.material.map = texture;
            sphereRef.current.material.needsUpdate = true;
          }
          setIsLoading(false);
          console.log('✅ Texture loaded successfully:', url);
        } catch (err) {
          console.error('❌ Error applying texture:', err);
          setError('Failed to apply the 360° photo. Please try again.');
          setIsLoading(false);
        }
      },
      (progress) => {
        // Loading progress
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`📸 Loading texture: ${percent.toFixed(1)}%`);
      },
      (error) => {
        console.error('❌ Error loading texture:', error);
        console.error('📍 Failed URL:', url);
        
        // Try fallback to a working local image if this is not already a retry
        if (!isRetry && url !== jharkhandHero) {
          console.log('🔄 Trying fallback image...');
          loadTexture(jharkhandHero, true);
          return;
        }
        
        // Provide more specific error messages
        let errorMessage = 'Failed to load 360° photo.';
        if (url.includes('threejs.org')) {
          errorMessage = 'External image temporarily unavailable. Using local fallback.';
        } else if (url.startsWith('/')) {
          errorMessage = 'Local image not found. Please check image path.';
        } else {
          errorMessage = 'Image loading failed. Please check your internet connection.';
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    );
  };

  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.rotation.set(0, 0, 0);
      cameraRef.current.fov = 75;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.fov = Math.max(10, cameraRef.current.fov - 10);
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.fov = Math.min(100, cameraRef.current.fov + 10);
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const switchPhoto = (index: number) => {
    setCurrentPhoto(index);
    loadTexture(photos[index].url);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mountRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Camera className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">360° Virtual Tours</h1>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Explore Jharkhand's breathtaking destinations in immersive 360° panoramas. 
            Drag to look around, scroll to zoom, and discover the natural beauty of our state.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Photo Selector Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Destinations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    onClick={() => switchPhoto(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentPhoto === index
                        ? 'bg-green-100 border-2 border-green-500 shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentPhoto === index ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{photo.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {photo.location}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{photo.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Viewer */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {photos[currentPhoto].title}
                    </CardTitle>
                    <p className="text-green-100 text-sm mt-1">
                      {photos[currentPhoto].description} • {photos[currentPhoto].location}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {currentPhoto + 1} of {photos.length}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Viewer Container */}
                <div className="relative">
                  <div 
                    ref={mountRef} 
                    className="w-full h-[600px] bg-black relative overflow-hidden"
                  >
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
                        <div className="text-white flex flex-col items-center gap-3">
                          <div className="animate-spin w-8 h-8 border-3 border-white border-t-transparent rounded-full"></div>
                          <div className="text-lg">Loading 360° View...</div>
                          <div className="text-sm text-gray-300">Please wait while we prepare your virtual tour</div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
                        <div className="text-white flex flex-col items-center gap-3 text-center max-w-md">
                          <div className="text-red-400 text-lg">⚠️ Loading Error</div>
                          <div className="text-lg">{error}</div>
                          <Button 
                            onClick={() => loadTexture(photos[currentPhoto].url)}
                            variant="outline"
                            className="mt-2"
                          >
                            Try Again
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controls Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      onClick={resetView}
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70 text-white border-0"
                      title="Reset View"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={zoomIn}
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70 text-white border-0"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={zoomOut}
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70 text-white border-0"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={toggleFullscreen}
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70 text-white border-0"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Instructions */}
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <span>🖱️ Drag to look around</span>
                      <span>🔍 Scroll to zoom</span>
                      <span>📱 Touch & drag on mobile</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Usage Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Explore</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Navigation className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">Navigate</h3>
                <p className="text-gray-600">Click and drag to look around in any direction. Experience full 360° views of Jharkhand's landscapes.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ZoomIn className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Zoom</h3>
                <p className="text-gray-600">Use scroll wheel or zoom buttons to get closer to details. Perfect for examining wildlife and landscapes.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Explore</h3>
                <p className="text-gray-600">Select different destinations from the sidebar to virtually visit multiple locations across Jharkhand.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Photo360Viewer;