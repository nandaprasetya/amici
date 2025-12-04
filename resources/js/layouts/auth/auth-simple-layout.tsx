import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden">

            <video
                autoPlay
                muted
                loop
                src="/asset/vid-login.mp4"
                className="absolute inset-0 h-full w-full object-cover z-[-2]"
            />

            <div className="absolute inset-0 bg-black/40 z-[-1]" />

            <div className="w-full max-w-sm relative z-10">
                <div className="flex flex-col">
                    <div className="flex flex-col items-center">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-18 w-18 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center text-white">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm opacity-90">
                                {description}
                            </p>
                        </div>
                    </div>
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </div>

        </div>
    );
}
