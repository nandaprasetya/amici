import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { auth } = usePage().props;
    const user = auth.user;


    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src="/asset/amici-logo-white.png" alt="" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {user ? user.name : 'Guest'}
                </span>
            </div>
        </>
    );
}
