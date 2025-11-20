import ProductCard from "./ProductCard";

interface CategorySectionProps {
  id: string;
  title: string;
  subtitle: string;
  products: Array<{
    title: string;
    price: string;
    image: string;
    category: string;
    cursed?: boolean;
  }>;
}

const CategorySection = ({ id, title, subtitle, products }: CategorySectionProps) => {
  return (
    <section id={id} className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-gothic text-4xl md:text-5xl font-bold text-bone-white tracking-wider">
            {title}
          </h2>
          <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-blood-rust to-transparent" />
          <p className="text-lg text-muted-foreground font-serif italic max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div key={index} className="animate-flicker" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>

      {/* Decorative fog elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-fog-gray/5 rounded-full blur-3xl animate-fog-drift" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blood-rust/5 rounded-full blur-3xl animate-fog-drift" style={{ animationDelay: "10s" }} />
      </div>
    </section>
  );
};

export default CategorySection;
