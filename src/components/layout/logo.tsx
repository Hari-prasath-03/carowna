import Image from "next/image";
import React from "react";
import logoImg from "@/assets/logo-removebg-preview.png";

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 50, height = 50 }) => (
  <div className="flex items-center gap-2 min-w-10">
    <Image src={logoImg} alt="logo" width={width} height={height} />
  </div>
);

export default Logo;
