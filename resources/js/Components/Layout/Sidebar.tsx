import { Link } from '@inertiajs/react';
import { 
  HomeIcon, UsersIcon, BuildingOffice2Icon, BriefcaseIcon,
  AcademicCapIcon, UserCircleIcon, UserGroupIcon,
  ClipboardDocumentCheckIcon, CalendarIcon, CheckBadgeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const routes = [
  {
    label: 'Dashboard',
    icon: HomeIcon,
    href: '/dashboard',
    color: 'text-theme-azul'
  },
  {
    label: 'Usuarios',
    icon: UsersIcon,
    href: '/users',
    color: 'text-theme-morado'
  },
  {
    label: 'Áreas',
    icon: BuildingOffice2Icon,
    href: '/areas',
    color: 'text-theme-azul-oscuro'
  },
  {
    label: 'Cargos',
    icon: BriefcaseIcon,
    href: '/cargos',
    color: 'text-theme-verde'
  },
  {
    label: 'Carreras',
    icon: AcademicCapIcon,
    href: '/carreras',
    color: 'text-theme-naranja'
  },
  {
    label: 'Sedipranos',
    icon: UserGroupIcon,
    href: '/sedipranos',
    color: 'text-theme-azul'
  },
  {
    label: 'Candidatos',
    icon: UserCircleIcon, 
    href: '/candidatos',
    color: 'text-theme-morado'
  },
  {
    label: 'Votaciones',
    icon: ClipboardDocumentCheckIcon, 
    href: '/votaciones',
    color: 'text-theme-rosa'
  },
  {
    label: 'Votos',
    icon: CheckCircleIcon, 
    href: '/votos',
    color: 'text-theme-cyan'
  },
  {
    label: 'Eventos',
    icon: CalendarIcon, 
    href: '/eventos',
    color: 'text-theme-verde'
  },
  {
    label: 'Asistencias',
    icon: CheckBadgeIcon, 
    href: '/asistencias',
    color: 'text-theme-amarillo'
  }
];

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 h-screen bg-white border-r">
      <div className="px-6 py-8 border-b">
        <div className="flex items-center justify-center">
          <img
            src="/img/logo-sedipro.png"
            alt="SEDIPRO"
            className="w-auto h-8"
          />
        </div>
      </div>
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {routes.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm transition-colors
                  hover:bg-gray-50 group
                  ${route().current(item.href.replace('/', ''))
                    ? "bg-theme-azul/10 text-theme-azul font-medium"
                    : "text-gray-600"
                  }`}>
                <item.icon className={`w-5 h-5 mr-3 ${item.color}`} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
