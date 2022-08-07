import { FC } from "react";
import Image from "next/image";

const Header: FC = () => {
  return (
    <div className="w-full flex items-center justify-center bg-slate-800 py-6 gap-3">
      <Image
        alt="earthquake map logo"
        src="/favicon.png"
        height={24}
        width={24}
      />
      <p className="text-white text-xl font-bold underline decoration-orange-400 underline-offset-4 decoration-2">
        Earthquake Map
      </p>
    </div>
  );
};

export default Header;
