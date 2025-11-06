import RecomendationBox from "./recomendation-box";

export default function RecomedationMenu(){
    return(
        <div className="w-full h-fit py-[80px] px-[3%] flex flex-col">
            <div className="w-full h-fit flex justify-between mb-[40px] text-black font-montserrat">
                <h1 className="w-fit text-[32px] font-medium">Handpicked Just for <br /> You Today Selections</h1>
                <p className="text-[18px] text-end">Enjoy today’s special picks uniquely crafted to match <br /> your mood and elevate every delightful bite.</p>
            </div>
            <div className="area-recomendation flex justify-between">
                <div className="w-[23%]">
                   <RecomendationBox />
                </div>
            </div>
        </div>
    )
}