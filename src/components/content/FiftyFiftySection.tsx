import earringsCollection from "@/assets/earrings-collection.png";
import linkBracelet from "@/assets/link-bracelet.png";
import { Link } from "react-router-dom";

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Link to="/category/shawls" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <img 
                src={earringsCollection} 
                alt="Pashmina Shawls collection" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Pashmina Collection
            </h3>
            <p className="text-sm font-light text-foreground">
              Hand-spun luxury from the finest Changthangi goat wool
            </p>
          </div>
        </div>

        <div>
          <Link to="/category/carpets" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <img 
                src={linkBracelet} 
                alt="Kashmiri Carpets collection" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Handwoven Carpets
            </h3>
            <p className="text-sm font-light text-foreground">
              Centuries-old weaving traditions in silk and wool
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiftyFiftySection;