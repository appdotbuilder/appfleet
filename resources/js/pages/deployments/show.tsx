import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Props {
    deployment: {
        id: number;
        name: string;
        status: string;
        custom_domain: string | null;
        connection_info: string | null;
        environment_variables: Record<string, string> | null;
        port_mappings: Record<string, number> | null;
        deployed_at: string | null;
        created_at: string;
        template: {
            name: string;
            icon: string;
            type: string;
            description: string;
        };
        plan: {
            name: string;
            description: string;
            price_per_hour: number;
            cpu_cores: number;
            memory_mb: number;
            disk_gb: number;
        };
        server: {
            name: string;
            location: string;
            ip_address: string;
        };
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
    {
        title: 'Details',
        href: '#',
    },
];

export default function DeploymentShow({ deployment }: Props) {
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

    const handleAction = (action: string) => {
        router.patch(route(`deployments.${action}`, deployment.id), { action }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this deployment? This action cannot be undone.')) {
            router.delete(route('deployments.destroy', deployment.id));
        }
    };

    const formatMemory = (mb: number) => {
        return mb >= 1024 ? `${(mb / 1024).toFixed(1)}GB` : `${mb}MB`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Deployment: ${deployment.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">{deployment.template.icon}</span>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{deployment.name}</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {deployment.template.name} • {deployment.plan.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deployment.status)}`}>
                            {deployment.status}
                        </span>
                        <Link
                            href={route('deployments.edit', deployment.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Edit
                        </Link>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    {deployment.status === 'running' && (
                        <>
                            <button
                                onClick={() => handleAction('stop')}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                ⏹️ Stop
                            </button>
                            <button
                                onClick={() => handleAction('restart')}
                                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                                🔄 Restart
                            </button>
                            <button
                                onClick={() => handleAction('suspend')}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                ⏸️ Suspend
                            </button>
                        </>
                    )}
                    {deployment.status === 'stopped' && (
                        <button
                            onClick={() => handleAction('start')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            ▶️ Start
                        </button>
                    )}
                    {(deployment.status === 'running' || deployment.status === 'stopped') && (
                        <button
                            onClick={() => handleAction('restart')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            🔄 Restart
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        🗑️ Delete
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Connection Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            🔗 Connection Information
                        </h2>
                        
                        {deployment.connection_info ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Connection URL
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={deployment.connection_info}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                        />
                                        <button
                                            onClick={() => navigator.clipboard.writeText(deployment.connection_info!)}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            📋 Copy
                                        </button>
                                    </div>
                                </div>

                                {deployment.custom_domain && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Custom Domain
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={deployment.custom_domain}
                                                readOnly
                                                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                            />
                                            <a
                                                href={`https://${deployment.custom_domain}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                            >
                                                🔗 Open
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">⏳</div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Connection information will be available once the deployment is running
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Deployment Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            📋 Deployment Details
                        </h2>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Template:</span>
                                <span className="col-span-2 text-sm text-gray-900 dark:text-white">
                                    {deployment.template.name}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                                <span className="col-span-2 text-sm text-gray-900 dark:text-white capitalize">
                                    {deployment.template.type}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Plan:</span>
                                <span className="col-span-2 text-sm text-gray-900 dark:text-white">
                                    {deployment.plan.name}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Server:</span>
                                <span className="col-span-2 text-sm text-gray-900 dark:text-white">
                                    {deployment.server.name} ({deployment.server.location})
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                                <span className="col-span-2 text-sm text-gray-900 dark:text-white">
                                    {new Date(deployment.created_at).toLocaleString()}
                                </span>
                            </div>
                            {deployment.deployed_at && (
                                <div className="grid grid-cols-3 gap-3">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Deployed:</span>
                                    <span className="col-span-2 text-sm text-gray-900 dark:text-white">
                                        {new Date(deployment.deployed_at).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resource Allocation */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            💻 Resource Allocation
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">CPU Cores</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {deployment.plan.cpu_cores} core{deployment.plan.cpu_cores > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">RAM</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {formatMemory(deployment.plan.memory_mb)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {deployment.plan.disk_gb}GB SSD
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Cost</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    ${deployment.plan.price_per_hour.toFixed(4)}/hour
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Environment Variables */}
                    {deployment.environment_variables && Object.keys(deployment.environment_variables).length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                🔧 Environment Variables
                            </h2>
                            <div className="space-y-3">
                                {Object.entries(deployment.environment_variables).map(([key, value]) => (
                                    <div key={key} className="grid grid-cols-3 gap-3">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {key}:
                                        </span>
                                        <span className="col-span-2 text-sm text-gray-900 dark:text-white font-mono bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                                            {key.toLowerCase().includes('password') || key.toLowerCase().includes('secret') 
                                                ? '•'.repeat(8) 
                                                : value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}