import React from 'react';
import InteractiveMap from '../components/InteractiveMap';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MapPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🗺️</div>
              <h1 className="text-2xl font-bold">Jharkhand Interactive Map</h1>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[calc(100vh-140px)] p-4">
        <InteractiveMap className="w-full h-full" />
      </div>

      {/* Instructions */}
      <div className="bg-white border-t px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-muted-foreground">
            Click on city markers to view detailed information about tourist places and local culture. 
            Use the navigation button to find your current location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
