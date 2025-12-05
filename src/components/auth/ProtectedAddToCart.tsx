import type { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";

interface ProtectedAddToCartProps {
  onAdd: () => void | Promise<void>;
  children: ReactNode;
}

const ProtectedAddToCart = ({ onAdd, children }: ProtectedAddToCartProps) => {
  const handleClick = useRequireAuth(onAdd);

  return (
    <span onClick={handleClick} className="inline-flex">
      {children}
    </span>
  );
};

export default ProtectedAddToCart;
