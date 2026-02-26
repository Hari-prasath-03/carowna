import logoImage from "@/assets/logo-removebg-preview.png";
import Image from "next/image";
import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 50, height = 50 }) => (
  <div className="flex items-center gap-2">
    <Image src={logoImage} alt="logo" width={width} height={height} />
  </div>
);

export default Logo;
