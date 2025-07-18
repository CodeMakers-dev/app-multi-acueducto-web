import { inject, Injectable, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { IBreadcrumb } from '@interfaces/Ibreadcrumb';
import { filter, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private  readonly _breadcrumbs = signal<IBreadcrumb[]>([]);

  breadcrumbs = this._breadcrumbs.asReadonly();

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly routeLabels: { [key: string]: string } = {
    // Rutas principales
    'home': 'Inicio',
    'start': 'Comenzar',

    // Módulo de clientes
    'client': 'Clientes',
    'create-client': 'Crear Cliente',

    // Módulo de facturas/bills
    'bill': 'Facturas',
    'customer-debt': 'Deudas de Clientes',
    'credit-customer': 'Créditos de Clientes',
    'create-debt': 'Crear Deuda',
    'create-credit': 'Crear Crédito',
    'update-bill': 'Actualizar Factura',

    // Módulo de autenticación
    'auth': 'Autenticación',
    'login': 'Iniciar Sesión',
    'register': 'Registrarse',
    'forgot-password': 'Olvidé mi Contraseña',
    'recover-password': 'Recuperar Contraseña',

    // Rutas adicionales comunes
    'profile': 'Perfil',
    'settings': 'Configuración',
    'dashboard': 'Panel de Control',
    'admin': 'Administración',
    'reports': 'Reportes',
    'users': 'Usuarios',
    'services': 'Servicios',
    'contact': 'Contacto',
    'about': 'Acerca de'
  };

  constructor() {
    this.initBreadcrumbListener();
  }

  private initBreadcrumbListener(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.createBreadcrumbs(this.activatedRoute.root))
      )
      .subscribe(breadcrumbs => {
        this._breadcrumbs.set(breadcrumbs);
      });
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;

        // Obtener el label del objeto configurado o usar el path capitalizado
        const routeKey = routeURL.toLowerCase();
        const label = this.routeLabels[routeKey] || this.capitalizeFirst(routeURL);

        const breadcrumb: IBreadcrumb = {
          label,
          url,
          isActive: false
        };

        breadcrumbs.push(breadcrumb);
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    // Marcar el último como activo
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isActive = true;
    }

    return breadcrumbs;
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
