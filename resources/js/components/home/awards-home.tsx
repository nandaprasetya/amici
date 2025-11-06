import { useEffect } from "react";
import gsap from "gsap";


export default function AwardsHome(){
    useEffect(() => {
    const boxes = document.querySelectorAll(".box-award");

    boxes.forEach((box, index) => {
      const imgs = box.querySelectorAll("img");

      if (imgs.length === 2) {
        gsap.set(imgs[0], { opacity: 1 });
        gsap.set(imgs[1], { opacity: 0 });

        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 0,
          delay: index * 0.1,
        });

        tl.to(imgs[0], { opacity: 0, duration: 1, delay: 5, ease: "power2.inOut" })
          .to(imgs[1], { opacity: 1, duration: 1, ease: "power2.inOut" })
          .to(imgs[1], { opacity: 0, duration: 1, delay: 5, ease: "power2.inOut" })
          .to(imgs[0], { opacity: 1, duration: 1, ease: "power2.inOut" });
      }
    });

  }, []);
    return(
        <div className="w-full h-fit pt-[80px] px-[3%] flex flex-col items-center" id="awards">
            <h1 className="text-[40px] text-black">Awarded for Passion and Perfection</h1>
            <p className="text-center text-black">Each recognition reflects our dedication to crafting <br /> unforgettable dining experiences.</p>
            <div className="area-awards w-full h-fit flex">
                <div className="box-award w-[25%] relative">
                    <img src="/asset/awards-1.png" alt="logo" className="w-full h-full object-contain aspect-square absolute" />
                    <img src="/asset/awards-2.png" alt="logo" className="w-full h-full object-contain aspect-square" />
                </div>
                <div className="box-award w-[25%] relative">
                    <img src="/asset/awards-3.png" alt="logo" className="w-full h-full object-contain aspect-square absolute" />
                    <img src="/asset/awards-4.png" alt="logo" className="w-full h-full object-contain aspect-square" />
                </div>
                <div className="box-award w-[25%] relative">
                    <img src="/asset/awards-5.png" alt="logo" className="w-full h-full object-contain aspect-square absolute" />
                    <img src="/asset/awards-6.png" alt="logo" className="w-full h-full object-contain aspect-square" />
                </div>
                <div className="box-award w-[25%] relative">
                    <img src="/asset/awards-7.png" alt="logo" className="w-full h-full object-contain aspect-square absolute" />
                    <img src="/asset/awards-8.png" alt="logo" className="w-full h-full object-contain aspect-square" />
                </div>
            </div>
        </div>
    )
}