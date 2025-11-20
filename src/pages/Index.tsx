import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";

const Index = () => {
  const cursedDolls = [
    {
      title: "Victorian Mourning Doll",
      price: "$899",
      image: "/cursed-doll-1.jpg",
      category: "Cursed Dolls",
      cursed: true,
    },
    {
      title: "Porcelain Shadow Child",
      price: "$1,299",
      image: "/cursed-doll-2.jpg",
      category: "Cursed Dolls",
      cursed: true,
    },
    {
      title: "Antique Marionette",
      price: "$749",
      image: "/cursed-doll-3.jpg",
      category: "Cursed Dolls",
      cursed: true,
    },
    {
      title: "Haunted Bisque Doll",
      price: "$1,099",
      image: "/cursed-doll-4.jpg",
      category: "Cursed Dolls",
      cursed: true,
    },
  ];

  const hauntedCharms = [
    {
      title: "Blood Ruby Amulet",
      price: "$599",
      image: "/charm-1.jpg",
      category: "Haunted Charms",
      cursed: true,
    },
    {
      title: "Occult Protection Talisman",
      price: "$449",
      image: "/charm-2.jpg",
      category: "Haunted Charms",
    },
    {
      title: "Witch's Bone Pendant",
      price: "$799",
      image: "/charm-3.jpg",
      category: "Haunted Charms",
      cursed: true,
    },
    {
      title: "Ancient Rune Stone",
      price: "$349",
      image: "/charm-4.jpg",
      category: "Haunted Charms",
    },
  ];

  const bloodDiamonds = [
    {
      title: "Crimson Heart Diamond",
      price: "$2,499",
      image: "/stone-1.jpg",
      category: "Blood Diamonds",
      cursed: true,
    },
    {
      title: "Obsidian Soul Shard",
      price: "$1,899",
      image: "/stone-2.jpg",
      category: "Blood Diamonds",
      cursed: true,
    },
    {
      title: "Onyx Death Stone",
      price: "$1,599",
      image: "/stone-3.jpg",
      category: "Blood Diamonds",
    },
    {
      title: "Garnet Blood Crystal",
      price: "$2,199",
      image: "/stone-4.jpg",
      category: "Blood Diamonds",
      cursed: true,
    },
  ];

  const hauntedArtifacts = [
    {
      title: "Portrait of the Damned",
      price: "$3,499",
      image: "/artifact-1.jpg",
      category: "Haunted Artifacts",
      cursed: true,
    },
    {
      title: "Cursed Music Box",
      price: "$1,299",
      image: "/artifact-2.jpg",
      category: "Haunted Artifacts",
      cursed: true,
    },
    {
      title: "Victorian Ouija Board",
      price: "$999",
      image: "/artifact-3.jpg",
      category: "Haunted Artifacts",
    },
    {
      title: "Antique Death Mask",
      price: "$1,799",
      image: "/artifact-4.jpg",
      category: "Haunted Artifacts",
      cursed: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      
      <CategorySection
        id="dolls"
        title="CURSED DOLLS"
        subtitle="Each doll carries the whispers of its former owners"
        products={cursedDolls}
      />

      <CategorySection
        id="charms"
        title="HAUNTED CHARMS"
        subtitle="Talismans of power, protection, and dark fortune"
        products={hauntedCharms}
      />

      <CategorySection
        id="stones"
        title="BLOOD DIAMONDS"
        subtitle="Gemstones stained with centuries of dark history"
        products={bloodDiamonds}
      />

      <CategorySection
        id="artifacts"
        title="HAUNTED ARTIFACTS"
        subtitle="Relics from the shadows of forgotten times"
        products={hauntedArtifacts}
      />

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 mt-20">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="text-sm text-muted-foreground font-serif">
            © 2024 Cursed Relics. All artifacts authenticated and documented.
          </p>
          <p className="text-xs text-muted-foreground/60 italic font-serif">
            We do not accept responsibility for paranormal experiences following purchase.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
