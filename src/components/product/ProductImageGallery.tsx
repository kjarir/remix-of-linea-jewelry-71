import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import ImageZoom from "./ImageZoom";

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

const ProductImageGallery = () => {
  const { productId } = useParams<{ productId: string }>();
  const [productImages, setProductImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomInitialIndex, setZoomInitialIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const fetchProductImages = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        // First, get the product ID (productId might be a slug)
        const { data: productData } = await supabase
          .from("products")
          .select("id")
          .or(`slug.eq.${productId},id.eq.${productId}`)
          .single();

        if (!productData) {
          setProductImages(["/placeholder.svg"]);
          setLoading(false);
          return;
        }

        const actualProductId = productData.id;

        // Now fetch images using the actual UUID
        const { data, error } = await supabase
          .from("product_images")
          .select("image_url, display_order, is_primary")
          .eq("product_id", actualProductId)
          .order("display_order", { ascending: true });

        if (error) {
          // If table doesn't exist or other error, use placeholder
          if (error.code === '42P01' || error.code === 'PGRST116' || error.code === 'PGRST205' || error.message?.includes('product_images')) {
            setProductImages(["/placeholder.svg"]);
          } else {
            throw error;
          }
        } else if (data && data.length > 0) {
          // Sort by display_order, with primary image first
          const sorted = data.sort((a, b) => {
            if (a.is_primary) return -1;
            if (b.is_primary) return 1;
            return (a.display_order || 0) - (b.display_order || 0);
          });
          setProductImages(sorted.map((img) => img.image_url));
        } else {
          // Fallback to placeholder if no images
          setProductImages(["/placeholder.svg"]);
        }
      } catch (error) {
        console.error("Error fetching product images:", error);
        setProductImages(["/placeholder.svg"]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductImages();
  }, [productId]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleImageClick = (index: number) => {
    setZoomInitialIndex(index);
    setIsZoomOpen(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const difference = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(difference) > minSwipeDistance) {
      if (difference > 0) {
        // Swipe left - next image
        nextImage();
      } else {
        // Swipe right - previous image
        prevImage();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (loading) {
    return (
      <div className="w-full aspect-square bg-muted animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground">Loading images...</span>
      </div>
    );
  }

  if (productImages.length === 0) {
    return (
      <div className="w-full aspect-square bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop: Vertical scrolling gallery (1024px and above) */}
      <div className="hidden lg:block">
        <div className="space-y-4">
          {productImages.map((image, index) => (
            <div 
              key={index} 
              className="w-full aspect-square overflow-hidden cursor-pointer group"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image}
                alt={`Product view ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tablet/Mobile: Image slider (below 1024px) */}
      <div className="lg:hidden">
        <div className="relative">
          <div 
            className="w-full aspect-square overflow-hidden cursor-pointer group touch-pan-y"
            onClick={() => handleImageClick(currentImageIndex)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={productImages[currentImageIndex]}
              alt={`Product view ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
            />
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-4 gap-2">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-foreground' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <ImageZoom
        images={productImages}
        initialIndex={zoomInitialIndex}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </div>
  );
};

export default ProductImageGallery;