import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface Props {
    templates: Array<{
        id: number;
        name: string;
        slug: string;
        description: string;
        icon: string;
        type: string;
        environment_variables: Record<string, string> | null;
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
        title: 'Create',
        href: '/deployments/create',
    },
];

export default function CreateDeployment({ templates, plans }: Props) {
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [envVars, setEnvVars] = useState<Record<string, string>>({});

    const { data, setData, post, processing, errors } = useForm({
        template_id: '',
        plan_id: '',
        name: '',
        custom_domain: '',
        environment_variables: {} as Record<string, string>,
    });

    const handleTemplateSelect = (templateId: number) => {
        const template = templates.find(t => t.id === templateId);
        setSelectedTemplate(templateId);
        setData('template_id', templateId.toString());
        
        if (template?.environment_variables) {
            setEnvVars(template.environment_variables);
            setData('environment_variables', template.environment_variables);
        }
    };

    const handlePlanSelect = (planId: number) => {
        setSelectedPlan(planId);
        setData('plan_id', planId.toString());
    };

    const handleEnvVarChange = (key: string, value: string) => {
        const newEnvVars = { ...envVars, [key]: value };
        setEnvVars(newEnvVars);
        setData('environment_variables', newEnvVars);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('deployments.store'));
    };

    const formatMemory = (mb: number) => {
        return mb >= 1024 ? `${(mb / 1024).toFixed(1)}GB` : `${mb}MB`;
    };

    const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
    const selectedPlanData = plans.find(p => p.id === selectedPlan);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Deployment" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Deployment 🚀</h1>
                    <p className="text-gray-600 dark:text-gray-400">Deploy a new service or database container</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Template Selection */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            1. Choose a Template 🛠️
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                        selectedTemplate === template.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                    onClick={() => handleTemplateSelect(template.id)}
                                >
                                    <div className="text-2xl mb-2">{template.icon}</div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.description}</p>
                                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded capitalize">
                                        {template.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {errors.template_id && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.template_id}</p>
                        )}
                    </div>

                    {/* Plan Selection */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            2. Select a Plan 💎
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                        selectedPlan === plan.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                    onClick={() => handlePlanSelect(plan.id)}
                                >
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                                    <div className="text-xl font-bold text-blue-600 mb-3">
                                        ${plan.price_per_hour.toFixed(4)}/hr
                                    </div>
                                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                        <li>🖥️ {plan.cpu_cores} CPU Core{plan.cpu_cores > 1 ? 's' : ''}</li>
                                        <li>💾 {formatMemory(plan.memory_mb)} RAM</li>
                                        <li>💿 {plan.disk_gb}GB Storage</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                        {errors.plan_id && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.plan_id}</p>
                        )}
                    </div>

                    {/* Configuration */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            3. Configuration ⚙️
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Deployment Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="my-awesome-app"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Custom Domain (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={data.custom_domain}
                                    onChange={(e) => setData('custom_domain', e.target.value)}
                                    placeholder="myapp.com"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                                {errors.custom_domain && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.custom_domain}</p>
                                )}
                            </div>
                        </div>

                        {/* Environment Variables */}
                        {Object.keys(envVars).length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                                    Environment Variables
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(envVars).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-3 gap-3">
                                            <div className="col-span-1">
                                                <input
                                                    type="text"
                                                    value={key}
                                                    readOnly
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => handleEnvVarChange(key, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    {selectedTemplateData && selectedPlanData && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
                                Deployment Summary 📋
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="font-medium text-blue-800 dark:text-blue-300">Template</p>
                                    <p className="text-blue-700 dark:text-blue-400">{selectedTemplateData.name}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800 dark:text-blue-300">Plan</p>
                                    <p className="text-blue-700 dark:text-blue-400">{selectedPlanData.name}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800 dark:text-blue-300">Estimated Cost</p>
                                    <p className="text-blue-700 dark:text-blue-400">
                                        ${selectedPlanData.price_per_hour.toFixed(4)}/hour
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !selectedTemplate || !selectedPlan || !data.name}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {processing ? 'Creating...' : '🚀 Deploy Now'}
                        </button>
                    </div>

                    {'balance' in errors && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-red-700 dark:text-red-400">{errors.balance as string}</p>
                        </div>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}