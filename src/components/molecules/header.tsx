import React from "react";
import LoginNav from "./LoginNav";
import Navigation from "./Navigation";
import Logo from "../atoms/Logo";

const Header = () => {
  return (
    <header className="flex flex-row items-center justify-between p-4 bg-brand-gray-100 h-[67px]">
      <Logo />
      <Navigation />
      <LoginNav />
    </header>
  );
};

export default Header;
