export default function AboutHome(){
    return(
        <div className="w-full min-h-screen flex justify-evenly py-[40px] px-[3%]">
            <div className="left-about w-[23%] h-fit pt-[5%]">
                <p>We are a place where delicious food, a warm atmosphere, and togetherness come together as one. More than just a restaurant, we are a culinary destination.</p>
            </div>
            <div className="center-about w-[45%] min-h-full flex justify-around items-center ">
                <img src="/asset/about-1.jpg" alt="" className="w-[45%] -translate-y-[15%]"/>
                <img src="/asset/about-2.jpg" alt="" className="w-[45%] translate-y-[15%]"/>
            </div>
            <div className="left-about w-[23%] min-h-full flex items-end pb-[5%]">
                <p>Here, you can explore flavors, relax with friends, or simply enjoy an atmosphere filled with energy and happiness.</p>
            </div>
        </div>
    )
}