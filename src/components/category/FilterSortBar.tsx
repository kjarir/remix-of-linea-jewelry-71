import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";

interface FilterSortBarProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  itemCount: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const FilterSortBar = ({ filtersOpen, setFiltersOpen, itemCount }: FilterSortBarProps) => {
  const [sortBy, setSortBy] = useState("featured");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Try full query with all columns first
      let { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (!error) {
        setCategories(data || []);
        setLoading(false);
        return;
      }
      
      // If error, try without is_active filter
      if (error.message?.includes('is_active')) {
        ({ data, error } = await supabase
          .from("categories")
          .select("id, name, slug")
          .order("display_order", { ascending: true }));
      }
      
      if (!error) {
        setCategories(data || []);
        setLoading(false);
        return;
      }
      
      // If error, try without display_order
      if (error.message?.includes('display_order')) {
        ({ data, error } = await supabase
          .from("categories")
          .select("id, name, slug")
          .order("created_at", { ascending: true }));
      }
      
      if (!error) {
        setCategories(data || []);
        setLoading(false);
        return;
      }
      
      // Last resort: basic select
      ({ data } = await supabase.from("categories").select("id, name, slug"));
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const priceRanges = ["Under ₹10,000", "₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "Over ₹50,000"];
  const materials = ["Pashmina", "Silk", "Wool", "Cotton"];

  return (
    <>
      <section className="w-full px-6 mb-8 border-b border-border pb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-light text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
          
          <div className="flex items-center gap-4">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="font-light hover:bg-transparent"
                >
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background border-none shadow-none">
                <SheetHeader className="mb-6 border-b border-border pb-4">
                  <SheetTitle className="text-lg font-light">Filters</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-8">
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-sm font-light mb-4 text-foreground">Category</h3>
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-5 bg-muted animate-pulse"></div>
                        ))}
                      </div>
                    ) : categories.length > 0 ? (
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            to={`/category/${category.slug}`}
                            className="flex items-center space-x-3 hover:text-primary transition-colors"
                            onClick={() => setFiltersOpen(false)}
                          >
                            <Checkbox id={category.id} className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground" />
                            <Label htmlFor={category.id} className="text-sm font-light text-foreground cursor-pointer">
                              {category.name}
                            </Label>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No categories available</p>
                    )}
                  </div>

                  <Separator className="border-border" />

                  {/* Price Filter */}
                  <div>
                    <h3 className="text-sm font-light mb-4 text-foreground">Price</h3>
                    <div className="space-y-3">
                      {priceRanges.map((range) => (
                        <div key={range} className="flex items-center space-x-3">
                          <Checkbox id={range} className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground" />
                          <Label htmlFor={range} className="text-sm font-light text-foreground cursor-pointer">
                            {range}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="border-border" />

                  {/* Material Filter */}
                  <div>
                    <h3 className="text-sm font-light mb-4 text-foreground">Material</h3>
                    <div className="space-y-3">
                      {materials.map((material) => (
                        <div key={material} className="flex items-center space-x-3">
                          <Checkbox id={material} className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground" />
                          <Label htmlFor={material} className="text-sm font-light text-foreground cursor-pointer">
                            {material}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="border-border" />

                  <div className="flex flex-col gap-2 pt-4">
                    <Button variant="ghost" size="sm" className="w-full border-none hover:bg-transparent hover:underline font-normal text-left justify-start">
                      Apply Filters
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full border-none hover:bg-transparent hover:underline font-light text-left justify-start">
                      Clear All
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-auto border-none bg-transparent text-sm font-light shadow-none rounded-none pr-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="shadow-none border-none rounded-none bg-background">
                <SelectItem value="featured" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Featured</SelectItem>
                <SelectItem value="price-low" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Price: High to Low</SelectItem>
                <SelectItem value="newest" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Newest</SelectItem>
                <SelectItem value="name" className="hover:bg-transparent hover:underline data-[state=checked]:bg-transparent data-[state=checked]:underline pl-2 [&>span:first-child]:hidden">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </>
  );
};

export default FilterSortBar;
