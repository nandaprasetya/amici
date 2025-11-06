export default function Mission() {
    return (
        <section className="bg-[#f7f5ef] text-[#1a1a1a] py-20 px-6 md:px-16 lg:px-28">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-2xl md:text-4xl font-light leading-snug">
                    Discover the <span className="font-semibold">passion</span> behind every dish
                    <br /> that makes <span className="font-semibold">Amici special</span>
                </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-2xl overflow-hidden shadow-md">
                    <img
                        src="/asset/mission.png"
                        alt="Amici's Mission"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="bg-[#ece8df] rounded-2xl p-8 md:p-10 shadow-sm">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                        Our Mission and Vision
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-8">
                        At <span className="font-semibold">Amici</span>, we believe in the joy of
                        togetherness through food. Our mission is to create a vibrant
                        food court where people can explore a wide variety of cuisines from
                        different restaurants, all in one welcoming space. We aim to be a
                        hub that connects communities through culinary experiences, bringing
                        flavors, cultures, and friendships together. Through comfort,
                        quality, and collaboration with local restaurants, Amici strives to
                        make every dining experience meaningful and memorable.
                    </p>
                    <div className="text-home flex flex-col justify-between mx-[20px] text-black">

                        <button
                            onClick={() => {
                                const section = document.querySelector("#awards");
                                section?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="px-[16px] py-[6px] group h-[38px] overflow-hidden border border-black rounded-[24px] duration-[0.5s] w-fit hover:bg-black"
                        >
                            <div className="inner-link w-fit h-fit group-hover:-translate-y-[50%] duration-[0.5s] ease-out text-black">
                                <p className="m-0 font-medium text-[16px]">Discover our Awards</p>
                                <p className="m-0 font-medium text-[16px] text-white">Discover our Awards</p>
                            </div>
                        </button>

                    </div>
                </div>
            </div>
        </section>
    );
}
