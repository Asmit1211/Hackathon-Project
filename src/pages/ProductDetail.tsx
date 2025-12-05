import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import AddToCartButton from "@/components/AddToCartButton";
import { toast } from "@/hooks/use-toast";
import type { FormEvent } from "react";

interface Review {
  name: string;
  rating: number; // 1-5
  comment: string;
}

interface ProductDetailData {
  id: string;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  image: string;
  category: string;
}

const PRODUCTS: ProductDetailData[] = [
  {
    id: "victorian-mourning-doll",
    title: "Victorian Mourning Doll",
    description:
      "An antique doll once placed in the windows of a funeral home. Its glass eyes are known to follow anyone who dares to move it.",
    price: "$899",
    priceValue: 899,
    image: "/cursed-doll-1.jpg",
    category: "Cursed Dolls",
  },
  {
    id: "porcelain-shadow-child",
    title: "Porcelain Shadow Child",
    description:
      "Faint childlike footsteps and whispers have been reported around this doll, even when locked away in airtight cases.",
    price: "$1,299",
    priceValue: 1299,
    image: "/cursed-doll-2.jpg",
    category: "Cursed Dolls",
  },
  {
    id: "antique-marionette",
    title: "Antique Marionette",
    description:
      "Strings that tangle themselves at night and a crooked grin that seems to widen every time you look away.",
    price: "$749",
    priceValue: 749,
    image: "/cursed-doll-3.jpg",
    category: "Cursed Dolls",
  },
  {
    id: "haunted-bisque-doll",
    title: "Haunted Bisque Doll",
    description:
      "Recovered from a burned estate. The doll was the only object untouched by the flames.",
    price: "$1,099",
    priceValue: 1099,
    image: "/cursed-doll-4.jpg",
    category: "Cursed Dolls",
  },
  {
    id: "blood-ruby-amulet",
    title: "Blood Ruby Amulet",
    description:
      "A deep crimson stone that seems to pulse faintly with a heartbeat not your own.",
    price: "$599",
    priceValue: 599,
    image: "/charm-1.jpg",
    category: "Haunted Charms",
  },
  {
    id: "occult-protection-talisman",
    title: "Occult Protection Talisman",
    description:
      "Worn by an anonymous cult leader who vanished without a trace. Said to ward off lesser spirits but attract greater ones.",
    price: "$449",
    priceValue: 449,
    image: "/charm-2.jpg",
    category: "Haunted Charms",
  },
  {
    id: "witchs-bone-pendant",
    title: "Witch's Bone Pendant",
    description:
      "Fashioned from an unknown bone and wrapped in tarnished silver wire. It hums softly during eclipses.",
    price: "$799",
    priceValue: 799,
    image: "/charm-3.jpg",
    category: "Haunted Charms",
  },
  {
    id: "ancient-rune-stone",
    title: "Ancient Rune Stone",
    description:
      "Etched runes that cannot be translated by any modern scholar. The stone is always cold to the touch.",
    price: "$349",
    priceValue: 349,
    image: "/charm-4.jpg",
    category: "Haunted Charms",
  },
  {
    id: "crimson-heart-diamond",
    title: "Crimson Heart Diamond",
    description:
      "A gemstone rumored to have formed in the heart of a battlefield. It glows faintly when someone nearby lies.",
    price: "$2,499",
    priceValue: 2499,
    image: "/stone-1.jpg",
    category: "Blood Diamonds",
  },
  {
    id: "obsidian-soul-shard",
    title: "Obsidian Soul Shard",
    description:
      "Shards of volcanic glass said to contain the final scream of those who fell into the lava below.",
    price: "$1,899",
    priceValue: 1899,
    image: "/stone-2.jpg",
    category: "Blood Diamonds",
  },
  {
    id: "onyx-death-stone",
    title: "Onyx Death Stone",
    description:
      "Jet-black and lightless, the stone has been known to stop clocks and wilt flowers in its presence.",
    price: "$1,599",
    priceValue: 1599,
    image: "/stone-3.jpg",
    category: "Blood Diamonds",
  },
  {
    id: "garnet-blood-crystal",
    title: "Garnet Blood Crystal",
    description:
      "Legends say it must never be worn to bed. Those who do report waking up somewhere else entirely.",
    price: "$2,199",
    priceValue: 2199,
    image: "/stone-4.jpg",
    category: "Blood Diamonds",
  },
  {
    id: "portrait-of-the-damned",
    title: "Portrait of the Damned",
    description:
      "The painted figure's eyes seem to change direction depending on who stands before it.",
    price: "$3,499",
    priceValue: 3499,
    image: "/artifact-1.jpg",
    category: "Haunted Artifacts",
  },
  {
    id: "cursed-music-box",
    title: "Cursed Music Box",
    description:
      "Plays on its own at 3:03 AM. The melody has no known origin and often lingers in the listener's dreams.",
    price: "$1,299",
    priceValue: 1299,
    image: "/artifact-2.jpg",
    category: "Haunted Artifacts",
  },
  {
    id: "victorian-ouija-board",
    title: "Victorian Ouija Board",
    description:
      "The planchette has a habit of moving even when no hands are on it.",
    price: "$999",
    priceValue: 999,
    image: "/artifact-3.jpg",
    category: "Haunted Artifacts",
  },
  {
    id: "antique-death-mask",
    title: "Antique Death Mask",
    description:
      "Cast from an unidentified corpse. Visitors report seeing different expressions each time they look.",
    price: "$1,799",
    priceValue: 1799,
    image: "/artifact-4.jpg",
    category: "Haunted Artifacts",
  },
];

