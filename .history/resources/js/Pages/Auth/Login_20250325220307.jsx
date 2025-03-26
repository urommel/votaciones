import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-[400px] space-y-6 bg-white p-8 shadow-lg rounded-lg">
                <div className="flex justify-center">
                    <img
                        src="/logo-sedipro.png"
                        alt="SEDIPRO"
                        className="w-[150px] h-auto"
                    />
                </div>

                <h1 className="text-2xl font-semibold text-center">
                    Iniciar Sesión
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="tu@email.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="********"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>
                </form>
            </div>
        </div>
    );
}
