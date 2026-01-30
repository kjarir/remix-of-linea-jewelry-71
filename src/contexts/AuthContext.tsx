import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist - create it
        await createProfile(userId);
      } else if (error) {
        // Try to create profile anyway
        await createProfile(userId);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      // Silently fail - try to create profile
      try {
        await createProfile(userId);
      } catch (e) {
        // If all fails, set minimal profile
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          setProfile({
            id: userId,
            email: userData.user.email || null,
            full_name: null,
            is_admin: false,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      // Always set is_admin to false - admin is set manually in database
      const profileData: any = {
        id: userId,
        email: userData.user.email || null,
        is_admin: false, // NEVER true - admin must be set manually
      };

      const fullName = userData.user.user_metadata?.full_name;
      if (fullName) {
        profileData.full_name = fullName;
      }

      const { data, error } = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single();

      if (error) {
        // If insert fails (maybe exists), try to fetch
        if (error.code === '23505') {
          const { data: existing } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
          
          if (existing) {
            setProfile(existing);
            return;
          }
        }
        // If can't create, set minimal profile (never admin)
        setProfile({
          id: userId,
          email: userData.user.email || null,
          full_name: null,
          is_admin: false,
        });
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      // Set minimal profile on error (never admin)
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setProfile({
          id: userId,
          email: userData.user.email || null,
          full_name: null,
          is_admin: false,
        });
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }

    if (data.user) {
      setUser(data.user);
      setSession(data.session);
      // Fetch profile in background - don't wait
      fetchProfile(data.user.id).catch(() => {
        // Silently handle
      });
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || "",
        },
      },
    });
    
    if (error) {
      throw error;
    }

    if (data.user) {
      setUser(data.user);
      setSession(data.session);
      // Wait a moment for trigger, then fetch profile
      setTimeout(() => {
        fetchProfile(data.user.id).catch(() => {
          // Silently handle
        });
      }, 500);
    }
  };

  const signOut = async () => {
    setProfile(null);
    setUser(null);
    setSession(null);
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // Ignore errors
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: profile?.is_admin ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
