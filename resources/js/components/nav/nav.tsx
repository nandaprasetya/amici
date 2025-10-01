export default function Navbar() {
    return(
        <nav className="w-full h-fit py-[24px] px-[32px] fixed z-[100] top-[0px] left-[0px] flex items-center justify-between">
            <img src="/asset/amici-logo-white.png" alt="Logo" className="w-[88px] h-fit" />
            <div className="nav-link w-fit flex">
                <a href="" className="w-fit text-[16px] mx-[16px] text-[#FFF]">Home</a>
                <a href="" className="w-fit text-[16px] mx-[16px] text-[#FFF]">About</a>
                <a href="" className="w-fit text-[16px] mx-[16px] text-[#FFF]">Restaurant</a>
                <a href="" className="w-fit text-[16px] mx-[16px] text-[#FFF]">Gallery</a>
            </div>
            <div className="nav-right-link flex items-center">
                <a href="" className="text-[#FFF]">SIGN IN</a>
                <a href="" className="px-[16px] py-[10px] border-2 border-[#f9f6f1] ml-[16px] text-[#FFF]">Reservation</a>
            </div>
        </nav>
    )
}