import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  FileText, 
  Users, 
  RefreshCw,
  ExternalLink,
  Eye,
  Lock,
  Coins
} from "lucide-react";

interface BlockchainRecord {
  id: string;
  type: 'booking' | 'payment' | 'verification';
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  txHash: string;
  amount?: number;
  service: string;
}

const BlockchainVerification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'transactions' | 'records' | 'refunds' | 'providers'>('transactions');
  
  const mockRecords: BlockchainRecord[] = [
    {
      id: '1',
      type: 'booking',
      status: 'confirmed',
      timestamp: new Date(Date.now() - 86400000),
      txHash: '0x742d35cc6cf6b486...',
      amount: 4500,
      service: 'Radisson Blu Hotel - 2 Nights'
    },
    {
      id: '2', 
      type: 'payment',
      status: 'confirmed',
      timestamp: new Date(Date.now() - 172800000),
      txHash: '0x8f3a2b1c9d4e7f2a...',
      amount: 1200,
      service: 'Local Guide Service - Ranchi Tour'
    },
    {
      id: '3',
      type: 'verification',
      status: 'pending',
      timestamp: new Date(),
      txHash: '0x1a2b3c4d5e6f7g8h...',
      service: 'Homestay Verification - Tribal Village'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "All bookings are encrypted and stored on a decentralized blockchain network.",
      color: "text-emerald-600"
    },
    {
      icon: FileText,
      title: "Transparent Records", 
      description: "View complete transaction history and verification status at any time.",
      color: "text-blue-600"
    },
    {
      icon: RefreshCw,
      title: "Guaranteed Refunds",
      description: "Smart contracts ensure automatic refunds if services aren't delivered as promised.",
      color: "text-orange-600"
    },
    {
      icon: Users,
      title: "Verified Service Providers",
      description: "All guides, hotels, and services are verified through our blockchain system.",
      color: "text-purple-600"
    }
  ];

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-emerald-200 hover:bg-emerald-50"
      >
        <Shield className="w-4 h-4 mr-2" />
        Blockchain Verification
      </Button>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-600 bg-emerald-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <RefreshCw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Blockchain Verification System</h1>
            <p className="text-muted-foreground">Secure, transparent, and tamper-proof booking verification</p>
          </div>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-background rounded-lg border">
          <div className="border-b">
            <div className="flex">
              {[
                { key: 'transactions', label: 'Secure Transactions', icon: Lock },
                { key: 'records', label: 'Transparent Records', icon: Eye },
                { key: 'refunds', label: 'Guaranteed Refunds', icon: RefreshCw },
                { key: 'providers', label: 'Verified Providers', icon: Users }
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? "secondary" : "ghost"}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  onClick={() => setActiveTab(tab.key as any)}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'transactions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Recent Transactions</h3>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                    <Shield className="w-3 h-3 mr-1" />
                    256-bit Encryption
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {mockRecords.map((record) => (
                    <Card key={record.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Badge className={getStatusColor(record.status)}>
                              {getStatusIcon(record.status)}
                              <span className="ml-1 capitalize">{record.status}</span>
                            </Badge>
                            <div>
                              <p className="font-medium text-foreground">{record.service}</p>
                              <p className="text-sm text-muted-foreground">
                                {record.timestamp.toLocaleDateString()} - {record.type}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {record.amount && (
                              <p className="font-semibold text-foreground">₹{record.amount.toLocaleString()}</p>
                            )}
                            <Button variant="ghost" size="sm" className="text-xs">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View on Chain
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Transaction Hash:</span>
                            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                              {record.txHash}
                            </code>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'records' && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">Transaction History & Verification</h3>
                <div className="bg-muted/30 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Complete Audit Trail</h4>
                      <p className="text-sm text-muted-foreground">Every transaction is recorded immutably</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Transactions</span>
                      <Badge variant="secondary">{mockRecords.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Confirmed</span>
                      <Badge className="bg-emerald-50 text-emerald-700">
                        {mockRecords.filter(r => r.status === 'confirmed').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Verification Score</span>
                      <div className="flex items-center gap-2">
                        <Progress value={95} className="w-20" />
                        <span className="text-sm font-medium">95%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'refunds' && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">Smart Contract Refunds</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-primary" />
                        Refund Protection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Our smart contracts automatically process refunds if services aren't delivered as promised.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Coverage</span>
                          <Badge>100%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Processing Time</span>
                          <Badge variant="secondary">2-4 hours</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Refunds</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">
                        No refund claims in the last 30 days. All services delivered successfully!
                      </p>
                      <Badge className="bg-emerald-50 text-emerald-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        100% Service Reliability
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'providers' && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">Verified Service Providers</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: 'Radisson Blu Hotel', type: 'Accommodation', verified: true, rating: 4.8 },
                    { name: 'Tribal Heritage Homestay', type: 'Homestay', verified: true, rating: 4.9 },
                    { name: 'Jharkhand Adventure Tours', type: 'Tour Guide', verified: true, rating: 4.7 },
                    { name: 'Local Cultural Center', type: 'Experience', verified: true, rating: 4.6 },
                    { name: 'Traditional Handicrafts Co.', type: 'Shopping', verified: true, rating: 4.5 },
                    { name: 'Nature Valley Transport', type: 'Transport', verified: false, rating: 4.3 }
                  ].map((provider, index) => (
                    <Card key={index} className={provider.verified ? 'border-emerald-200' : 'border-amber-200'}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground text-sm">{provider.name}</h4>
                          <Badge className={provider.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>
                            {provider.verified ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{provider.type}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">⭐ {provider.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            {provider.verified ? 'Blockchain Verified' : 'Verification Pending'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainVerification;