import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  priceValue: number;
  image: string;
  category: string;
  cursed?: boolean;
}

const ProductCard = ({ id, title, price, priceValue, image, category, cursed = false }: ProductCardProps) => {
  return (
    <Card className="group relative overflow-hidden bg-card border-border/50 hover:border-blood-rust/50 transition-all duration-500 shadow-shift">
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={image} 
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 group-hover:filter group-hover:brightness-75"
        />
        
        {/* Fog overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-shadow-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {cursed && (
          <Badge className="absolute top-3 right-3 bg-blood-rust/90 text-bone-white border-none font-gothic text-xs animate-glow-pulse">
            CURSED
          </Badge>
        )}

        {/* Quick view on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Button 
            size="sm" 
            className="bg-antique-brass hover:bg-antique-brass/80 text-shadow-black font-gothic tracking-wide"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </div>

      <CardContent className="p-5 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-gothic">
          {category}
        </p>
        <h3 className="text-lg font-serif font-semibold text-bone-white leading-tight line-clamp-2 group-hover:text-antique-brass transition-colors">
          {title}
        </h3>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <span className="text-2xl font-gothic font-bold text-antique-brass">
          {price}
        </span>
        <AddToCartButton product={{ id, title, price, priceValue, image, category }} />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
