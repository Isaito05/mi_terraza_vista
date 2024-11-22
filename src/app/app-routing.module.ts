import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guard/auth.guard';
import { HomeComponent } from './shared/components/home/component/home.component'; 
import { DynamicPageComponent } from './shared/components/dynamic-page/dynamic-page.component';

import { ForgotPasswordComponent } from './core/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';
import { RegisterComponent } from './shared/components/register/component/register.component'; 
import { canDeactivateGuard } from './core/guard/can-deactivate.guard';
import { ProfileComponent } from './shared/components/profile/component/profile.component';
import { CarritoListarComponent } from './shared/components/carrito/carrito-listar.component';

const routes: Routes = [
  // Redirige a 'home' si la ruta es vacía
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },

  // Rutas públicas (fuera del layout)
  { 
    path: 'login', 
    title: 'Inicio de sesión',
    loadChildren: () => import('./core/login/login.module').then(m => m.LoginModule),
  },
  { 
    path: 'forgot-password', 
    title: 'Recuperar contraseña', 
    component: ForgotPasswordComponent 
  },
  { 
    path: 'reset-password', 
    title: 'Cambiar contraseña', 
    component: ResetPasswordComponent, 
    canDeactivate: [canDeactivateGuard]
  },
  { 
    path: 'register', 
    title: 'Registrar usuario', 
    component: RegisterComponent, 
    canDeactivate: [canDeactivateGuard]
  },
  { 
    path: 'pages/:pageName', 
    component: DynamicPageComponent 
  },
  { 
    path: 'profile', 
    title: 'Mi perfil', 
    component: ProfileComponent 
  },
  // Ruta para la página de inicio pública
  { 
    path: 'home', 
    title: 'Mi terraza', 
    component: HomeComponent 
  },

  { 
    path: 'carrito', 
    component: CarritoListarComponent
  },

  // Rutas dentro del layout con autenticación (authGuard)
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'usuario',
        title: 'Usuarios',
        loadChildren: () => import('./features/usuario/usuario.module').then(m => m.UsuarioModule),
        canActivate: [authGuard]
      },
      {
        path: 'bodega',
        title: 'Bodega',
        loadChildren: () => import('./features/bodega/bodega.module').then(m => m.BodegaModule),
        canActivate: [authGuard]
      },
      {
        path: 'pago',
        title: 'Pagos',
        loadChildren: () => import('./features/pago/pago.module').then(m => m.PagoModule),
        canActivate: [authGuard]
      },
      {
        path: 'pedido',
        title: 'Pedidos',
        loadChildren: () => import('./features/pedido/pedido.module').then(m => m.PedidoModule),
        canActivate: [authGuard]
      },
      {
        path: 'proprov',
        title: 'Producto por Proveedor',
        loadChildren: () => import('./features/proprov/proprov.module').then(m => m.ProprovModule),
        canActivate: [authGuard]
      },
      {
        path: 'prodventa',
        title: 'Productos en Venta',
        loadChildren: () => import('./features/prodventa/prodventa.module').then(m => m.ProdventaModule),
        canActivate: [authGuard]
      },
      {
        path: 'proveedor',
        title: 'Proveedor',
        loadChildren: () => import('./features/proveedor/proveedor.module').then(m => m.ProveedorModule),
        canActivate: [authGuard]
      },
      {
        path: 'upload',
        title: 'Cargar Archivos',
        loadChildren: () => import('./core/upload/upload.module').then(m => m.UploadModule),
        // canActivate: [authGuard] // Habilitar cuando quieras proteger esta ruta
      },
    ]
  },

  // Ruta comodín para redirigir cualquier ruta no encontrada a 'home'
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
