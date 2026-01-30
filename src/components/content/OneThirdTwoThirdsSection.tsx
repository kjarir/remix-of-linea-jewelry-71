import { Link } from "react-router-dom";

const OneThirdTwoThirdsSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Link to="/category/kurtis" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <img 
                src="/categories/282a765efca705a1cbde4db387df53e6.jpg" 
                alt="Traditional Kashmiri Kurtis" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Kurta Collection
            </h3>
            <p className="text-sm font-light text-foreground">
              Traditional embroidered Kurtis with intricate Kashmiri needlework. Handcrafted elegance in every stitch.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Link to="/category/shawls" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <img 
                src="/categories/ce88a837d9a9dadcfa032a8727651e2e.jpg" 
                alt="Kashmiri Shawls and Wraps" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Shawls & Wraps
            </h3>
            <p className="text-sm font-light text-foreground">
              Lightweight elegance with delicate embroidery and prints. Premium Pashmina shawls perfect for any occasion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OneThirdTwoThirdsSection;