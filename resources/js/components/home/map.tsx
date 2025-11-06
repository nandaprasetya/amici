import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const iconCamera = new L.Icon({
    iconUrl: "/icons/camera.png",
    iconSize: [32, 32],
});

const iconFood = new L.Icon({
    iconUrl: "/icons/food.png",
    iconSize: [32, 32],
});

export default function Map() {
    return (
        <section className="bg-[#f9f6f1] py-12 flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-semibold text-center mb-6 text-[#372207]">
                Welcome to <span className="text-[#0f172a]">Amici Culinary City</span>
            </h1>

            <div className="w-[90%] md:w-[80%] h-[600px] rounded-2xl overflow-hidden shadow-lg">
                <MapContainer
                    center={[-8.65, 115.2]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="© OpenStreetMap contributors"
                    />
                    <Marker position={[-8.6501, 115.21]} icon={iconFood}>
                        <Popup>Amici Restaurant</Popup>
                    </Marker>
                    <Marker position={[-8.651, 115.205]} icon={iconCamera}>
                        <Popup>Photo Spot Garden</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </section>
    );
}
