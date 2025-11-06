import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function AboutHome() {
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
        const smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1.2,
            effects: true,
        });

        return () => {
            smoother.kill();
        };
    }, []);

    return (
        <div
            id="about-section"
            className="w-full min-h-screen flex flex-col md:flex-row justify-evenly items-center py-[60px] px-[5%] bg-[#f9f6f1]"
        >
            <div className="w-full md:w-[23%] text-black text-xl md:text-3xl font-montserrat leading-relaxed">
                <p>
                    We are a place where delicious food, a warm atmosphere, and
                    togetherness come together as one. More than just a restaurant, we are
                    a culinary destination.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full md:w-[45%]">
                <div className="outer-img-about col-span-1 aspect-[4/5] overflow-hidden rounded-2xl translate-y-[10%]">
                    <img
                        src="/asset/about-1.jpg"
                        alt="about-1"
                        className="w-full h-full object-cover scale-150 opacity-50"
                    />
                </div>

                <div className="outer-img-about col-span-1 aspect-[4/5] overflow-hidden rounded-2xl -translate-y-[-10%]">
                    <img
                        src="/asset/about-2.jpg"
                        alt="about-2"
                        className="w-full h-full object-cover scale-150 opacity-50"
                    />
                </div>


                <div className="outer-img-about col-span-2 aspect-[5/3] overflow-hidden rounded-2xl translate-y-[15%]">
                    <img
                        src="/asset/about-3.png"
                        alt="about-3"
                        className="w-full h-full object-cover scale-150 opacity-50"
                    />
                </div>
            </div>

            <div className="w-full md:w-[23%] text-black text-base md:text-xl flex items-end mt-[40px] md:mt-0">
                <p>
                    Here, you can explore flavors, relax with friends, or simply enjoy an
                    atmosphere filled with energy and happiness.
                </p>
            </div>
        </div>
    );
}
