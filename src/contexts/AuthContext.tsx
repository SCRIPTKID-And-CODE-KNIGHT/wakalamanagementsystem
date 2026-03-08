import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AppRole = "admin" | "staff";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: AppRole;
  loading: boolean;
  userOfficeId: string | null;
  profile: { full_name: string | null; avatar_url: string | null } | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: "staff",
  loading: true,
  userOfficeId: null,
  profile: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>("staff");
  const [loading, setLoading] = useState(true);
  const [userOfficeId, setUserOfficeId] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);

  const fetchUserData = async (userId: string) => {
    // Fetch role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    const isAdmin = roles?.some(r => r.role === "admin");
    setRole(isAdmin ? "admin" : "staff");

    // Fetch profile
    const { data: prof } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("user_id", userId)
      .single();
    setProfile(prof);

    // Fetch office assignment (for staff)
    if (!isAdmin) {
      const { data: staffRow } = await supabase
        .from("staff")
        .select("office_id")
        .eq("user_id", userId)
        .single();
      setUserOfficeId(staffRow?.office_id ?? null);
    } else {
      setUserOfficeId(null);
    }
  };

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(() => fetchUserData(session.user.id), 0);
        } else {
          setRole("staff");
          setProfile(null);
          setUserOfficeId(null);
        }
        setLoading(false);
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, role, loading, userOfficeId, profile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
