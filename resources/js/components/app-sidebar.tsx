import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookCheck, LayoutGrid, Search, Utensils } from 'lucide-react';
import AppLogo from './app-logo';

interface User {
    name: string;
    email: string;
    role?: { role_name: string }; 
    roles?: { role_name: string }; 
}

interface SharedProps {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

const AdminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Management Reservasi',
        href: '/admin/reservation',
        icon: BookCheck,
    },
    {
        title: 'Management Restoran',
        href: '/admin/restaurants',
        icon: Utensils,
    },
];

// user
const UserNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Reservasi Saya',
        href: '/my-reservations',
        icon: BookCheck,
    },
    {
        title: 'Cari Restoran',
        href: '#',
        icon: Search,
    },
];

const footerNavItems: NavItem[] = [
    
];

export function AppSidebar() {

    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;


    const roleRelation = user?.role || user?.roles;
    const userRoleName = roleRelation?.role_name;

    const isSuperAdmin = userRoleName === 'SuperAdmin';
    const isAdmin = userRoleName === 'Admin';

    const currentNavItems = (isAdmin || isSuperAdmin) ? AdminNavItems : UserNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={currentNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>

        </Sidebar>
    );
}