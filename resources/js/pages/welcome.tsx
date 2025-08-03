import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Props {
    templates: Array<{
        id: number;
        name: string;
        description: string;
        icon: string;
        type: string;
    }>;
    plans: Array<{
        id: number;
        name: string;
        description: string;
        price_per_hour: number;
        cpu_cores: number;
        memory_mb: number;
        disk_gb: number;
    }>;
    [key: string]: unknown;
}

export default function Welcome({ templates, plans }: Props) {
    const { auth } = usePage<SharedData>().props;

    const formatMemory = (mb: number) => {
        return mb >= 1024 ? `${(mb / 1024).toFixed(1)}GB` : `${mb}MB`;
    };

    return (
        <>
            <Head title="AppFleet - Container Deployment Platform">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                {/* Header */}
                <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm dark:bg-gray-900/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    🚀 AppFleet
                                </h1>
                            </div>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-5xl font-bold text-gray-900 mb-6 dark:text-white">
                            Deploy containers in <span className="text-blue-600">seconds</span> ⚡
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto dark:text-gray-300">
                            AppFleet makes it easy to deploy and manage your services and databases in isolated containers. 
                            Choose from our templates, select a plan, and deploy instantly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {!auth.user && (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                                    >
                                        Start Deploying Now 🚀
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-semibold text-lg dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800"
                                    >
                                        Log In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
                    <div className="max-w-6xl mx-auto">
                        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 dark:text-white">
                            ✨ Why choose AppFleet?
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <div className="text-4xl mb-4">⚡</div>
                                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Lightning Fast</h4>
                                <p className="text-gray-600 dark:text-gray-300">Deploy containers in seconds with our optimized infrastructure</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="text-4xl mb-4">🔒</div>
                                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Isolated & Secure</h4>
                                <p className="text-gray-600 dark:text-gray-300">Each deployment runs in its own isolated container</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="text-4xl mb-4">💰</div>
                                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Pay As You Go</h4>
                                <p className="text-gray-600 dark:text-gray-300">Only pay for what you use with hourly billing</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Templates */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 dark:text-white">
                            🛠️ Popular Templates
                        </h3>
                        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {templates.map((template) => (
                                <div key={template.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow dark:bg-gray-700">
                                    <div className="text-2xl mb-2">{template.icon}</div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{template.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">{template.type}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
                    <div className="max-w-6xl mx-auto">
                        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 dark:text-white">
                            💎 Simple Pricing
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {plans.map((plan) => (
                                <div key={plan.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow dark:border-gray-600">
                                    <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{plan.name}</h4>
                                    <div className="text-2xl font-bold text-blue-600 mb-4">
                                        ${plan.price_per_hour.toFixed(4)}/hr
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <li>🖥️ {plan.cpu_cores} CPU Core{plan.cpu_cores > 1 ? 's' : ''}</li>
                                        <li>💾 {formatMemory(plan.memory_mb)} RAM</li>
                                        <li>💿 {plan.disk_gb}GB Storage</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-3xl font-bold text-gray-900 mb-6 dark:text-white">
                            Ready to deploy? 🚀
                        </h3>
                        <p className="text-xl text-gray-600 mb-8 dark:text-gray-300">
                            Join thousands of developers who trust AppFleet for their container deployments.
                        </p>
                        {!auth.user && (
                            <Link
                                href={route('register')}
                                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-xl"
                            >
                                Get Started Free 🎉
                            </Link>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto text-center">
                        <p className="text-gray-400">
                            Built with ❤️ by{' '}
                            <a 
                                href="https://app.build" 
                                target="_blank" 
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                app.build
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}