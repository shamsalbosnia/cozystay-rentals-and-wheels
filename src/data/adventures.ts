export interface Adventure {
  id: string;
  title: string;
  description: string;
  duration: string;
  price?: number;
  image?: string;
  city: string;
}

export const adventuresByCity = {
  Sarajevo: [
    {
      id: "sarajevo-1",
      title: "Sarajevo War Tunnel Tour",
      description: "Visit the historic tunnel that saved Sarajevo during the siege",
      duration: "3 hours",
      price: 25,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Sarajevo"
    },
    {
      id: "sarajevo-2", 
      title: "Baščaršija Walking Tour",
      description: "Explore the old bazaar and learn about Ottoman history",
      duration: "2 hours",
      price: 20,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Sarajevo"
    },
    {
      id: "sarajevo-3",
      title: "Mount Trebević Cable Car",
      description: "Scenic cable car ride with panoramic views of Sarajevo",
      duration: "2 hours",
      price: 15,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Sarajevo"
    }
  ],
  Mostar: [
    {
      id: "mostar-1",
      title: "Old Bridge Diving Experience",
      description: "Watch traditional divers jump from the iconic Old Bridge",
      duration: "1 hour",
      price: 10,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Mostar"
    },
    {
      id: "mostar-2",
      title: "Blagaj Tekke Monastery Tour",
      description: "Visit the mystical monastery built into a cliff",
      duration: "4 hours",
      price: 35,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Mostar"
    },
    {
      id: "mostar-3",
      title: "Kravice Waterfalls Tour",
      description: "Swimming and relaxation at beautiful natural waterfalls",
      duration: "5 hours", 
      price: 40,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Mostar"
    }
  ],
  Bihac: [
    {
      id: "bihac-1",
      title: "Una River Rafting",
      description: "Thrilling white water rafting on the pristine Una River",
      duration: "6 hours",
      price: 50,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Bihac"
    },
    {
      id: "bihac-2",
      title: "Štrbački Buk Waterfall Hike",
      description: "Hike to one of Bosnia's most beautiful waterfalls",
      duration: "4 hours",
      price: 30,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Bihac"
    },
    {
      id: "bihac-3",
      title: "Ostrožac Castle Tour",
      description: "Explore the medieval castle overlooking the Una River",
      duration: "2 hours",
      price: 15,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Bihac"
    }
  ],
  Travnik: [
    {
      id: "travnik-1",
      title: "Travnik Fortress Tour",
      description: "Visit the medieval fortress and enjoy panoramic views",
      duration: "2 hours",
      price: 20,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Travnik"
    },
    {
      id: "travnik-2",
      title: "Plava Voda Spring Visit",
      description: "Discover the source of crystal clear blue water",
      duration: "3 hours",
      price: 25,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Travnik"
    }
  ],
  Jajce: [
    {
      id: "jajce-1",
      title: "Jajce Waterfall & Old Town",
      description: "Explore the historic town and its magnificent waterfall",
      duration: "3 hours",
      price: 25,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Jajce"
    },
    {
      id: "jajce-2",
      title: "Pliva Lakes Kayaking",
      description: "Peaceful kayaking on the beautiful Pliva Lakes",
      duration: "4 hours",
      price: 35,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Jajce"
    },
    {
      id: "jajce-3",
      title: "Bear Cave (Medvjed Cave) Tour",
      description: "Underground adventure in one of Bosnia's most famous caves",
      duration: "2 hours",
      price: 20,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Jajce"
    }
  ],
  Konjic: [
    {
      id: "konjic-1",
      title: "Tito's Nuclear Bunker Tour",
      description: "Secret underground bunker from the Yugoslav era",
      duration: "3 hours",
      price: 30,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Konjic"
    },
    {
      id: "konjic-2",
      title: "Neretva River Rafting",
      description: "Exciting rafting adventure on the emerald Neretva River",
      duration: "5 hours",
      price: 45,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Konjic"
    },
    {
      id: "konjic-3",
      title: "Old Stone Bridge Tour",
      description: "Historical tour of the famous Ottoman bridge",
      duration: "1 hour",
      price: 10,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000",
      city: "Konjic"
    }
  ]
};

export const allAdventures = Object.values(adventuresByCity).flat();