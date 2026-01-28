import circularCollection from "@/assets/circular-collection.png";
import organicEarring from "@/assets/organic-earring.png";
import { Link } from "react-router-dom";

const OneThirdTwoThirdsSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Link to="/category/kurtas" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <img 
                src={organicEarring} 
                alt="Traditional Kashmiri Kurtas" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Kurta Collection
            </h3>
            <p className="text-sm font-light text-foreground">
              Traditional embroidered kurtas with intricate Kashmiri needlework
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Link to="/category/stoles" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <img 
                src={circularCollection} 
                alt="Kashmiri Stoles and Wraps" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Stoles & Wraps
            </h3>
            <p className="text-sm font-light text-foreground">
              Lightweight elegance with delicate embroidery and prints
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OneThirdTwoThirdsSection;