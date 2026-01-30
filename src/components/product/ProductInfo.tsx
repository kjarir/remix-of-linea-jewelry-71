import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

const ProductInfo = () => {
  const { productId } = useParams<{ productId: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      // Fetch product first (without nested relation)
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .or(`slug.eq.${productId},id.eq.${productId}`)
        .eq("is_active", true)
        .single();

      if (productError) throw productError;
      
      if (!productData) {
        setLoading(false);
        return;
      }

      // Fetch category separately if category_id exists
      let category = null;
      if (productData.category_id) {
        const { data: categoryData } = await supabase
          .from("categories")
          .select("id, name, slug")
          .eq("id", productData.category_id)
          .single();
        
        category = categoryData || null;
      }

      setProduct({
        ...productData,
        category,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (product) {
      toggleFavorite(product.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb - Show only on desktop */}
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {product?.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/category/${product.category.slug}`}>{product.category.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product?.name || "Product"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse"></div>
          <div className="h-6 bg-muted animate-pulse w-1/2"></div>
        </div>
      ) : product ? (
        <>
          {/* Product title and price */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-light text-muted-foreground mb-1">
                  {product.category?.name || "Product"}
                </p>
                <h1 className="text-2xl md:text-3xl font-light text-foreground">{product.name}</h1>
              </div>
              <div className="text-right">
                <p className="text-xl font-light text-foreground">
                  ₹{(product.price_cents / 100).toLocaleString()}
                </p>
                {product.compare_at_price_cents && (
                  <p className="text-sm text-muted-foreground line-through">
                    ₹{(product.compare_at_price_cents / 100).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>

      {/* Product details */}
      <div className="space-y-4 py-4 border-b border-border">
        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Material</h3>
          <p className="text-sm font-light text-muted-foreground">100% Pure Pashmina (Changthangi Goat Wool)</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Dimensions</h3>
          <p className="text-sm font-light text-muted-foreground">200cm x 100cm (Medium Shawl)</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Craft</h3>
          <p className="text-sm font-light text-muted-foreground">Traditional Kani Weaving, Handloom</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Artisan's notes</h3>
          <p className="text-sm font-light text-muted-foreground italic">"Each Kani shawl takes months to complete, with intricate patterns woven using traditional wooden needles called 'tujis'. This piece features the classic paisley motif, a symbol of fertility and life."</p>
        </div>
      </div>

          {/* Like Button */}
          <div className="space-y-4 pt-4">
            <Button 
              variant="outline"
              className="w-full h-12 border-foreground text-foreground hover:bg-foreground hover:text-background font-light rounded-none flex items-center justify-center gap-2"
              onClick={handleLikeClick}
            >
              <Heart 
                className={`h-5 w-5 ${product && isFavorite(product.id) ? 'fill-current' : ''}`}
              />
              {product && isFavorite(product.id) ? 'Liked' : 'Like this Product'}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Product not found
        </div>
      )}
    </div>
  );
};

export default ProductInfo;