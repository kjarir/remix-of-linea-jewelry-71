import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteProduct {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  image_url: string;
  category?: { name: string };
}

const Favorites = () => {
  const { user } = useAuth();
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const navigate = useNavigate();
  const [products, setProducts] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (favorites.length > 0) {
      fetchFavoriteProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [user, favorites, navigate]);

  const fetchFavoriteProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, price_cents, category:categories(name), product_images(image_url, is_primary)")
        .in("id", favorites)
        .eq("is_active", true);

      if (error) throw error;

      const productsWithImages = data?.map((product: any) => {
        const primaryImage = product.product_images?.find((img: any) => img.is_primary);
        return {
          ...product,
          image_url: primaryImage?.image_url || product.product_images?.[0]?.image_url || "/placeholder.svg",
        };
      });

      setProducts(productsWithImages || []);
    } catch (error) {
      console.error("Error fetching favorite products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-6 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-light mb-2">My Favorites</h1>
            <p className="text-muted-foreground">
              {products.length === 0 
                ? "You haven't liked any products yet" 
                : `${products.length} ${products.length === 1 ? 'product' : 'products'} you love`}
            </p>
          </div>

          {loading || favoritesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Heart className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-light mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring our collection and like products you love
              </p>
              <Button asChild>
                <Link to="/category/carpets">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <Card key={product.id} className="border-none shadow-none bg-transparent group">
                  <CardContent className="p-0">
                    <Link to={`/product/${product.slug}`}>
                      <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/[0.03]"></div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(product.id);
                          }}
                          className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                          aria-label="Remove from favorites"
                        >
                          <Heart className="h-5 w-5 fill-current text-red-500" />
                        </button>
                      </div>
                    </Link>
                    <div className="space-y-1">
                      <p className="text-sm font-light text-foreground">
                        {product.category?.name || "Product"}
                      </p>
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">
                          {product.name}
                        </h3>
                        <p className="text-sm font-light text-foreground">
                          ₹{(product.price_cents / 100).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Favorites;
