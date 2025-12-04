import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Loader from "@/components/loader/loader";
import Navbar from "@/components/nav/nav";
import { NavFooter } from '@/components/nav-footer';
import { gsap } from "gsap";
// import RecomedationMenu from '@/components/home/recomendation-menu';
import Mission from '@/components/home/mission';
import Map from '@/components/home/map';
import Cursor from '@/components/custom/followingCursor';
import AboutHome from '@/components/home/about-home';
import BannerHome from '@/components/home/banner-home';
import AwardsHome from '@/components/home/awards-home';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const year = new Date();
    const currentYear = year.getFullYear();
  
    return (
        <>
        <Cursor></Cursor>
        <Navbar></Navbar>
        <Loader></Loader>
         <div className="page-content bg-[#f9f6f1] w-full h-full min-h-screen relative z-[1]">
            <div className='w-full h-screen relative flex home'>
                <div className="absolute z-[3] flex w-fit h-fit px-[12px] py-[12px] rounded-[16px] bg-white right-[16px] bottom-[16px]">
                    <img src="/asset/img-pizza.jpg" alt="img pizza" className='w-[140px] rounded-[8px]' />
                    <div className="text-home flex flex-col justify-between mx-[20px] text-black">
                        <h1 className='font-medium text-[20px]'>Book a table and enjoy <br /> your food right now.</h1>
                        <a href="/reservation" className='px-[16px] py-[6px] group h-[38px] overflow-hidden border border-black rounded-[24px] duration-[0.5s] w-fit hover:bg-black'>
                            <div className="inner-link w-fit h-fit group-hover:-translate-y-[50%] duration-[0.5s] ease-out text-black">
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
            {/* <RecomedationMenu /> */}
            <Mission />
            <Map />
            <BannerHome />
            <AwardsHome />
         </div>
          <footer className="bg-white shadow-sm">
                <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                            <img src="/asset/amici-logo.png" className="h-24" alt="Amici Logo" />
                        </a>
                        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-black sm:mb-0">
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">Home</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">About</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6">Restaurant</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">Gallery</a>
                            </li>
                        </ul>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <span className="block text-sm text-black sm:text-center">© {currentYear} <a href="/" className="hover:underline">Amici</a>. All Rights Reserved.</span>
                </div>
            </footer>


        </>
    );
}
