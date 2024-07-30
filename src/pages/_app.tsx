import { useEffect } from "react";
import { AppProps } from "next/app";
import { useAuthStore } from "@/store/auth";
import { createClient } from "@/utils/supabase/server";
import "@/app/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, [setUser]);

  return <Component {...pageProps} />;
}

export default MyApp;
