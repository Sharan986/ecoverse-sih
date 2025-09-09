import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Download, 
  RefreshCw,
  ChartLine,
  Globe,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface CityData {
  name: string;
  logins: number;
  newUsers: number;
  returningUsers: number;
  returnRate: number;
  color: string;
}

interface WeeklyData {
  day: string;
  total: number;
  newUsers: number;
  returnRate: number;
}

interface AnalyticsData {
  totalLogins: number;
  activeUsers: number;
  newUserRatio: number;
  cities: CityData[];
  weeklyData: WeeklyData[];
}

const TourismAnalyticsDashboard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Sample data based on the HTML dashboard
  const analyticsData: AnalyticsData = {
    totalLogins: 12437,
    activeUsers: 847,
    newUserRatio: 68,
    cities: [
      { name: 'Ranchi', logins: 2482, newUsers: 942, returningUsers: 1540, returnRate: 62, color: '#1b4332' },
      { name: 'Jamshedpur', logins: 1761, newUsers: 668, returningUsers: 1093, returnRate: 62, color: '#2d6a4f' },
      { name: 'Dhanbad', logins: 1235, newUsers: 469, returningUsers: 766, returnRate: 62, color: '#40916c' },
      { name: 'Bokaro', logins: 962, newUsers: 365, returningUsers: 597, returnRate: 62, color: '#52b788' },
      { name: 'Hazaribagh', logins: 744, newUsers: 283, returningUsers: 461, returnRate: 62, color: '#74c69d' },
      { name: 'Deoghar', logins: 612, newUsers: 232, returningUsers: 380, returnRate: 62, color: '#95d5b2' },
      { name: 'Giridih', logins: 487, newUsers: 185, returningUsers: 302, returnRate: 62, color: '#b7e4c7' },
      { name: 'Dumka', logins: 423, newUsers: 161, returningUsers: 262, returnRate: 62, color: '#d8f3dc' }
    ],
    weeklyData: [
      { day: 'Mon', total: 1842, newUsers: 698, returnRate: 62 },
      { day: 'Tue', total: 1756, newUsers: 666, returnRate: 62 },
      { day: 'Wed', total: 1923, newUsers: 729, returnRate: 62 },
      { day: 'Thu', total: 1689, newUsers: 641, returnRate: 62 },
      { day: 'Fri', total: 2145, newUsers: 814, returnRate: 62 },
      { day: 'Sat', total: 2387, newUsers: 905, returnRate: 62 },
      { day: 'Sun', total: 2198, newUsers: 834, returnRate: 62 }
    ]
  };

  const pieData = [
    { name: 'New Users', value: 32, fill: '#40916c' },
    { name: 'Returning Users', value: 68, fill: '#1b4332' }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdateTime(new Date());
    }, 1500);
  };

  const handleExport = () => {
    alert('Downloading analytics data...');
    // Add actual export functionality here
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <ChartLine className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Tourism Analytics Dashboard</h1>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                <Globe className="h-4 w-4 mr-2" />
                Back to Map
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalLogins.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +18% from last month
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Last updated: {formatTime(lastUpdateTime)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.activeUsers}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                +12% from yesterday
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-green-800 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: '73%' }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Ratio</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  New Users
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-green-800 rounded-full mr-1"></div>
                  Returning
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* City Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                City-wise Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {analyticsData.cities.map((city) => (
                  <div key={city.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: city.color }}
                      ></div>
                      <span className="font-medium">{city.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{city.logins.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {city.returnRate}% return rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Weekly Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Total Logins</div>
                  <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.weeklyData}>
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          stroke="#1b4332" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">New Users</div>
                  <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.weeklyData}>
                        <Line 
                          type="monotone" 
                          dataKey="newUsers" 
                          stroke="#40916c" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Return Rate</div>
                  <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.weeklyData}>
                        <Line 
                          type="monotone" 
                          dataKey="returnRate" 
                          stroke="#2d6a4f" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Week of Sept 2 - Sept 8, 2025
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Detailed Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-semibold">City</th>
                    <th className="text-left p-4 font-semibold">Total Logins</th>
                    <th className="text-left p-4 font-semibold">New Users</th>
                    <th className="text-left p-4 font-semibold">Returning Users</th>
                    <th className="text-left p-4 font-semibold">Return Rate</th>
                    <th className="text-left p-4 font-semibold">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.cities.map((city, index) => (
                    <tr key={city.name} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: city.color }}
                          ></div>
                          <span className="font-medium">{city.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">{city.logins.toLocaleString()}</td>
                      <td className="p-4">{city.newUsers.toLocaleString()}</td>
                      <td className="p-4">{city.returningUsers.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {city.returnRate}%
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-green-600">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          +{12 + index}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Tourism Analytics Dashboard &copy; 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default TourismAnalyticsDashboard;
