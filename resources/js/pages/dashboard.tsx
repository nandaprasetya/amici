import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const categories = [
        {
            title: 'Hungry Burger',
            description:
                'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
            image: '/asset/burger.png',
            color: 'from-orange-500 to-red-400',
        },
        {
            title: 'Starter',
            description: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
            image: '/asset/starter.png',
            color: 'from-pink-400 to-rose-400',
        },
        {
            title: 'Dessert',
            description: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
            image: '/asset/icecream.png',
            color: 'from-blue-300 to-indigo-300',
        },
        {
            title: 'Fast Food',
            description: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
            image: '/asset/pizza.png',
            color: 'from-teal-400 to-sky-400',
        },
        {
            title: 'Main Course',
            description: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
            image: '/asset/maincourse.png',
            color: 'from-cyan-300 to-blue-300',
        },
        {
            title: 'Beverages',
            description: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
            image: '/asset/beverage.png',
            color: 'from-purple-300 to-violet-300',
        },
        {
            title: 'Indian Foods',
            description: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
            image: '/asset/indian.png',
            color: 'from-orange-400 to-amber-400',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-screen text-black dark:text-white px-6 py-10">
                <h2 className="text-3xl font-bold mb-8">Menu Category</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className={`relative p-5 rounded-xl bg-gradient-to-br ${cat.color} shadow-lg text-white flex flex-col justify-between overflow-hidden transition-transform hover:scale-105 duration-300`}
                        >
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{cat.title}</h3>
                                <p className="text-sm mb-4 opacity-90">{cat.description}</p>
                            </div>
                            <div className="flex justify-between items-end mt-auto">
                                <button className="bg-white text-black font-semibold text-sm px-4 py-1.5 rounded-full hover:bg-black hover:text-white duration-300">
                                    View Items
                                </button>
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="absolute right-0 bottom-0 w-28 object-contain transform translate-x-6 translate-y-6 opacity-90"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
