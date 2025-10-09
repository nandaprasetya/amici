import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);
export default function BannerHome(){
    useEffect(() => {
    gsap.to(".right-hand", {
      scrollTrigger: {
        trigger: ".new-menu",
        scrub: true,
        start: "70% 100%",
        toggleActions: "restart pause reverse none",
      },
      y: "-60%",
      rotate: "40deg",
      duration: 3,
      ease: "power2.out",
    });
  }, []);
    return(
        <div className="new-menu w-full min-h-screen relative overflow-hidden">
            <img src="/asset/new-menu-right.png" className="right-hand w-full absolute z-[2]" alt="" />
            <img src="/asset/new-menu-left.png" className="w-full" alt="" />
        </div>
    )
}