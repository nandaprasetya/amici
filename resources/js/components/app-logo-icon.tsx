

export default function AppLogoIcon() {
    return (
        <>
            <img
                src="/asset/amici-logo.png"
                alt="Amici Logo"
                className="block dark:hidden"
            />

            <img
                src="/asset/amici-logo-white.png"
                alt="Amici Logo"
                className="hidden dark:block"
            />
        </>
    );
}
