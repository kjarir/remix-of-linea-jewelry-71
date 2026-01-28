import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import pantheonImage from "@/assets/pantheon.jpg";
import eclipseImage from "@/assets/eclipse.jpg";
import haloImage from "@/assets/halo.jpg";
import obliqueImage from "@/assets/oblique.jpg";
import lintelImage from "@/assets/lintel.jpg";
import shadowlineImage from "@/assets/shadowline.jpg";
import organicEarring from "@/assets/organic-earring.png";
import linkBracelet from "@/assets/link-bracelet.png";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  isNew?: boolean;
}

// Extended product list for category page
const products: Product[] = [
  {
    id: 1,
    name: "Kani Pashmina",
    category: "Shawls",
    price: "₹28,500",
    image: pantheonImage,
    isNew: true,
  },
  {
    id: 2,
    name: "Chinar Silk Carpet",
    category: "Carpets",
    price: "₹85,000",
    image: eclipseImage,
  },
  {
    id: 3,
    name: "Sozni Shawl",
    category: "Shawls",
    price: "₹45,000",
    image: haloImage,
    isNew: true,
  },
  {
    id: 4,
    name: "Embroidered Kurta",
    category: "Kurtas",
    price: "₹12,500",
    image: obliqueImage,
  },
  {
    id: 5,
    name: "Jamawar Stole",
    category: "Stoles",
    price: "₹8,900",
    image: lintelImage,
  },
  {
    id: 6,
    name: "Pure Silk Carpet",
    category: "Carpets",
    price: "₹1,25,000",
    image: shadowlineImage,
  },
  {
    id: 7,
    name: "Pashmina Wrap",
    category: "Shawls",
    price: "₹32,000",
    image: pantheonImage,
  },
  {
    id: 8,
    name: "Wool Carpet",
    category: "Carpets",
    price: "₹55,000",
    image: eclipseImage,
  },
  {
    id: 9,
    name: "Tilla Shawl",
    category: "Shawls",
    price: "₹65,000",
    image: haloImage,
  },
  {
    id: 10,
    name: "Silk Kurta",
    category: "Kurtas",
    price: "₹15,500",
    image: obliqueImage,
  },
  {
    id: 11,
    name: "Aari Stole",
    category: "Stoles",
    price: "₹6,500",
    image: lintelImage,
  },
  {
    id: 12,
    name: "Kashan Carpet",
    category: "Carpets",
    price: "₹95,000",
    image: shadowlineImage,
  },
  {
    id: 13,
    name: "Dorukha Shawl",
    category: "Shawls",
    price: "₹78,000",
    image: pantheonImage,
  },
  {
    id: 14,
    name: "Phiran",
    category: "Phirans",
    price: "₹18,500",
    image: eclipseImage,
  },
  {
    id: 15,
    name: "Papier Mâché Box",
    category: "Accessories",
    price: "₹4,500",
    image: haloImage,
  },
  {
    id: 16,
    name: "Embroidered Phiran",
    category: "Phirans",
    price: "₹22,000",
    image: obliqueImage,
  },
  {
    id: 17,
    name: "Cashmere Stole",
    category: "Stoles",
    price: "₹12,000",
    image: lintelImage,
  },
  {
    id: 18,
    name: "Antique Carpet",
    category: "Carpets",
    price: "₹2,50,000",
    image: shadowlineImage,
  },
  {
    id: 19,
    name: "Bridal Shawl",
    category: "Shawls",
    price: "₹1,20,000",
    image: pantheonImage,
  },
  {
    id: 20,
    name: "Cotton Kurta",
    category: "Kurtas",
    price: "₹8,500",
    image: eclipseImage,
  },
  {
    id: 21,
    name: "Printed Stole",
    category: "Stoles",
    price: "₹3,500",
    image: haloImage,
  },
  {
    id: 22,
    name: "Wool Stole",
    category: "Stoles",
    price: "₹5,500",
    image: obliqueImage,
  },
  {
    id: 23,
    name: "Designer Kurta",
    category: "Kurtas",
    price: "₹19,500",
    image: lintelImage,
  },
  {
    id: 24,
    name: "Heritage Carpet",
    category: "Carpets",
    price: "₹3,50,000",
    image: shadowlineImage,
  },
];

const ProductGrid = () => {
  return (
    <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card 
                className="border-none shadow-none bg-transparent group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                    />
                    <img
                      src={product.category === "Shawls" || product.category === "Stoles" ? organicEarring : linkBracelet}
                      alt={`${product.name} lifestyle`}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/[0.03]"></div>
                    {product.isNew && (
                      <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light text-foreground">
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm font-light text-foreground">
                        {product.price}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      
      <Pagination />
    </section>
  );
};

export default ProductGrid;