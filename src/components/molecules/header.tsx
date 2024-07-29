import React from "react";
import LoginNav from "./LoginNav";
import Navigation from "./navigation";
import Logo from "../atoms/Logo";

const Header = () => {
  return (
    <header className="flex flex-row items-center justify-between p-4 bg-gray-100 h-[67px]">
      <Logo />
      <Navigation />
      <LoginNav />
    </header>
  );
};

export default Header;
