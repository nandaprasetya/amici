import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);
export default function AboutHome(){
    useEffect(() => {
        gsap.to(".outer-img-about img", {
        scrollTrigger: {
            trigger: ".outer-img-about",
            start: "top 90%",
            toggleActions: "play none none none",
        },
        scale: 1,
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        });
    }, []);
    
    useEffect(() => {
        gsap.to(".outer-img-about-2 img", {
        scrollTrigger: {
            trigger: ".outer-img-about-2",
            start: "top 90%",
            toggleActions: "play none none none",
        },
        scale: 1,
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        });
    }, []);
    return(
        <div className="w-full min-h-screen flex justify-evenly py-[40px] px-[3%]">
            <div className="left-about w-[23%] h-fit pt-[5%]">
                <p>We are a place where delicious food, a warm atmosphere, and togetherness come together as one. More than just a restaurant, we are a culinary destination.</p>
            </div>
            <div className="center-about w-[45%] min-h-full flex justify-around items-center ">
                <div className="outer-img-about w-[45%] aspect-4/5 -translate-y-[15%] overflow-hidden">
                    <img src="/asset/about-1.jpg" alt="" className="w-full h-full object-cover scale-150 opacity-[0.5]"/>
                </div>
                <div className="outer-img-about-2 w-[45%] aspect-4/5 translate-y-[15%] overflow-hidden">
                    <img src="/asset/about-2.jpg" alt="" className="w-full h-full object-cover scale-150 opacity-[0.5]"/>
                </div>
            </div>
            <div className="left-about w-[23%] min-h-full flex items-end pb-[5%]">
                <p>Here, you can explore flavors, relax with friends, or simply enjoy an atmosphere filled with energy and happiness.</p>
            </div>
        </div>
    )
}