import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--theme-azul-oscuro)', fontFamily: 'var(--font-sans)' }}>
            <Head title="Iniciar Sesión" />

            <div className="w-full max-w-[400px] space-y-6 bg-white p-8 shadow-lg rounded-lg">
                <div className="flex justify-center">
                    <img
                        src="img/logo-sedipro.png"
                        alt="SEDIPRO"
                        className="w-[150px] h-auto"
                    />
                </div>

                <h1 className="text-2xl font-semibold text-center text-gray-800">
                    Iniciar Sesión
                </h1>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'var(--theme-azul-oscuro)' }}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                            style={{ '--tw-ring-color': 'var(--theme-azul)' } as React.CSSProperties}
                            placeholder="tu@email.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--theme-azul-oscuro)' }}>
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                            style={{ '--tw-ring-color': 'var(--theme-azul)' } as React.CSSProperties}
                            placeholder="********"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm disabled:opacity-50"
                        style={{ 
                            backgroundColor: 'var(--theme-azul)',
                            ':hover': {
                                backgroundColor: 'var(--theme-morado)'
                            }
                        }}
                    >
                        {processing ? (
                            <>
                                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Iniciando sesión...
                            </>
                        ) : (
                            'Iniciar sesión'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
