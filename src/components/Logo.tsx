import logoImage from "@/assets/logo-removebg-preview.png";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Image src={logoImage} alt="logo" width={50} height={50} />
    </div>
  );
};

export default Logo;
