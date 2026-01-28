import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewProduct from "./ReviewProduct";

const CustomStar = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className={`w-3 h-3 ${filled ? 'text-foreground' : 'text-muted-foreground/30'} ${className}`}
  >
    <path 
      fillRule="evenodd" 
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" 
      clipRule="evenodd" 
    />
  </svg>
);

const ProductDescription = () => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  return (
    <div className="space-y-0 mt-8 border-t border-border">
      {/* Description */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Description</span>
          {isDescriptionOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isDescriptionOpen && (
          <div className="pb-6 space-y-4">
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              The Kani Pashmina shawl represents the pinnacle of Kashmiri weaving tradition. 
              This exquisite piece is crafted using the centuries-old Kani technique, where 
              intricate patterns are woven directly into the fabric using small wooden sticks called 'tujis'.
            </p>
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              Made from 100% pure Pashmina wool sourced from Changthangi goats at high altitudes 
              of Ladakh, this shawl offers unparalleled warmth and softness. The paisley patterns 
              are inspired by traditional Mughal designs, making each piece a work of art.
            </p>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Product Details</span>
          {isDetailsOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isDetailsOpen && (
          <div className="pb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-light text-muted-foreground">SKU</span>
              <span className="text-sm font-light text-foreground">MS-KP-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-light text-muted-foreground">Collection</span>
              <span className="text-sm font-light text-foreground">Heritage Kani Series</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-light text-muted-foreground">Weave Type</span>
              <span className="text-sm font-light text-foreground">Kani / Jamawar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-light text-muted-foreground">GI Certified</span>
              <span className="text-sm font-light text-foreground">Yes</span>
            </div>
          </div>
        )}
      </div>

      {/* Care Instructions */}
      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsCareOpen(!isCareOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Care Instructions</span>
          {isCareOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isCareOpen && (
          <div className="pb-6 space-y-4">
            <ul className="space-y-2">
              <li className="text-sm font-light text-muted-foreground">• Dry clean recommended for best results</li>
              <li className="text-sm font-light text-muted-foreground">• If hand washing, use cold water and mild wool detergent</li>
              <li className="text-sm font-light text-muted-foreground">• Never wring or twist - gently squeeze out water</li>
              <li className="text-sm font-light text-muted-foreground">• Lay flat to dry away from direct sunlight</li>
              <li className="text-sm font-light text-muted-foreground">• Store in breathable cotton bag with natural moth repellent</li>
            </ul>
            <p className="text-sm font-light text-muted-foreground">
              For professional cleaning and restoration services, contact our customer care team.
            </p>
          </div>
        )}
      </div>

      {/* Customer Reviews */}
      <div className="border-b border-border lg:mb-16">
        <Button
          variant="ghost"
          onClick={() => setIsReviewsOpen(!isReviewsOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <div className="flex items-center gap-3">
            <span>Customer Reviews</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <CustomStar
                  key={star}
                  filled={star <= 4.8}
                />
              ))}
              <span className="text-sm font-light text-muted-foreground ml-1">4.8</span>
            </div>
          </div>
          {isReviewsOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isReviewsOpen && (
          <div className="pb-6 space-y-6">
            {/* Review Product Button */}
            <ReviewProduct />

            {/* Reviews List */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <CustomStar
                        key={star}
                        filled={true}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-light text-muted-foreground">Priya S.</span>
                </div>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  "Absolutely stunning shawl! The craftsmanship is exceptional and the softness is 
                  incredible. Received so many compliments when I wore it to a wedding. Worth every rupee."
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <CustomStar
                        key={star}
                        filled={star <= 5}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-light text-muted-foreground">Meera K.</span>
                </div>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  "The quality is outstanding. You can tell this is genuine Pashmina - so lightweight 
                  yet incredibly warm. The Kani work is intricate and beautiful. A treasured heirloom piece."
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <CustomStar
                        key={star}
                        filled={star <= 4}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-light text-muted-foreground">Anjali R.</span>
                </div>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  "Beautiful shawl with amazing detail. The packaging was lovely and it came with 
                  a certificate of authenticity. Perfect gift for my mother-in-law."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;