import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/admin/ImageUpload";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description?: string | null;
  price_cents: number;
  category_id: string | null;
  is_active: boolean;
  is_featured?: boolean;
  stock_quantity?: number;
  category?: { name: string };
  product_images?: { id: string; image_url: string; is_primary: boolean }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ProductsManagement = ({ onUpdate }: { onUpdate: () => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price_cents: "",
    category_id: "",
    is_active: true,
    is_featured: false,
    stock_quantity: "0",
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      if (!productsData || productsData.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Fetch categories and images separately
      const categoryIds = [...new Set(productsData.map((p: any) => p.category_id).filter(Boolean))];
      const productIds = productsData.map((p: any) => p.id);

      const [categoriesData, imagesData] = await Promise.all([
        categoryIds.length > 0
          ? supabase.from("categories").select("id, name, slug").in("id", categoryIds)
          : Promise.resolve({ data: [], error: null }),
        productIds.length > 0
          ? supabase.from("product_images").select("*").in("product_id", productIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

      // Combine data
      const categoriesMap = new Map((categoriesData.data || []).map((c: any) => [c.id, c]));
      const imagesMap = new Map<string, any[]>();
      
      (imagesData.data || []).forEach((img: any) => {
        if (!imagesMap.has(img.product_id)) {
          imagesMap.set(img.product_id, []);
        }
        imagesMap.get(img.product_id)!.push(img);
      });

      const transformedData = productsData.map((product: any) => ({
        ...product,
        category: product.category_id ? categoriesMap.get(product.category_id) : null,
        product_images: imagesMap.get(product.id) || [],
      }));

      setProducts(transformedData);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error("Error fetching categories: " + error.message);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      price_cents: "",
      category_id: "",
      is_active: true,
      is_featured: false,
      stock_quantity: "0",
    });
    setImages([]);
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      short_description: (product as any).short_description || "",
      price_cents: (product.price_cents / 100).toString(),
      category_id: product.category_id || "",
      is_active: product.is_active,
      is_featured: (product as any).is_featured || false,
      stock_quantity: ((product as any).stock_quantity || 0).toString(),
    });
    // Sort images by display_order, primary first
    const sortedImages = (product.product_images || [])
      .sort((a, b) => {
        if (a.is_primary) return -1;
        if (b.is_primary) return 1;
        return a.display_order - b.display_order;
      })
      .map((img) => img.image_url);
    setImages(sortedImages);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = formData.slug || generateSlug(formData.name);
      
      // Build product data - only include fields that definitely exist
      const productData: any = {
        name: formData.name,
        slug,
        description: formData.description || null,
        price_cents: Math.round(parseFloat(formData.price_cents) * 100),
        category_id: formData.category_id || null,
        is_active: formData.is_active,
      };

      // Add optional fields safely
      if (formData.short_description) {
        productData.short_description = formData.short_description;
      }
      
      if (formData.stock_quantity) {
        productData.stock_quantity = parseInt(formData.stock_quantity) || 0;
      }
      
      // Try to add is_featured, but handle if column doesn't exist
      try {
        productData.is_featured = formData.is_featured || false;
      } catch (e) {
        // Column doesn't exist, skip it
      }

      let productId: string;

      if (editingProduct) {
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id)
          .select()
          .single();
        
        if (error) {
          // If error is about missing column, try without is_featured
          if (error.message?.includes('is_featured')) {
            delete productData.is_featured;
            const { data: retryData, error: retryError } = await supabase
              .from("products")
              .update(productData)
              .eq("id", editingProduct.id)
              .select()
              .single();
            if (retryError) throw retryError;
            productId = retryData.id;
          } else {
            throw error;
          }
        } else {
          productId = data.id;
        }
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();
        
        if (error) {
          // If error is about missing column, try without is_featured
          if (error.message?.includes('is_featured')) {
            delete productData.is_featured;
            const { data: retryData, error: retryError } = await supabase
              .from("products")
              .insert(productData)
              .select()
              .single();
            if (retryError) throw retryError;
            productId = retryData.id;
          } else {
            throw error;
          }
        } else {
          productId = data.id;
        }
      }

      // Handle images
      if (images.length > 0) {
        // Delete existing images from database
        await supabase.from("product_images").delete().eq("product_id", productId);

        // Insert new images
        const imageData = images.map((url, index) => ({
          product_id: productId,
          image_url: url,
          display_order: index,
          is_primary: index === 0,
        }));

        const { error: imageError } = await supabase.from("product_images").insert(imageData);
        if (imageError) {
          console.error("Error saving images:", imageError);
          // Don't fail the whole operation
        }
      }

      toast.success(editingProduct ? "Product updated!" : "Product created!");
      setDialogOpen(false);
      fetchProducts();
      onUpdate();
    } catch (error: any) {
      toast.error("Error saving product: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted!");
      fetchProducts();
      onUpdate();
    } catch (error: any) {
      toast.error("Error deleting product: " + error.message);
    }
  };


  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product details" : "Create a new product"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_cents">Price (₹) *</Label>
                  <Input
                    id="price_cents"
                    type="number"
                    step="0.01"
                    value={formData.price_cents}
                    onChange={(e) => setFormData({ ...formData, price_cents: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Select
                  value={formData.category_id || undefined}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value || "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={10}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No products found. Create your first product!
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category?.name || "-"}</TableCell>
                  <TableCell>₹{(product.price_cents / 100).toLocaleString()}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsManagement;
