import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingBag, Home } from "lucide-react";

const marketplaceItems = [
  {
    id: 1,
    type: "handicrafts",
    title: "Traditional Handicrafts",
    description: "Explore authentic local products and unique stay experiences",
    image: "https://cdn.shopify.com/s/files/1/1194/1498/files/b9_bfe93869-fcdf-4306-a1f4-ed3bfad82e93_480x480.jpg?v=1713962843",
    rating: 4.8,
    price: "₹500 onwards",
    items: ["Bamboo Crafts", "Tribal Jewelry", "Handwoven Textiles", "Dokra Art"]
  },
  {
    id: 2,
    type: "homestays",
    title: "Authentic Homestays",
    description: "Experience local hospitality in traditional homes across Jharkhand",
    image: "https://cf.bstatic.com/xdata/images/hotel/max500/650972676.jpg?k=20ed7987ff3d95147a650bad381510ad642663f3a3fef408e0d75bddd93abd34&o=&hp=1",
    rating: 4.6,
    price: "₹1,200 / night",
    items: ["Village Experience", "Traditional Meals", "Cultural Programs", "Nature Walks"]
  }
];

const JharkhandMarketplace = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Jharkhand Marketplace
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover authentic local products and unique stay experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {marketplaceItems.map((item) => (
            <Card key={item.id} className="group cursor-pointer hover:shadow-strong transition-all duration-300 overflow-hidden">
              <div className="relative h-64">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Icon */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {item.type === "handicrafts" ? (
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  ) : (
                    <Home className="w-6 h-6 text-primary" />
                  )}
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>

                {/* Title and Price */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-white/80 text-sm mb-2">{item.description}</p>
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {item.price}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {item.items.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-gradient-primary hover:bg-primary-hover group-hover:shadow-lg transition-all">
                  {item.type === "handicrafts" ? "Shop Now" : "Book Stay"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JharkhandMarketplace;