const PRODUCT_REVIEWS: Record<string, Review[]> = {
  "victorian-mourning-doll": [
    {
      name: "Elena Blackwood",
      rating: 5,
      comment:
        "She arrived with ash on her dress and dust in her hair. The nursery door no longer stays closed at night.",
    },
    {
      name: "Jonas Nightwind",
      rating: 4,
      comment:
        "Rocking chair moves on its own now. The doll prefers the window facing east.",
    },
  ],
  "porcelain-shadow-child": [
    {
      name: "Priya Malhotra",
      rating: 5,
      comment:
        "Light footsteps in the hallway at 2:14 AM every night since it arrived. No physical damage. Yet.",
    },
    {
      name: "Marcus Holloway",
      rating: 4,
      comment:
        "The doll shows up in the background of my photos, even when I leave it in another room.",
    },
  ],
  "antique-marionette": [
    {
      name: "Amelia Graves",
      rating: 5,
      comment:
        "Strings changed position overnight. My husband swears he heard stage curtains open in the attic.",
    },
  ],
  "haunted-bisque-doll": [
    {
      name: "Elena Blackwood",
      rating: 5,
      comment:
        "Only object untouched after a small kitchen fire. Smells faintly of smoke when it thinks I'm not looking.",
    },
  ],
  "blood-ruby-amulet": [
    {
      name: "Jonas Nightwind",
      rating: 4,
      comment:
        "The stone pulses when someone lies. Dinner parties have become very interesting.",
    },
  ],
};

const FALLBACK_REVIEWS: Review[] = [
  {
    name: "Elena Blackwood",
    rating: 5,
    comment:
      "The artifact arrived wrapped in velvet and whispers. I haven't slept properly since, but I regret nothing.",
  },
  {
    name: "Marcus Holloway",
    rating: 4,
    comment:
      "Beautiful craftsmanship with an unnerving presence. The lights flicker every time I pass it.",
  },
  {
    name: "Priya Malhotra",
    rating: 5,
    comment:
      "The energy in my apartment changed the night it arrived. Plants thrive, mirrors do not.",
  },
  {
    name: "Jonas Nightwind",
    rating: 4,
    comment:
      "Package arrived on time, though the courier refused to touch the box directly.",
  },
  {
    name: "Amelia Graves",
    rating: 5,
    comment:
      "I heard quiet humming from the crate before I even opened it. Perfect.",
  },
];

function getProductById(id: string | undefined): ProductDetailData | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

function getStars(rating: number) {
  const fullStars = Math.round(rating);
  return "".padStart(fullStars, "★").padEnd(5, "☆");
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-gothic text-bone-white">
              This relic could not be found.
            </h1>
            <p className="text-muted-foreground font-serif">
              Perhaps it has slipped back into the shadows. Try returning to the main collection.
            </p>
            <Button asChild size="lg" className="font-gothic tracking-wide">
              <Link to="/">Back to Products</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const reviews: Review[] = PRODUCT_REVIEWS[product.id] ?? FALLBACK_REVIEWS;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const handleFeedbackSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast({
      title: "Thank you for your feedback.",
      description: "Your experience has been noted by our unseen archivists.",
    });

    event.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="font-gothic tracking-wide">
            <Link to="/">← Back to Products</Link>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:items-start">
          {/* Image */}
          <div className="w-full lg:w-5/12">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-shift bg-card">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-shadow-black/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Details */}
          <div className="w-full lg:w-7/12 space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-gothic">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-gothic text-bone-white leading-tight">
                {product.title}
              </h1>
            </div>

            <p className="font-serif text-sm md:text-base text-muted-foreground max-w-2xl">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="text-3xl font-gothic text-antique-brass">{product.price}</div>
              <div className="flex items-center gap-2 text-sm font-serif">
                <span className="text-lg">{getStars(averageRating)}</span>
                <span className="text-muted-foreground">
                  {averageRating.toFixed(1)} / 5.0 • {reviews.length} reviews
                </span>
              </div>
            </div>

            <div>
              <AddToCartButton
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  priceValue: product.priceValue,
                  image: product.image,
                  category: product.category,
                }}
              />
            </div>

            {/* Reviews */}
            <section className="mt-6 border-t border-border/60 pt-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-gothic text-bone-white tracking-wide">
                  Voices from Previous Keepers
                </h2>
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div
                      key={`${review.name}-${index}`}
                      className="rounded-xl border border-border/50 bg-card/60 p-4 flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-serif text-sm text-bone-white">
                          {review.name}
                        </p>
                        <p className="text-sm text-antique-brass">
                          {getStars(review.rating)}
                        </p>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground font-serif">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simple feedback form (client-side only) */}
              <div className="border border-border/60 rounded-xl bg-card/40 p-4 space-y-3">
                <h3 className="text-lg font-gothic text-bone-white">
                  Share your own encounter
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground font-serif">
                  Leave a note about your experience with this relic. Your words will not
                  be stored anywherethis ritual is only for appearances.
                </p>
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <textarea
                    name="feedback"
                    required
                    rows={3}
                    placeholder="Describe what happens when the lights go out..."
                    className="w-full rounded-md border border-border/60 bg-background/60 px-3 py-2 text-sm font-serif text-bone-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blood-rust/70"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="font-gothic tracking-wide">
                      Submit Feedback
                    </Button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
