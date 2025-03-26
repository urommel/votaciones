import { usePage } from '@inertiajs/react';

export function Header() {
  const { auth } = usePage().props as any;

  return (
    <div className="flex items-center justify-between h-16 px-8 bg-white border-b">
      <div className="w-96">
        <input
          type="search"
          placeholder="Buscar..."
          className="w-full px-3 py-2 text-sm bg-gray-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-azul"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full bg-theme-gris-100">
            {auth.user.avatar ? (
              <img 
                src={auth.user.avatar} 
                alt={auth.user.name}
                className="object-cover w-full h-full" 
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-lg font-semibold text-theme-azul bg-theme-gris-100">
                {auth.user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900">{auth.user.name}</p>
            <p className="text-sm text-gray-500">{auth.user.role || 'Usuario'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
