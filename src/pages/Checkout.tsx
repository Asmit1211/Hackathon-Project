import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { loadRazorpayScript } from "@/lib/razorpay";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [address, setAddress] = useState("");

  const taxes = useMemo(() => subtotal * 0.08, [subtotal]);
  const grandTotal = useMemo(() => subtotal + taxes, [subtotal, taxes]);

  const handleRazorpayCheckout = async () => {
    if (!items.length) {
      toast({
        title: "Cart is empty",
        description: "Add a relic before you proceed to checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!contact.name || !contact.email) {
      toast({
        title: "Missing traveler details",
        description: "Please enter your name and email before continuing.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      toast({
        title: "Razorpay key missing",
        description: "Set VITE_RAZORPAY_KEY_ID in your .env file to enable the payment modal.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      // Load Razorpay script
      await loadRazorpayScript();

      // Create Razorpay order
      const requestBody = {
          amount: grandTotal,
          currency: "INR",
          customer: {
            email: contact.email || user?.email,
            name: contact.name || user?.displayName || undefined,
            phone: contact.phone || undefined,
            firebaseUid: user?.uid || undefined,
          },
          items: items.map((item) => ({
            productId: item.id,
            title: item.title,
            category: item.category,
            image: item.image,
            quantity: item.quantity,
            price: item.priceValue,
            subtotal: item.quantity * item.priceValue,
          })),
          notes: {
            customerName: contact.name || "",
            customerEmail: contact.email || user?.email || "",
            customerPhone: contact.phone || "",
            address: address || "",
          },
        };

      console.log("Sending Razorpay order request:", requestBody);

      const response = await fetch(`${API_BASE_URL}/payments/razorpay/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const payload = await response.json();

      if (!response.ok) {
        const errorMessage = payload?.message || "Failed to create Razorpay order";
        console.error("Razorpay order creation failed:", payload);
        throw new Error(errorMessage);
      }

      const { order, keyId } = payload.data || {};

      if (!order || !order.id) {
        console.error("Invalid order response:", payload);
        throw new Error("Invalid order response from server");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh and try again.");
      }

      const checkout = new window.Razorpay({
        key: keyId || RAZORPAY_KEY_ID,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: "Cursed Relics",
        description: "Haunted artifact purchase",
        prefill: {
          name: contact.name || user?.displayName || "",
          email: contact.email || user?.email || "",
          contact: contact.phone,
        },
        notes: {
          address,
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/payments/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyPayload = await verifyRes.json();

            if (!verifyRes.ok) {
              console.error("Payment verification failed:", verifyPayload);
              throw new Error(verifyPayload?.message || "Payment verification failed");
            }

            toast({
              title: "Offer accepted",
              description: "Your payment succeeded. The relics are on their way.",
            });
            clearCart();
            navigate("/");
          } catch (err) {
            console.error("Payment verification error:", err);
            toast({
              title: "Payment verification failed",
              description: err instanceof Error ? err.message : "Unknown error verifying payment.",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: () => {
            toast({
              title: "Payment cancelled",
              description: "No worries—your cart is still intact.",
            });
            setProcessing(false);
          },
        },
      });

      checkout.open();
    } catch (err) {
      console.error("Razorpay checkout error:", err);
      toast({
        title: "Unable to start payment",
        description: err instanceof Error ? err.message : "Unknown error occurred.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-28 pb-20 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <header>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-gothic">
              ritual details
            </p>
            <h1 className="text-4xl font-gothic text-bone-white">Checkout</h1>
            <p className="text-muted-foreground font-serif">
              Enter how we should address you. Shipping details summon our courier ravens.
            </p>
          </header>

          <div className="space-y-4 border border-border/50 rounded-xl p-6 bg-card/40 backdrop-blur-sm">
            <h2 className="text-lg font-gothic text-bone-white">Contact</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Full name"
                value={contact.name}
                onChange={(event) => setContact({ ...contact, name: event.currentTarget.value })}
                required
              />
              <Input
                placeholder="Email address (e.g., user@example.com)"
                type="email"
                value={contact.email}
                onChange={(event) => setContact({ ...contact, email: event.currentTarget.value })}
                required
              />
              <Input
                placeholder="Phone (optional)"
                value={contact.phone}
                onChange={(event) => setContact({ ...contact, phone: event.currentTarget.value })}
              />
            </div>
          </div>

          <div className="space-y-4 border border-border/50 rounded-xl p-6 bg-card/40 backdrop-blur-sm">
            <h2 className="text-lg font-gothic text-bone-white">Delivery instructions</h2>
            <Textarea
              placeholder="Add safe-word for couriers, special rituals, or coordinates."
              value={address}
              onChange={(event) => setAddress(event.currentTarget.value)}
              rows={4}
            />
          </div>

          <div className="space-y-4 border border-border/50 rounded-xl p-6 bg-card/40 backdrop-blur-sm">
            <h2 className="text-lg font-gothic text-bone-white">Order items</h2>
            <div className="space-y-3">
              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Your cart is empty.{" "}
                  <Link to="/" className="text-blood-rust underline">
                    Summon items first.
                  </Link>
                </p>
              )}
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-serif text-bone-white">{item.title}</p>
                    <p className="text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <span className="font-gothic">{item.priceLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4 border border-border/50 rounded-2xl p-6 h-fit bg-card/70">
          <h2 className="text-xl font-gothic text-bone-white">Payment summary</h2>
          <div className="space-y-2 text-sm font-serif text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (8%)</span>
              <span>₹{taxes.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <Separator className="bg-border/40" />
            <div className="flex justify-between text-base font-gothic text-bone-white">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <Button size="lg" className="w-full font-gothic tracking-wide" onClick={handleRazorpayCheckout} disabled={processing}>
            {processing ? "Summoning Razorpay..." : "Pay with Razorpay"}
          </Button>
          <p className="text-xs text-muted-foreground font-serif">
            Razorpay modal will open using the publishable key from <code>VITE_RAZORPAY_KEY_ID</code>.
            Backend order creation requires an authenticated session on <code>{API_BASE_URL}</code>.
          </p>
        </aside>
      </main>
    </div>
  );
};

export default Checkout;

