import { Button } from "@/components/ui/button";
import { Skull, ShoppingBag } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url('/hero-haunted-shop.jpg')",
          filter: "sepia(30%) brightness(0.7)"
        }}
      />
      
      {/* Animated fog overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fog-gray/20 to-background animate-fog-drift" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-fog-gray/10 to-transparent animate-fog-drift" style={{ animationDelay: "5s" }} />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-flicker">
          {/* Occult symbol */}
          <div className="flex justify-center mb-6">
            <Skull className="w-16 h-16 text-blood-rust animate-glow-pulse" strokeWidth={1.5} />
          </div>

          <h1 className="font-gothic text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-bone-white">
            CURSED RELICS
          </h1>
          
          <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-blood-rust to-transparent" />
          
          <p className="text-xl md:text-2xl font-serif text-muted-foreground italic tracking-wide">
            Occult Antiques & Haunted Artifacts
          </p>

          <p className="text-base md:text-lg max-w-2xl mx-auto text-foreground/80 font-serif leading-relaxed">
            Discover our curated collection of supernatural objects, cursed dolls, 
            haunted charms, and ancient artifacts. Each piece carries its own dark history.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="bg-blood-rust hover:bg-blood-rust/80 text-bone-white font-gothic tracking-wider px-8 py-6 text-lg shadow-shift"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Collection
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-antique-brass text-antique-brass hover:bg-antique-brass/10 font-gothic tracking-wider px-8 py-6 text-lg"
            >
              Featured Artifacts
            </Button>
          </div>

          {/* Warning text */}
          <p className="text-xs text-muted-foreground/60 italic pt-4 font-serif">
            ⚠ All items sold with full disclosure of their supernatural histories
          </p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
