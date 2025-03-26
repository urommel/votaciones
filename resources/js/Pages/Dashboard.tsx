import { Head } from '@inertiajs/react';
import { UsersIcon, CalendarIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}

const MetricCard = ({ title, value, icon: Icon, color }: MetricCardProps) => (
    <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-soft">
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
    </div>
);

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <div className="p-8">
                <Head title="Dashboard" />

                <div className="p-8">
                    <h1 className="mb-8 text-2xl font-semibold text-gray-900">
                        Dashboard
                    </h1>

                    {/* Métricas Superiores */}
                    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                        <MetricCard
                            title="Total Miembros"
                            value="150"
                            icon={UsersIcon}
                            color="bg-theme-azul"
                        />
                        <MetricCard
                            title="Eventos Activos"
                            value="8"
                            icon={CalendarIcon}
                            color="bg-theme-morado"
                        />
                        <MetricCard
                            title="Asistencia Promedio"
                            value="85%"
                            icon={ChartPieIcon}
                            color="bg-theme-azul-oscuro"
                        />
                    </div>

                    {/* Sección Inferior */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Asistencia por Área */}
                        <div className="p-6 bg-white rounded-xl shadow-soft">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Asistencia por Área
                            </h2>
                            <div className="h-[300px] flex items-center justify-center text-gray-500">
                                Gráfico de asistencia aquí
                            </div>
                        </div>

                        {/* Próximos Eventos */}
                        <div className="p-6 bg-white rounded-xl shadow-soft">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Próximos Eventos
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-theme-gris-100">
                                    <p className="font-medium text-gray-900">Taller de React</p>
                                    <p className="mt-1 text-sm text-gray-500">15 de Marzo, 2024</p>
                                </div>
                                <div className="p-4 rounded-lg bg-theme-gris-100">
                                    <p className="font-medium text-gray-900">Workshop UX/UI</p>
                                    <p className="mt-1 text-sm text-gray-500">22 de Marzo, 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
