import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", user.id);

      if (error) {
        // If table doesn't exist or error, just set empty array
        if (error.code === '42P01' || error.code === 'PGRST116') {
          setFavorites([]);
        } else {
          throw error;
        }
      } else {
        setFavorites(data?.map((f) => f.product_id) || []);
      }
    } catch (error) {
      // Silently fail - just set empty array
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const isFavorite = favorites.includes(productId);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error && error.code !== '42P01') {
          throw error;
        }
        setFavorites(favorites.filter((id) => id !== productId));
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, product_id: productId });

        if (error && error.code !== '42P01') {
          throw error;
        }
        setFavorites([...favorites, productId]);
      }
    } catch (error) {
      // Silently fail - update local state anyway
      if (isFavorite) {
        setFavorites(favorites.filter((id) => id !== productId));
      } else {
        setFavorites([...favorites, productId]);
      }
    }
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return { favorites, loading, toggleFavorite, isFavorite, fetchFavorites };
};
