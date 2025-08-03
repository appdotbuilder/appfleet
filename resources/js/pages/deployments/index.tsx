import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Props {
    deployments: {
        data: Array<{
            id: number;
            name: string;
            status: string;
            template: {
                name: string;
                icon: string;
                type: string;
            };
            plan: {
                name: string;
            };
            server: {
                name: string;
                location: string;
            };
            custom_domain: string | null;
            deployed_at: string | null;
            created_at: string;
        }>;
        links: unknown;
        meta: unknown;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Deployments',
        href: '/deployments',
    },
];

export default function DeploymentsIndex({ deployments }: Props) {
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
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const handleAction = (deploymentId: number, action: string) => {
        router.patch(route(`deployments.${action}`, deploymentId), { action }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Deployments" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Deployments 📦</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your deployed services and databases</p>
                    </div>
                    <Link
                        href={route('deployments.create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        🚀 New Deployment
                    </Link>
                </div>

                {/* Deployments List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                    {deployments.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Service
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Template
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Plan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Server
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {deployments.data.map((deployment) => (
                                        <tr key={deployment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-lg mr-2">{deployment.template.icon}</span>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {deployment.name}
                                                        </div>
                                                        {deployment.custom_domain && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {deployment.custom_domain}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">{deployment.template.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{deployment.template.type}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {deployment.plan.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                                                    {deployment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">{deployment.server.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{deployment.server.location}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(deployment.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('deployments.show', deployment.id)}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                                                    >
                                                        View
                                                    </Link>
                                                    {deployment.status === 'running' && (
                                                        <button
                                                            onClick={() => handleAction(deployment.id, 'stop')}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400"
                                                        >
                                                            Stop
                                                        </button>
                                                    )}
                                                    {deployment.status === 'stopped' && (
                                                        <button
                                                            onClick={() => handleAction(deployment.id, 'start')}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400"
                                                        >
                                                            Start
                                                        </button>
                                                    )}
                                                    {(deployment.status === 'running' || deployment.status === 'stopped') && (
                                                        <button
                                                            onClick={() => handleAction(deployment.id, 'restart')}
                                                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400"
                                                        >
                                                            Restart
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🚀</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No deployments yet</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Get started by deploying your first service or database
                            </p>
                            <Link
                                href={route('deployments.create')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                🚀 Create First Deployment
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}