import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full h-fit py-[24px] px-[32px] fixed z-[100] top-0 left-0 flex items-center justify-between transition-all duration-500 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    > 
      <img
        src={`${
        scrolled ? "/asset/amici-logo.png" : "/asset/amici-logo-white.png"
        }`}
        alt="Logo"
        className="w-[88px] h-fit transition-all duration-500"
      />

      <div className="nav-link w-fit flex">
        {["Home", "About", "Restaurant", "Gallery"].map((item, index) => (
          <a
            key={index}
            href="#"
            className={`w-fit text-[16px] mx-[16px] transition-all duration-500 ${
              scrolled ? "text-[#000]" : "text-[#FFF]"
            }`}
          >
            {item}
          </a>
        ))}
      </div>

      <div className="nav-right-link flex items-center">
        <a
          href="/register"
          className={`transition-all duration-500 ${
            scrolled ? "text-[#000]" : "text-[#FFF]"
          }`}
        >
          SIGN IN
        </a>
        <a
          href="/reservation"
          className={`px-[16px] py-[10px] border-2 ml-[16px] transition-all duration-500 ${
            scrolled
              ? "border-[#000] text-[#000]"
              : "border-[#f9f6f1] text-[#FFF]"
          }`}
        >
          Reservation
        </a>
      </div>
    </nav>
  );
}
