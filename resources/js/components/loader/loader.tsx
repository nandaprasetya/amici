import React from "react";
import { useEffect, useState } from "react";
import { gsap } from "gsap";

const Loader: React.FC = () => {
    const [hideLoader, setHideLoader] = useState(false);

    useEffect(() => {
        gsap.to(".vid-loader-animation", {
            opacity: 1,
            scale:1,
            duration: 2,
        });
        gsap.to(".loader-animation", {
            opacity: 0,
            duration: 0.5,
            delay: 2.6,
            onComplete: () => setHideLoader(true),
        });
    }, []);

    return (
        <div className={`flex w-full h-screen bg-white items-center justify-center min-h-screen loader-animation fixed top-[0px] z-[110] ${hideLoader ? "hidden" : "flex"}`}>
            <video autoPlay muted src="/asset/vid-loading.mp4" className="w-[250px] h-[250px] vid-loader-animation"></video>
        </div>
    );
};

export default Loader;
