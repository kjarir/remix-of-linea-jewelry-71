import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface CategoryHeaderProps {
  category: string;
}

const CategoryHeader = ({ category }: CategoryHeaderProps) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [itemCount, setItemCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryInfo();
  }, [category]);

  const fetchCategoryInfo = async () => {
    try {
      if (category && category !== 'all') {
        // Fetch category name
        const { data: categoryData } = await supabase
          .from("categories")
          .select("name")
          .eq("slug", category.toLowerCase())
          .eq("is_active", true)
          .single();

        if (categoryData) {
          setCategoryName(categoryData.name);
        } else {
          setCategoryName(category.charAt(0).toUpperCase() + category.slice(1));
        }

        // Count products in category
        const { data: categoryWithId } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", category.toLowerCase())
          .single();

        if (categoryWithId) {
          const { count } = await supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("category_id", categoryWithId.id)
            .eq("is_active", true);
          
          setItemCount(count || 0);
        }
      } else {
        setCategoryName("All Products");
        const { count } = await supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true);
        setItemCount(count || 0);
      }
    } catch (error) {
      console.error("Error fetching category info:", error);
      setCategoryName(category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="w-full px-6 mb-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{loading ? "Loading..." : categoryName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div>
        <h1 className="text-3xl md:text-4xl font-light text-foreground">
          {loading ? "Loading..." : categoryName}
        </h1>
        {!loading && itemCount > 0 && (
          <p className="text-sm font-light text-muted-foreground mt-2">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>
    </section>
  );
};

export default CategoryHeader;
