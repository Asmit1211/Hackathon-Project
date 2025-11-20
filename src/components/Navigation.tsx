import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skull, ShoppingCart, Menu, X } from "lucide-react";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Cursed Dolls", href: "#dolls" },
    { label: "Haunted Charms", href: "#charms" },
    { label: "Blood Diamonds", href: "#stones" },
    { label: "Artifacts", href: "#artifacts" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Skull className="w-8 h-8 text-blood-rust animate-glow-pulse" strokeWidth={1.5} />
            <span className="font-gothic text-xl font-bold text-bone-white tracking-wider">
              CURSED RELICS
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-serif text-muted-foreground hover:text-antique-brass transition-colors tracking-wide"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-antique-brass hover:text-antique-brass/80"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-blood-rust text-bone-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-gothic">
                0
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-bone-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/50 space-y-3 animate-flicker">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-2 text-sm font-serif text-muted-foreground hover:text-antique-brass transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
