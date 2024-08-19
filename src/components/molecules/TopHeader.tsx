"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/utils/supabase/client";
import LoginNav from "./LoginNav";
import Navigation from "./navigation";
import Logo from "../atoms/Logo";
import ImageButton from "../atoms/ImageButton";
import Sidebar from "./SideBar";

const Header = () => {
  const { user, setUser } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  }, [user, setUser]);
  // console.log(user);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 flex desktop:hidden flex-row items-center justify-between p-4 bg-white h-[67px] shadow-md">
        <Logo />
        <ImageButton
          src="/hambergerbtn.svg"
          alt="햄버거 버튼"
          onClick={toggleSidebar}
        />
      </header>
      <header className="fixed top-0 left-0 right-0 z-20 hidden desktop:flex flex-row items-center justify-between p-4 bg-white h-[67px] shadow-md">
        <Logo />
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Navigation />
        </div>
        <LoginNav />
      </header>
      <div className="absolute z-20 desktop:hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </div>
    </>
  );
};

export default Header;
