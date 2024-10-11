import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guard/auth.guard';
import { HomeComponent } from './shared/components/home/component/home.component'; 
import { DynamicPageComponent } from './shared/components/dynamic-page/dynamic-page.component';

import { ForgotPasswordComponent } from './core/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';
import { RegisterComponent } from './shared/components/register/component/register.component'; 
import { canDeactivateGuard } from './guard/can-deactivate.guard';

const routes: Routes = [
  {
    path: 'login',
    title: 'Inicio de sesión',
    loadChildren: () => import('./core/login/login.module').then(m => m.LoginModule), // Ruta de login fuera del layout
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
  { path: 'home', component: HomeComponent },
  { path: 'pages/:pageName', component: DynamicPageComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'usuario',
        title: 'Usuarios',
        loadChildren: () => import('./features/usuario/usuario.module').then(m => m.UsuarioModule), // Carga perezosa del módulo Feature1
        canActivate: [authGuard]
      },
      {
        path: 'bodega',
        title: 'Bodega',
        loadChildren: () => import('./features/bodega/bodega.module').then(m => m.BodegaModule),
        canActivate: [authGuard] // Carga perezosa del módulo Feature1
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
        title: 'upload',
        loadChildren: () => import('./core/upload/upload.module').then(m => m.UploadModule), 
        // canActivate: [authGuard]
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'home', // Redirige a la página de home
    pathMatch: 'full' // Asegura que la ruta raíz coincida exactamente
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
