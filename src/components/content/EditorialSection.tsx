import founders from "@/assets/founders.png";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EditorialSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 max-w-[630px]">
          <h2 className="text-2xl font-normal text-foreground leading-tight md:text-xl">
            Craftsmanship Woven Through Generations
          </h2>
          <p className="text-sm font-light text-foreground leading-relaxed">
            Mannat Shawl's was founded with a vision to bring the finest Kashmiri craftsmanship to the world. Our artisans, many from families with centuries of weaving heritage, create each piece with the same devotion and skill that has made Kashmir's textiles legendary.
          </p>
          <Link to="/about/our-story" className="inline-flex items-center gap-1 text-sm font-light text-foreground hover:text-foreground/80 transition-colors duration-200">
            <span>Read our full story</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="order-first md:order-last">
          <div className="w-full aspect-square overflow-hidden">
            <img src={founders} alt="Kashmiri artisans creating traditional textiles" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialSection;