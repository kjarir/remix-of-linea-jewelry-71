import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  hoverImage?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Kani Pashmina Shawl",
    category: "Shawls",
    price: "₹28,500",
    image: "/categories/1bc9bff95c54ef39ed37cbc5c7a9a4ab.jpg",
    hoverImage: "/categories/43fc8aea65ea7b3f8a0be1139d51a223.jpg",
  },
  {
    id: 2,
    name: "Chinar Silk Carpet",
    category: "Carpets",
    price: "₹85,000",
    image: "/categories/2b314e370d807cbe26a3e817c244c755.jpg",
    hoverImage: "/categories/2d0d8848ac1683a9174ce682204b2dca.jpg",
  },
  {
    id: 3,
    name: "Sozni Embroidered Shawl",
    category: "Shawls",
    price: "₹45,000",
    image: "/categories/82b94fe12b1537f15b07908ba805c786.jpg",
    hoverImage: "/categories/ce88a837d9a9dadcfa032a8727651e2e.jpg",
  },
  {
    id: 4,
    name: "Embroidered Kurta",
    category: "Kurtis",
    price: "₹12,500",
    image: "/categories/282a765efca705a1cbde4db387df53e6.jpg",
    hoverImage: "/categories/4427ef1bda13f8827adcd4181cd577bf.jpg",
  },
  {
    id: 5,
    name: "Traditional Kurta",
    category: "Kurtis",
    price: "₹9,500",
    image: "/categories/458128751705e1ca3059963b0ec417c9.jpg",
    hoverImage: "/categories/81881111df609799d05341dadf429eac.jpg",
  },
  {
    id: 6,
    name: "Premium Pashmina Shawl",
    category: "Shawls",
    price: "₹35,000",
    image: "/categories/fdc86c20c1e93695ba6e1344fd6fa85b.jpg",
    hoverImage: "/categories/e1fc46532186f1af8eb10462db63eb79.jpg",
  },
];

const ProductCarousel = () => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const handleLikeClick = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    // Convert productId to string for Supabase
    toggleFavorite(productId.toString());
  };

  return (
    <section className="w-full mb-16 px-6">
      <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="">
            {products.map((product) => (
               <CarouselItem
                 key={product.id}
                 className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
               >
                 <Link to={`/product/${product.id}`}>
                  <Card 
                    className="border-none shadow-none bg-transparent group"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                        />
                        {product.hoverImage && (
                          <img
                            src={product.hoverImage}
                            alt={`${product.name} alternate view`}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/[0.03]"></div>
                        {(product.id === 1 || product.id === 3) && (
                          <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black bg-white/80 backdrop-blur-sm">
                            NEW
                          </div>
                        )}
                        <button
                          onClick={(e) => handleLikeClick(e, product.id)}
                          className={`absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-all ${
                            hoveredProduct === product.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                          aria-label="Like product"
                        >
                          <Heart 
                            className={`h-4 w-4 ${isFavorite(product.id.toString()) ? 'fill-current text-red-500' : ''}`}
                          />
                        </button>
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
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
    </section>
  );
};

export default ProductCarousel;