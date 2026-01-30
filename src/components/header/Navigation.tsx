import { ArrowRight, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/lib/supabaseClient";

const Navigation = () => {
  const { user, isAdmin, signOut, profile } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [offCanvasType, setOffCanvasType] = useState<'favorites' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  
  // Fetch favorite products when favorites panel opens
  useEffect(() => {
    if (offCanvasType === 'favorites' && favorites.length > 0) {
      fetchFavoriteProducts();
    } else {
      setFavoriteProducts([]);
    }
  }, [offCanvasType, favorites]);

  const fetchFavoriteProducts = async () => {
    if (favorites.length === 0) return;

    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price_cents, slug, product_images(image_url, is_primary)")
        .in("id", favorites)
        .eq("is_active", true);

      if (error) throw error;

      const productsWithImages = data?.map((product) => {
        const primaryImage = product.product_images?.find((img: any) => img.is_primary);
        return {
          ...product,
          image_url: primaryImage?.image_url || product.product_images?.[0]?.image_url || "/placeholder.svg",
          price: `₹${(product.price_cents / 100).toLocaleString()}`,
        };
      });

      setFavoriteProducts(productsWithImages || []);
    } catch (error) {
      console.error("Error fetching favorite products:", error);
    }
  };

  // Preload dropdown images for faster display
  useEffect(() => {
    const imagesToPreload = [
      "/rings-collection.png",
      "/earrings-collection.png", 
      "/arcus-bracelet.png",
      "/span-bracelet.png",
      "/founders.png"
    ];
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const popularSearches = [
    "Pashmina Shawls",
    "Kashmiri Kurtas", 
    "Silk Carpets",
    "Embroidered Stoles",
    "Wedding Collection",
    "Winter Shawls"
  ];
  
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string; image_url: string | null }[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Try full query with all columns first
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, image_url")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (!error && data) {
        setCategories(data.map((cat: any) => ({ 
          id: cat.id, 
          name: cat.name, 
          slug: cat.slug, 
          image_url: cat.image_url || null 
        })));
        return;
      }
      
      // Fallback: basic query
      const { data: fallbackData } = await supabase
        .from("categories")
        .select("id, name, slug");
      
      setCategories((fallbackData || []).map((cat: any) => ({ 
        id: cat.id, 
        name: cat.name, 
        slug: cat.slug, 
        image_url: null 
      })));
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const navItems = useMemo(() => [
    { 
      name: "Shop", 
      href: "/category/all",
      submenuItems: categories.length > 0 ? categories.map(cat => cat.name) : [],
      images: categories.length > 0 
        ? categories.slice(0, 2).map(cat => ({
            src: cat.image_url || "/placeholder.svg",
            alt: `${cat.name} Collection`,
            label: cat.name
          }))
        : []
    },
    { 
      name: "New in", 
      href: "/category/all",
      submenuItems: categories.length > 0 ? categories.map(cat => cat.name) : [],
      images: categories.length > 0 
        ? categories.slice(0, 2).map(cat => ({
            src: cat.image_url || "/placeholder.svg",
            alt: `${cat.name} Collection`,
            label: cat.name
          }))
        : []
    },
    { 
      name: "About", 
      href: "/about/our-story",
      submenuItems: [
        "Our Story",
        "Sustainability",
        "Size Guide",
        "Customer Care",
        "Store Locator"
      ],
      images: [
        { src: "/founders.png", alt: "Our Artisans", label: "Read our story" }
      ]
    }
  ], [categories]);

  return (
    <nav 
      className="relative" 
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile hamburger button */}
        <button
          className="lg:hidden p-2 mt-0.5 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-5 relative">
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1.5'
            }`}></span>
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 top-2.5 ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}></span>
            <span className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-3.5'
            }`}></span>
          </div>
        </button>

        {/* Left navigation - Hidden on tablets and mobile */}
        <div className="hidden lg:flex space-x-8">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={item.href}
                className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light py-6 block"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Center logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="block">
            <span className="text-xl font-light tracking-wide text-foreground">Mannat Shawl's</span>
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
          <button 
            className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200 relative"
            aria-label="Favorites"
            onClick={() => {
              if (user) {
                setOffCanvasType('favorites');
              } else {
                navigate('/login');
              }
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill={favorites.length > 0 ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          {user ? (
            <div className="relative">
              <button 
                className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
                aria-label="Account"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAccountMenuOpen(!isAccountMenuOpen);
                }}
                onBlur={(e) => {
                  // Don't close if clicking inside the dropdown
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setTimeout(() => setIsAccountMenuOpen(false), 200);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </button>
              {isAccountMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 bg-background border border-border shadow-lg z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-2">
                    {(isAdmin || profile?.is_admin) && (
                      <Link
                        to="/admin"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-nav-foreground hover:bg-muted/50 transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/favorites"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-nav-foreground hover:bg-muted/50 transition-colors"
                    >
                      My Favorites
                    </Link>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsAccountMenuOpen(false);
                        
                        try {
                          await signOut();
                        } catch (error) {
                          console.error("Error signing out:", error);
                        }
                        
                        // Always navigate and reload regardless of signOut result
                        navigate('/', { replace: true });
                        setTimeout(() => {
                          window.location.href = '/';
                        }, 100);
                      }}
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm text-nav-foreground hover:bg-muted/50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-nav-foreground hover:text-nav-hover transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Full width dropdown */}
      {activeDropdown && (
        <div 
          className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50"
          onMouseEnter={() => setActiveDropdown(activeDropdown)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="px-6 py-8">
            <div className="flex justify-between w-full">
              {/* Left side - Menu items */}
              <div className="flex-1">
                <ul className="space-y-2">
                   {navItems
                     .find(item => item.name === activeDropdown)
                     ?.submenuItems.map((subItem, index) => (
                      <li key={index}>
                        {activeDropdown === "Shop" ? (
                          <Link 
                            to={`/category/${categories.find(c => c.name === subItem)?.slug || subItem.toLowerCase()}`}
                            className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light block py-2"
                          >
                            {subItem}
                          </Link>
                        ) : activeDropdown === "About" ? (
                          <Link 
                            to={`/about/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light block py-2"
                          >
                            {subItem}
                          </Link>
                        ) : (
                          <Link 
                            to={`/category/${subItem.toLowerCase()}`}
                            className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light block py-2"
                          >
                            {subItem}
                          </Link>
                        )}
                      </li>
                   ))}
                </ul>
              </div>

              {/* Right side - Images */}
              <div className="flex space-x-6">
                {navItems
                  .find(item => item.name === activeDropdown)
                  ?.images.map((image, index) => {
                    // Determine the link destination based on dropdown and image
                    let linkTo = "/";
                    if (activeDropdown === "Shop") {
                      const category = categories.find(c => c.name === image.label);
                      linkTo = category ? `/category/${category.slug}` : "/category/all";
                    } else if (activeDropdown === "New in") {
                      linkTo = "/category/all";
                    } else if (activeDropdown === "About") {
                      linkTo = "/about/our-story";
                    }
                    
                    return (
                      <Link key={index} to={linkTo} className="w-[400px] h-[280px] cursor-pointer group relative overflow-hidden block">
                        <img 
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                        />
                        {(activeDropdown === "Shop" || activeDropdown === "New in" || activeDropdown === "About") && (
                          <div className="absolute bottom-2 left-2 text-white text-xs font-light flex items-center gap-1">
                            <span>{image.label}</span>
                            <ArrowRight size={12} />
                          </div>
                        )}
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {isSearchOpen && (
        <div 
          className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50"
        >
          <div className="px-6 py-8">
            <div className="max-w-2xl mx-auto">
              {/* Search input */}
              <div className="relative mb-8">
                <div className="flex items-center border-b border-border pb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-nav-foreground mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for shawls, kurtas, carpets..."
                    className="flex-1 bg-transparent text-nav-foreground placeholder:text-nav-foreground/60 outline-none text-lg"
                    autoFocus
                  />
                </div>
              </div>

              {/* Popular searches */}
              <div>
                <h3 className="text-nav-foreground text-sm font-light mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-3">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      className="text-nav-foreground hover:text-nav-hover text-sm font-light py-2 px-4 border border-border rounded-full transition-colors duration-200 hover:border-nav-hover"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
          <div className="px-6 py-8">
            <div className="space-y-6">
              {navItems.map((item, index) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-lg font-light block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                   <div className="mt-3 pl-4 space-y-2">
                     {item.submenuItems.map((subItem, subIndex) => {
                       const category = categories.find(c => c.name === subItem);
                       const linkTo = item.name === "About" 
                         ? `/about/${subItem.toLowerCase().replace(/\s+/g, '-')}` 
                         : category 
                           ? `/category/${category.slug}` 
                           : `/category/${subItem.toLowerCase()}`;
                       
                       return (
                         <Link
                           key={subIndex}
                           to={linkTo}
                           className="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1"
                           onClick={() => setIsMobileMenuOpen(false)}
                         >
                           {subItem}
                         </Link>
                       );
                     })}
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Favorites Off-canvas overlay */}
      {offCanvasType === 'favorites' && (
        <div className="fixed inset-0 z-50 h-screen">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 h-screen"
            onClick={() => setOffCanvasType(null)}
          />
          
          {/* Off-canvas panel */}
          <div className="absolute right-0 top-0 h-screen w-96 bg-background border-l border-border animate-slide-in-right flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-light text-foreground">Your Favorites</h2>
              <button
                onClick={() => setOffCanvasType(null)}
                className="p-2 text-foreground hover:text-muted-foreground transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {favoriteProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-muted-foreground mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  <p className="text-muted-foreground text-sm mb-2">
                    You haven't added any favorites yet.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Browse our collection and click the heart icon to save items you love.
                  </p>
                  <Link
                    to="/category/carpets"
                    onClick={() => setOffCanvasType(null)}
                    className="mt-4 text-sm text-nav-foreground hover:text-nav-hover underline"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {favoriteProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={() => setOffCanvasType(null)}
                      className="flex gap-4 group"
                    >
                      <div className="w-20 h-20 bg-muted/10 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground group-hover:underline truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm font-light text-muted-foreground mt-1">
                          {product.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-border">
                    <Link
                      to="/favorites"
                      onClick={() => setOffCanvasType(null)}
                      className="block text-center text-sm text-nav-foreground hover:text-nav-hover underline"
                    >
                      View All Favorites
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;