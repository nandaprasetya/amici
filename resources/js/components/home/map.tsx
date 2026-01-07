import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import MapMarker from "./map-marker";
import type { Restaurant } from "@/types/restaurant";

type MapProps = {
    restaurants: Restaurant[];
};

export default function Map({ restaurants }: MapProps) {
    return (
        <section className="py-32 bg-[#f9f6f1] mx-10">
            <div className="max-w-[1400px] mx-auto">

                {/* MAP VIEWPORT */}
                <div className="relative w-full h-[80vh] overflow-hidden rounded-3xl bg-white">

                    {/* ZOOM CONTROLS (FIXED, TIDAK IKUT DRAG) */}
                    <div className="absolute top-6 right-6 z-50 flex flex-col gap-2">
                        <button className="map-btn" id="zoom-in">+</button>
                        <button className="map-btn" id="zoom-out">−</button>
                    </div>

                    <TransformWrapper
                        minScale={0.8}
                        maxScale={3}
                        initialScale={1}
                        centerOnInit
                        limitToBounds={false}
                        panning={{ velocityDisabled: true }}
                        wheel={{ step: 0.08 }}
                        pinch={{ step: 5 }}
                    >
                        {({ zoomIn, zoomOut }) => (
                            <>
                                {/* ZOOM CONTROLS */}
                                <div className="absolute top-6 right-6 z-50 flex flex-col gap-2">
                                    <button onClick={() => zoomIn()} className="map-btn">+</button>
                                    <button onClick={() => zoomOut()} className="map-btn">−</button>
                                </div>

                                <TransformComponent>
                                    <div className="relative w-[2600px] aspect-[16/9]">
                                        <img
                                            src="/asset/map-foodcourt.png"
                                            className="w-full h-full object-contain select-none"
                                            draggable={false}
                                        />

                                        {restaurants.map((r) => (
                                            <MapMarker key={r.restaurant_id} restaurant={r} />
                                        ))}
                                    </div>
                                </TransformComponent>
                            </>
                        )}
                    </TransformWrapper>

                </div>
            </div>
        </section>
    );
}
