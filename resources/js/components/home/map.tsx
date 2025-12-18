import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { CRS } from "leaflet";
import "leaflet/dist/leaflet.css";

const TILE_SIZE = 1200;
const GRID_SIZE = 3;
const MAP_SIZE = TILE_SIZE * GRID_SIZE; // 2048

const bounds: [[number, number], [number, number]] = [
    [0, 0],
    [MAP_SIZE, MAP_SIZE],
];

const iconFood = new L.Icon({
    iconUrl: "/icons/food.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const iconCamera = new L.Icon({
    iconUrl: "/icons/camera.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

export default function Map() {
    return (
        <section className="bg-[#f9f6f1] py-12 flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl font-semibold text-center mb-6">
                Amici Culinary City
            </h1>

            <div className="w-[90%] md:w-[80%] h-[600px] rounded-2xl overflow-hidden shadow-lg">
                <MapContainer
                    crs={CRS.Simple}
                    bounds={bounds}
                    maxBounds={bounds}
                    maxBoundsViscosity={1.0}
                    zoom={-1}
                    minZoom={-1}
                    maxZoom={0}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                    >
                    <TileLayer
                        url="/asset/map/0/{x}/{y}.png"
                        tileSize={1200}
                        bounds={bounds}
                        noWrap={true}
                    />

                    <Marker position={[900, 1100]} icon={iconFood}>
                        <Popup>Amici Restaurant</Popup>
                    </Marker>

                    <Marker position={[600, 1500]} icon={iconCamera}>
                        <Popup>Photo Spot Garden</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </section>
    );
}
