import { useState } from "react";

type Restaurant = {
    restaurant_id: string;
    restaurant_name: string;
    map_x: string;
    map_y: string;
    map_icon: string;
    thumbnail: string;
};

type MapMarkerProps = {
    restaurant: Restaurant;
};

export default function MapMarker({ restaurant }: MapMarkerProps) {

    const [open, setOpen] = useState(false);

    return (
        <div
            className="absolute z-30"
            style={{
                left: `${restaurant.map_x}%`,
                top: `${restaurant.map_y}%`,
                transform: "translate(-50%, -50%)",
            }}
        >

            {/* BUTTON ICON */}
            <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10"
            >
                <img
                    src="/asset/symbol.png"
                    className="w-full h-full hover:scale-110 transition"
                    draggable={false}
                />
            </button>

            {/* INFO CARD */}
            {open && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-lg whitespace-nowrap">
                    <p className="font-semibold text-sm">
                        {restaurant.restaurant_name}
                    </p>
                </div>
            )}
        </div>
    );
}
