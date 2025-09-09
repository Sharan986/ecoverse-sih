import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ExploreHighlights from "@/components/ExploreHighlights";
import TrendingFestivals from "@/components/TrendingFestivals";
import JharkhandMarketplace from "@/components/JharkhandMarketplace";
import QuickActions from "@/components/QuickActions";
import ChatBot from "@/components/ChatBot";
import VirtualTour from "@/components/VirtualTour";
import BlockchainVerification from "@/components/BlockchainVerification";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ExploreHighlights />
      <TrendingFestivals />
      <JharkhandMarketplace />
      <QuickActions />
      
      {/* Interactive Components */}
      <ChatBot />
    </div>
  );
};

export default Index;