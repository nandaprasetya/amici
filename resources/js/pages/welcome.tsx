import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Loader from "@/components/loader/loader";
import Navbar from "@/components/nav/nav";
import { gsap } from "gsap";

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
  
    return (
        <>
        <Navbar></Navbar>
        <Loader></Loader>
         <div className="page-content bg-[#f9f6f1] w-full h-full min-h-screen z-[1]">
            <div className='w-full h-screen relative flex'>
                <div className="overlay-vid-home absolute z-[2] w-full h-full bg-[#00000091]"></div>
                <video autoPlay muted loop src="/asset/vid-company.mp4" className='w-full h-screen object-cover'></video>
            </div>
         </div>
        </>
    );
}
