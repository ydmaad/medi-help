"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import LoginNav from "./LoginNav";
import Navigation from "./navigation";
import Logo from "../atoms/Logo";

const Header = () => {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const checkAndSetUser = async () => {
      if (!user) {
        try {
          const {
            data: { user: authUser },
          } = await supabase.auth.getUser();

          if (authUser) {
            const { data: userData, error } = await supabase
              .from("users")
              .select("*")
              .eq("id", authUser.id)
              .single();

            if (error) {
              console.error("Error fetching user data:", error);
              return;
            }

            if (userData) {
              setUser(userData);
            }
          }
        } catch (error) {
          console.error("Error checking user authentication:", error);
        }
      }
    };

    checkAndSetUser();
  }, []);

  return (
    <header className="relative flex flex-row items-center justify-between p-4 bg-brand-gray-100 h-[67px] shadow-mg">
      <Logo />
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Navigation />
      </div>
      <LoginNav />
    </header>
  );
};

export default Header;
