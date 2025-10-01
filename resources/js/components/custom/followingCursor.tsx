import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  let lastX = 0;
  let lastY = 0;
  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const innerCursor = cursor.querySelector(".inner-cursor") as HTMLElement | null;
    if (!innerCursor) return;

    const moveCursor = (e: MouseEvent) => {
      const widthCursor = cursor.offsetWidth / 2;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      gsap.to(cursor, {
        duration: 0.55,
        x: e.clientX - widthCursor,
        y: e.clientY - widthCursor,
        ease: "power2.out",
      });

      if (distance > 20) {
        gsap.to(cursor, { scale: 0.8, duration: 0.25, ease: "power2.out" });
      }

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        gsap.to(cursor, { scale: 1, duration: 0.2, ease: "power2.out" });
      }, 40);

      lastX = e.clientX;
      lastY = e.clientY;
    };

    const homeEl = document.querySelector(".overlay-vid-home");
    if (homeEl) {
      homeEl.addEventListener("mouseenter", () => {
        innerCursor.classList.add("active");
        console.log("active");
      });
      homeEl.addEventListener("mouseleave", () => {
        innerCursor.classList.remove("active");
      });
    }

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      if (homeEl) {
        homeEl.removeEventListener("mouseenter", () =>
          innerCursor.classList.add("active")
        );
        homeEl.removeEventListener("mouseleave", () =>
          innerCursor.classList.remove("active")
        );
      }
    };
  }, []);

  return (
    <div id="cursor" ref={cursorRef}>
      <div className="inner-cursor flex">
        <img src="/asset/play.png" alt="play" className="w-[30%] h-[30%]" />
      </div>
    </div>
  );
};

export default Cursor;
