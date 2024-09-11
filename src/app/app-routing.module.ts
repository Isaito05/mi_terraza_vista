import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Redirige a la página de login
    pathMatch: 'full' // Asegura que la ruta raíz coincida exactamente
  },
  {
    path: 'login',
    title: 'Inicio de sesión',
    loadChildren: () => import('./core/login/login.module').then(m => m.LoginModule), // Ruta de login fuera del layout
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'usuario',
        loadChildren: () => import('./features/usuario/usuario.module').then(m => m.UsuarioModule) // Carga perezosa del módulo Feature1
      },
      {
        path: 'bodega',
        loadChildren: () => import('./features/bodega/bodega.module').then(m => m.BodegaModule) // Carga perezosa del módulo Feature1
      },
      {
        path: 'pago',
        loadChildren: () => import('./features/pago/pago.module').then(m => m.PagoModule)
      },
      {
        path: 'pedido',
        loadChildren: () => import('./features/pedido/pedido.module').then(m => m.PedidoModule)
      },
      {
        path: 'proprov',
        loadChildren: () => import('./features/proprov/proprov.module').then(m => m.ProprovModule)
      },
      {
        path: 'prodventa',
        loadChildren: () => import('./features/prodventa/prodventa.module').then(m => m.ProdventaModule)
      },
      {
        path: 'proveedor',
        loadChildren: () => import('./features/proveedor/proveedor.module').then(m => m.ProveedorModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
