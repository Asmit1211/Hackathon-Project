import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const Cart = () => {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-32 pb-24 space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-gothic">
            your binding contract
          </p>
          <h1 className="text-4xl md:text-5xl font-gothic text-bone-white">Cart of Relics</h1>
          <p className="text-muted-foreground font-serif">
            Each item is bound to your aura. Remove wisely.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-border/60 rounded-xl p-12 text-center space-y-4">
            <p className="text-lg font-serif text-muted-foreground">
              Your cart is empty. The relics await your touch.
            </p>
            <Button asChild variant="outline" className="font-gothic tracking-wide">
              <Link to="/">Return to the Curiosity Shop</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-32 w-32 rounded-lg object-cover border border-border/50"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase text-muted-foreground tracking-widest font-gothic">
                          {item.category}
                        </p>
                        <h3 className="text-xl font-serif text-bone-white">{item.title}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-blood-rust transition-colors"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="font-gothic text-2xl text-antique-brass">{item.priceLabel}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center border border-border/60 rounded-md">
                        <button
                          type="button"
                          className={cn(
                            "p-2 text-sm text-muted-foreground hover:text-bone-white transition-colors",
                            item.quantity <= 1 && "opacity-50 pointer-events-none",
                          )}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(item.id, Number(event.currentTarget.value) || 1)
                          }
                          className="w-16 border-0 text-center bg-transparent font-gothic"
                        />
                        <button
                          type="button"
                          className="p-2 text-sm text-muted-foreground hover:text-bone-white transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-sm text-muted-foreground font-serif">
                        Subtotal:{" "}
                        <strong className="text-bone-white">
                          {formatCurrency(item.quantity * item.priceValue)}
                        </strong>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
              <Button
                variant="ghost"
                className="text-sm text-muted-foreground hover:text-blood-rust w-fit"
                onClick={clearCart}
              >
                Clear entire cart
              </Button>
            </section>

            <aside className="p-6 border border-border/50 rounded-2xl bg-card/70 space-y-4">
              <h2 className="text-2xl font-gothic text-bone-white">Order Summary</h2>
              <Separator className="bg-border/40" />
              <div className="space-y-2 font-serif text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-bone-white">Calculated at ritual</span>
                </div>
              </div>
              <Separator className="bg-border/40" />
              <div className="flex justify-between items-center text-xl font-gothic text-bone-white">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <Button asChild size="lg" className="w-full font-gothic tracking-wide">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <p className="text-xs text-muted-foreground/80 font-serif text-center">
                By proceeding you acknowledge responsibility for any paranormal disturbances.
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;

