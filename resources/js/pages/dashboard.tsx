import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Props {
    deployments: Array<{
        id: number;
        name: string;
        status: string;
        template: {
            name: string;
            icon: string;
        };
        plan: {
            name: string;
        };
        deployed_at: string | null;
    }>;
    balance: number;
    recentTransactions: Array<{
        id: number;
        type: string;
        amount: number;
        description: string;
        created_at: string;
    }>;
    deploymentStats: {
        total: number;
        running: number;
        stopped: number;
        pending: number;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ deployments, balance, recentTransactions, deploymentStats }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'stopped':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'suspended':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
                    <h1 className="text-2xl font-bold mb-2">Welcome to AppFleet! 🚀</h1>
                    <p className="text-blue-100">Deploy and manage your containers with ease</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Balance</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">${balance.toFixed(2)}</p>
                            </div>
                            <div className="text-2xl">💰</div>
                        </div>
                        <div className="mt-4">
                            <Link
                                href={route('balance.create')}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Top up →
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deployments</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{deploymentStats.total}</p>
                            </div>
                            <div className="text-2xl">📦</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Running</p>
                                <p className="text-2xl font-bold text-green-600">{deploymentStats.running}</p>
                            </div>
                            <div className="text-2xl">✅</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{deploymentStats.pending}</p>
                            </div>
                            <div className="text-2xl">⏳</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Deployments */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Deployments</h2>
                                <Link
                                    href={route('deployments.index')}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    View all →
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {deployments.length > 0 ? (
                                <div className="space-y-4">
                                    {deployments.map((deployment) => (
                                        <div key={deployment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{deployment.template.icon}</span>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{deployment.name}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {deployment.template.name} • {deployment.plan.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                                                {deployment.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-2">🚀</div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">No deployments yet</p>
                                    <Link
                                        href={route('deployments.create')}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Create First Deployment
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
                                <Link
                                    href={route('balance.index')}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    View all →
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {recentTransactions.length > 0 ? (
                                <div className="space-y-4">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">
                                                    {transaction.type === 'credit' ? '💰' : '💸'}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {new Date(transaction.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`font-medium ${
                                                transaction.type === 'credit' 
                                                    ? 'text-green-600' 
                                                    : 'text-red-600'
                                            }`}>
                                                {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-2">💳</div>
                                    <p className="text-gray-600 dark:text-gray-400">No transactions yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href={route('deployments.create')}
                        className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                        <div className="text-3xl mb-2">🚀</div>
                        <h3 className="font-semibold mb-1">New Deployment</h3>
                        <p className="text-blue-100 text-sm">Deploy a new service or database</p>
                    </Link>

                    <Link
                        href={route('balance.create')}
                        className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors text-center"
                    >
                        <div className="text-3xl mb-2">💰</div>
                        <h3 className="font-semibold mb-1">Top Up Balance</h3>
                        <p className="text-green-100 text-sm">Add funds to your account</p>
                    </Link>

                    <Link
                        href={route('deployments.index')}
                        className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors text-center"
                    >
                        <div className="text-3xl mb-2">📊</div>
                        <h3 className="font-semibold mb-1">Manage Deployments</h3>
                        <p className="text-purple-100 text-sm">View and control your services</p>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}