import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Loader from "@/components/loader/loader";
import Navbar from "@/components/nav/nav";
import { gsap } from "gsap";
import RecomedationMenu from '@/components/home/recomendation-menu';
import Cursor from '@/components/custom/followingCursor';
import AboutHome from '@/components/home/about-home';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
  
    return (
        <>
        <Cursor></Cursor>
        <Navbar></Navbar>
        <Loader></Loader>
         <div className="page-content bg-[#f9f6f1] w-full h-full min-h-screen z-[1]">
            <div className='w-full h-screen relative flex home'>
                <div className="absolute z-[3] flex w-fit h-fit px-[12px] py-[12px] rounded-[16px] bg-white right-[16px] bottom-[16px]">
                    <img src="/asset/img-pizza.jpg" alt="img pizza" className='w-[140px] rounded-[8px]' />
                    <div className="text-home flex flex-col justify-between mx-[20px]">
                        <h1 className='font-medium text-[20px]'>Book a table and enjoy <br /> your food right now.</h1>
                        <a href="" className='px-[16px] py-[6px] group h-[38px] overflow-hidden border border-black rounded-[24px] duration-[0.5s] w-fit hover:bg-black'>
                            <div className="inner-link w-fit h-fit group-hover:-translate-y-[50%] duration-[0.5s] ease-out">
                                <p className='m-0 font-medium text-[16px]'>Make Reservation</p>
                                <p className='m-0 font-medium text-[16px] text-white'>Make Reservation</p>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="overlay-vid-home absolute z-[2] w-full h-full bg-[#00000091] flex items-end px-[5%] py-[30px]">
                    <h1 className='text-white text-[52px] font-regular'>Life’s Better with <br /> Great Food & Friends</h1>
                </div>
                <video autoPlay muted loop src="/asset/vid-company.mp4" className='w-full h-screen object-cover'></video>
            </div>
            <AboutHome />
            <RecomedationMenu />
         </div>
        </>
    );
}
