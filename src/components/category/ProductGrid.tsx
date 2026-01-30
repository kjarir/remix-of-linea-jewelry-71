import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  category?: { name: string; slug: string };
  product_images?: { image_url: string; is_primary: boolean }[];
  primaryImage?: string;
  secondaryImage?: string;
}

interface ProductGridProps {
  onItemCountChange?: (count: number) => void;
}

const ProductGrid = ({ onItemCountChange }: ProductGridProps) => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // First, get category ID if category slug is provided
      let categoryId: string | null = null;
      if (category && category !== 'all') {
        const { data: categoryData } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", category.toLowerCase())
          .eq("is_active", true)
          .single();
        
        categoryId = categoryData?.id || null;
      }

      // Build query - use simple select without nested relations
      let query = supabase
        .from("products")
        .select("id, name, slug, price_cents, category_id")
        .eq("is_active", true);

      // Filter by category if provided
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data: productsData, error: productsError } = await query.order("created_at", { ascending: false });

      if (productsError) throw productsError;

      if (!productsData || productsData.length === 0) {
        setProducts([]);
        if (onItemCountChange) {
          onItemCountChange(0);
        }
        setLoading(false);
        return;
      }

      // Fetch categories separately
      const categoryIds = [...new Set(productsData.map((p: any) => p.category_id).filter(Boolean))];
      const categoriesMap = new Map();
      if (categoryIds.length > 0) {
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("id, name, slug")
          .in("id", categoryIds);
        
        (categoriesData || []).forEach((cat: any) => {
          categoriesMap.set(cat.id, cat);
        });
      }

      // Fetch images for all products
      const productIds = productsData.map((p: any) => p.id);
      let imagesData: any[] = [];
      
      if (productIds.length > 0) {
        try {
          const { data, error } = await supabase
            .from("product_images")
            .select("product_id, image_url, is_primary, display_order")
            .in("product_id", productIds)
            .order("display_order", { ascending: true });
          
          if (error) {
            // Check if it's a missing table error (42P01 = undefined_table, PGRST205 = table not found)
            if (error.code === '42P01' || error.code === 'PGRST205' || error.message?.includes('product_images')) {
              // Table doesn't exist yet - silently continue without images
              imagesData = [];
            } else {
              // Other error - log it
              console.warn("Error fetching product images:", error);
            }
          } else if (data) {
            imagesData = data;
          }
        } catch (e: any) {
          // Table might not exist, continue without images
          if (e.code !== '42P01' && e.code !== 'PGRST205') {
            console.warn("Error fetching product images:", e);
          }
        }
      }

      // Map images to products
      const imagesMap = new Map<string, any[]>();
      (imagesData || []).forEach((img: any) => {
        if (!imagesMap.has(img.product_id)) {
          imagesMap.set(img.product_id, []);
        }
        imagesMap.get(img.product_id)!.push(img);
      });

      // Combine data
      const transformedProducts = productsData.map((product: any) => {
        const images = imagesMap.get(product.id) || [];
        const primaryImage = images.find((img: any) => img.is_primary) || images[0];
        const secondaryImage = images.length > 1 ? images[1] : primaryImage;

        return {
          ...product,
          category: product.category_id ? categoriesMap.get(product.category_id) : null,
          primaryImage: primaryImage?.image_url || null,
          secondaryImage: secondaryImage?.image_url || primaryImage?.image_url || null,
        };
      });

      setProducts(transformedProducts);
      if (onItemCountChange) {
        onItemCountChange(transformedProducts.length);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setProducts([]);
      if (onItemCountChange) {
        onItemCountChange(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  if (loading) {
    return (
      <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full px-6 mb-16">
        <div className="text-center py-20">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product: any) => (
          <Link key={product.id} to={`/product/${product.slug}`}>
            <Card 
              className="border-none shadow-none bg-transparent group cursor-pointer"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <CardContent className="p-0">
                <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                  {product.primaryImage ? (
                    <>
                      <img
                        src={product.primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      {product.secondaryImage && product.secondaryImage !== product.primaryImage && (
                        <img
                          src={product.secondaryImage}
                          alt={`${product.name} alternate view`}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/20">
                      <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/[0.03]"></div>
                  <button
                    onClick={(e) => handleLikeClick(e, product.id)}
                    className={`absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-all ${
                      hoveredProduct === product.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    aria-label="Like product"
                  >
                    <Heart 
                      className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current text-red-500' : ''}`}
                    />
                  </button>
                </div>
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
          </Link>
        ))}
      </div>
      
      {products.length > 0 && <Pagination />}
    </section>
  );
};

export default ProductGrid;
