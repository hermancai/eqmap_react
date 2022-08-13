import { FC } from "react";
import Image from "next/image";

const Footer: FC = () => {
  return (
    <div className="w-full flex bg-slate-800 justify-between px-6 py-3 mt-6">
      <p className="font-light text-white">
        &copy; {new Date().getFullYear()}{" "}
        <a
          className="underline"
          href="https://hermancai.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Herman Cai
        </a>
      </p>
      <a
        className="h-[24px]"
        href="https://github.com/hermancai/eqmap_react"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          alt="github logo"
          src="/GitHub-Mark-Light-64px.png"
          height={24}
          width={24}
        />
      </a>
    </div>
  );
};

export default Footer;
