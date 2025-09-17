import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Home
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const routes = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/',
      active: location.pathname === '/',
    },
    {
      label: 'Jobs',
      icon: Briefcase,
      href: '/jobs',
      active: location.pathname.startsWith('/jobs'),
      subRoutes: [
        {
          label: 'Create',
          href: '/jobs/create',
        },
        {
          label: 'Update',
          href: '/jobs/update',
        },
      ],
    },
    {
      label: 'Candidates',
      icon: Users,
      href: '/candidates',
      active: location.pathname.startsWith('/candidates'),
      subRoutes: [
        {
          label: 'Create',
          href: '/candidates/create',
        },
        {
          label: 'Update',
          href: '/candidates/update',
        },
      ],
    },
    {
      label: 'Assessments',
      icon: FileText,
      href: '/assessments',
      active: location.pathname.startsWith('/assessments'),
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
      active: location.pathname.startsWith('/analytics'),
      recruiterOnly: true,
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      active: location.pathname.startsWith('/settings'),
    },
  ];

  let filteredRoutes = routes;
  if (user?.role === 'applicant') {
    filteredRoutes = routes.filter(route =>
      route.label === 'Dashboard' ||
      route.label === 'Jobs' ||
      route.label === 'Candidates' ||
      route.label === 'Assessments' ||
      route.label === 'Settings'
    );
    filteredRoutes = filteredRoutes.map(route => {
      if (route.label === 'Candidates') {
        const { recruiterOnly, ...rest } = route;
        return {
          ...rest,
          subRoutes: route.subRoutes?.filter(sub => ['Create', 'Update'].includes(sub.label))
        };
      }
      if (route.label === 'Jobs') {
        const { recruiterOnly, ...rest } = route;
        return {
          ...rest,
          subRoutes: [] // Hide create/update for Jobs
        };
      }
      // Remove recruiterOnly for all applicant routes
      if ('recruiterOnly' in route) {
        const { recruiterOnly, ...rest } = route;
        return rest;
      }
      return route;
    });
  } else {
    filteredRoutes = routes.filter(route =>
      !route.recruiterOnly || user?.role === 'recruiter'
    );
  }

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {filteredRoutes.map((route) => (
              <div key={route.href}>
                <Link to={route.href} className="block">
                  <Button
                    variant={route.active ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start transition-all",
                      route.active 
                        ? "bg-gradient-primary text-primary-foreground shadow-md" 
                        : "hover:bg-muted"
                    )}
                  >
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Button>
                </Link>
                {/* Sub-options for Jobs and Candidates */}
                {['Jobs', 'Candidates'].includes(route.label) && route.subRoutes && route.active && (
                  <div className="ml-8 mt-2 space-y-1">
                    {route.subRoutes.map(sub => (
                      <Link key={sub.href} to={sub.href} className="block">
                        <Button variant="ghost" className="w-full justify-start text-left">
                          {sub.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}