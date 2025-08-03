import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Balance',
        href: '/balance',
    },
    {
        title: 'Top Up',
        href: '/balance/top-up',
    },
];

export default function TopUpBalance() {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
    });

    const quickAmounts = [10, 25, 50, 100];

    const handleQuickAmount = (amount: number) => {
        setData('amount', amount.toString());
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('balance.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Top Up Balance" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Top Up Balance 💳</h1>
                    <p className="text-gray-600 dark:text-gray-400">Add funds to your AppFleet account</p>
                </div>

                <div className="max-w-md mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-3">💰</div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Add Funds</h2>
                            <p className="text-gray-600 dark:text-gray-400">Choose an amount to add to your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Quick Amount Buttons */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Quick Select
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {quickAmounts.map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => handleQuickAmount(amount)}
                                            className={`px-4 py-3 rounded-lg border font-medium transition-colors ${
                                                data.amount === amount.toString()
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                                            }`}
                                        >
                                            ${amount}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Custom Amount
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 dark:text-gray-400">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        max="1000"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
                                )}
                            </div>

                            {/* Payment Info */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-3">
                                    <div className="text-blue-600 dark:text-blue-400 text-lg">ℹ️</div>
                                    <div className="text-sm text-blue-800 dark:text-blue-200">
                                        <p className="font-medium mb-1">Payment Processing</p>
                                        <p>This is a demo environment. Funds will be added instantly to your account for testing purposes.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            {data.amount && parseFloat(data.amount) > 0 && (
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Amount to add:</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                                            ${parseFloat(data.amount).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || !data.amount || parseFloat(data.amount) <= 0}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                            >
                                {processing ? 'Processing...' : `💳 Add $${data.amount || '0.00'}`}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}