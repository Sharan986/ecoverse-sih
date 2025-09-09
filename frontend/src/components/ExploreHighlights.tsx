import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const highlights = {
  naturalWonders: [
    {
      id: 1,
      title: "Hundru Falls",
      description: "Explore the majestic waterfalls, dense forests, and scenic landscapes that make Jharkhand a paradise for nature lovers.",
      image: "https://captureatrip-cms-storage.s3.ap-south-1.amazonaws.com/Rejuvenating_Bath_at_the_Natural_Pool_in_Hundru_Waterfall_1985307590.webp"
    },
    {
      id: 2,
      title: "Betla National Park",
      description: "Wildlife sanctuary home to tigers, elephants, and diverse flora and fauna.",
      image: "https://currentaffairs.adda247.com/wp-content/uploads/multisite/sites/5/2025/07/23111157/In-Which-State-is-Betla-National-Park-Located.png"
    },
    {
      id: 3,
      title: "Netarhat Hill Station",
      description: "The Queen of Chotanagpur with breathtaking sunrise and sunset views.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeCaGTG2ZSOeHdvImoORI7Durqqso3CFJ-q7YhUw4HFdBAo-KRIN0VH2eRkDUdmqxGzzA&usqp=CAU"
    },
    {
      id: 4,
      title: "Dassam Falls",
      description: "Spectacular 144-feet high waterfall perfect for photography and picnics.",
      image: "data:image/jpeg;base64,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"
    }
  ],
  culturalHeritage: [
    {
      id: 5,
      title: "Jagannath Temple",
      description: "Immerse yourself in the rich tribal culture, ancient temples, and historical monuments that showcase Jharkhand's diverse heritage.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfS1wNjoxkd4TQLMrpI45c0oBJOlrNDhYWBg&s"
    },
    {
      id: 6,
      title: "Tribal Museums",
      description: "Discover the rich heritage and traditions of indigenous communities.",
      image: "https://cloud-1de12d.b-cdn.net/media/iW=5000&iH=any/77c159b894aa6efe3b3000d84bc06352/27-Kisan.jpg"
    },
    {
      id: 7,
      title: "Sun Temple",
      description: "Ancient architectural marvel dedicated to the Sun God.",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/16/92/b7/konarak-sun-temple.jpg?w=900&h=500&s=1"
    },
    {
      id: 8,
      title: "Rock Paintings",
      description: "Prehistoric cave paintings depicting tribal life and culture.",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhopXE84WcPIvw227OK82Do2R1hrRxDIy1hsrZjtuGhBrtRSF-Ofq3pr6Liv604c7kXR-svGL9AG1RxJdunNGNW8N73MBVXkgq5ISZrNISTSp3hsYGr7vNNJUCch98H9ZEoY5uCugLmjOx-9IlQ4R-x3yqs7lrLcwuMMI-XY5gTqNy5hHBQ9w0Mc-5jIw/w1200-h630-p-k-no-nu/Untitled.jpg"
    }
  ]
};

const ExploreHighlights = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Explore Highlights
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the most breathtaking attractions and experiences that Jharkhand has to offer
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Natural Wonders */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-foreground flex items-center">
              Natural Wonders
              <div className="w-12 h-1 bg-gradient-primary ml-4 rounded-full"></div>
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {highlights.naturalWonders.map((item) => (
                <Card key={item.id} className="group cursor-pointer hover:shadow-strong transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-sm mb-2 text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="group">
              Discover More
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Cultural Heritage */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-foreground flex items-center">
              Cultural Heritage
              <div className="w-12 h-1 bg-gradient-primary ml-4 rounded-full"></div>
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {highlights.culturalHeritage.map((item) => (
                <Card key={item.id} className="group cursor-pointer hover:shadow-strong transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-sm mb-2 text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="group">
              Discover More
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreHighlights;