export interface Attraction {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  duration: string;
  location: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

export interface ItineraryDay {
  day: number;
  attractions: Attraction[];
  total: number;
}

export const generateSampleItinerary = (days: number, budget: number, themes: string[]): ItineraryDay[] => {
  const allAttractions: Attraction[] = [
    // Nature attractions
    {
      id: 1,
      title: "Hundru Falls",
      description: "Start your day with the majestic 98-meter Hundru Falls, one of Jharkhand's most spectacular waterfalls.",
      price: 500,
      image: "/api/placeholder/300/200",
      duration: "2-3 hours",
      location: "Ranchi",
      timeOfDay: "morning"
    },
    {
      id: 2,
      title: "Jonha Falls",
      description: "Experience the beauty of Jonha Falls, also known as Gautamdhara, surrounded by dense forests.",
      price: 300,
      image: "/api/placeholder/300/200",
      duration: "2 hours",
      location: "Ranchi",
      timeOfDay: "afternoon"
    },
    {
      id: 3,
      title: "Ranchi Lake",
      description: "Enjoy a peaceful evening by the artificial Ranchi Lake with boating and local street food options.",
      price: 350,
      image: "/api/placeholder/300/200",
      duration: "2-3 hours",
      location: "Ranchi",
      timeOfDay: "evening"
    },
    // Culture attractions
    {
      id: 4,
      title: "Tribal Research Institute",
      description: "Explore the rich tribal heritage of Jharkhand at this museum showcasing artifacts, art and cultural exhibits.",
      price: 200,
      image: "/api/placeholder/300/200",
      duration: "1-2 hours",
      location: "Ranchi",
      timeOfDay: "afternoon"
    },
    {
      id: 5,
      title: "Tribal Cultural Center",
      description: "Immerse yourself in authentic tribal dance performances and traditional craft demonstrations.",
      price: 400,
      image: "/api/placeholder/300/200",
      duration: "2 hours",
      location: "Ranchi",
      timeOfDay: "evening"
    },
    // Religion attractions
    {
      id: 6,
      title: "Jagannath Temple",
      description: "Visit the sacred Jagannath Temple, an important pilgrimage site with beautiful architecture.",
      price: 100,
      image: "/api/placeholder/300/200",
      duration: "1 hour",
      location: "Ranchi",
      timeOfDay: "morning"
    },
    {
      id: 7,
      title: "Pahari Mandir",
      description: "Climb the hill temple dedicated to Lord Shiva, offering panoramic views of Ranchi city.",
      price: 150,
      image: "/api/placeholder/300/200",
      duration: "1-2 hours",
      location: "Ranchi",
      timeOfDay: "morning"
    },
    // Adventure attractions
    {
      id: 8,
      title: "Rock Garden Adventure",
      description: "Navigate through natural rock formations and enjoy adventure activities like rock climbing.",
      price: 600,
      image: "/api/placeholder/300/200",
      duration: "3-4 hours",
      location: "Ranchi",
      timeOfDay: "morning"
    },
    {
      id: 9,
      title: "Birsa Zoological Park",
      description: "Explore wildlife in their natural habitat and enjoy nature walks through the park.",
      price: 250,
      image: "/api/placeholder/300/200",
      duration: "2-3 hours",
      location: "Ranchi",
      timeOfDay: "afternoon"
    },
    // Shopping attractions
    {
      id: 10,
      title: "Firayalal Market",
      description: "Shop for traditional handicrafts, tribal jewelry, and local textiles in this bustling market.",
      price: 800,
      image: "/api/placeholder/300/200",
      duration: "2 hours",
      location: "Ranchi",
      timeOfDay: "afternoon"
    },
    {
      id: 11,
      title: "Main Road Shopping",
      description: "Browse through modern shopping complexes and local boutiques for souvenirs and gifts.",
      price: 1000,
      image: "/api/placeholder/300/200",
      duration: "2-3 hours",
      location: "Ranchi",
      timeOfDay: "evening"
    },
    // Additional attractions for longer trips
    {
      id: 12,
      title: "Dassam Falls",
      description: "Visit the stunning 144-feet high Dassam Falls, perfect for photography and nature lovers.",
      price: 400,
      image: "/api/placeholder/300/200",
      duration: "2-3 hours",
      location: "Taimara",
      timeOfDay: "morning"
    },
    {
      id: 13,
      title: "Betla National Park",
      description: "Experience wildlife safari and spot tigers, elephants, and deer in their natural habitat.",
      price: 1200,
      image: "/api/placeholder/300/200",
      duration: "4-5 hours",
      location: "Latehar",
      timeOfDay: "morning"
    },
    {
      id: 14,
      title: "Netarhat Hill Station",
      description: "Enjoy the 'Queen of Chotanagpur' with its scenic beauty and pleasant climate.",
      price: 800,
      image: "/api/placeholder/300/200",
      duration: "Full day",
      location: "Netarhat",
      timeOfDay: "morning"
    }
  ];

  // Filter attractions based on themes
  const themeMap: Record<string, string[]> = {
    "Nature": ["Hundru Falls", "Jonha Falls", "Ranchi Lake", "Dassam Falls", "Betla National Park", "Netarhat Hill Station"],
    "Adventure": ["Rock Garden Adventure", "Birsa Zoological Park", "Betla National Park", "Netarhat Hill Station"],
    "Culture": ["Tribal Research Institute", "Tribal Cultural Center"],
    "Religion": ["Jagannath Temple", "Pahari Mandir"],
    "Shopping": ["Firayalal Market", "Main Road Shopping"]
  };

  let availableAttractions = allAttractions;
  if (themes.length > 0) {
    const themeAttractionNames = themes.flatMap(theme => themeMap[theme] || []);
    availableAttractions = allAttractions.filter(attraction => 
      themeAttractionNames.includes(attraction.title)
    );
  }

  // Generate itinerary
  const itinerary: ItineraryDay[] = [];
  const budgetPerDay = Math.floor(budget / days);
  
  for (let day = 1; day <= days; day++) {
    const dayAttractions: Attraction[] = [];
    let dayTotal = 0;
    
    // Try to add one attraction for each time period
    const timeSlots: Array<'morning' | 'afternoon' | 'evening'> = ['morning', 'afternoon', 'evening'];
    
    for (const timeSlot of timeSlots) {
      const timeAttractions = availableAttractions.filter(a => 
        a.timeOfDay === timeSlot && 
        !dayAttractions.some(da => da.id === a.id) &&
        dayTotal + a.price <= budgetPerDay
      );
      
      if (timeAttractions.length > 0) {
        const randomAttraction = timeAttractions[Math.floor(Math.random() * timeAttractions.length)];
        dayAttractions.push(randomAttraction);
        dayTotal += randomAttraction.price;
      }
    }
    
    itinerary.push({
      day,
      attractions: dayAttractions,
      total: dayTotal
    });
  }
  
  return itinerary;
};