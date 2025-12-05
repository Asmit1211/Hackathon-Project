import { ShoppingCart } from "lucide-react";
import ProtectedAddToCart from "@/components/auth/ProtectedAddToCart";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: string;
    priceValue: number;
    image: string;
    category: string;
  };
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { addItem } = useCart();
  const handleAdd = async () => {
    try {
      addItem({
        id: product.id,
        title: product.title,
        priceLabel: product.price,
        priceValue: product.priceValue,
        image: product.image,
        category: product.category,
      });
      toast({
        title: "Bound to your cart",
        description: `"${product.title}" now follows you home.`,
      });
    } catch (err) {
      console.error("Failed to add to cart", err);
      toast({
        title: "The ritual failed",
        description: "We couldn't add this relic to your cart.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProtectedAddToCart onAdd={handleAdd}>
      <motion.button
        type="button"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 18px rgba(139,0,0,0.6)",
        }}
        whileTap={{ scale: 0.94, rotate: -2 }}
        className="border border-blood-rust/50 bg-transparent px-3 py-2 text-blood-rust hover:bg-blood-rust hover:text-bone-white font-gothic text-xs tracking-wider rounded-md shadow-shift inline-flex items-center justify-center gap-1"
      >
        <ShoppingCart className="mr-1 h-4 w-4" />
        Add to Cart
      </motion.button>
    </ProtectedAddToCart>
  );
};

export default AddToCartButton;
