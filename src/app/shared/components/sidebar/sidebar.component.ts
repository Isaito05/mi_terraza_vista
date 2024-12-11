import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  // Propiedad para rastrear el estado del icono
  isSidebarCollapsed: boolean = false;
  isCollapsed: boolean = false;

  ngOnInit(): void {
    const toggler = document.querySelector('.btn') as HTMLElement;
    const sidebar = document.querySelector('#sidebar') as HTMLElement;

    if (toggler && sidebar) {  // Verifica que ambos elementos existen
      toggler.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }
    this.sidebarService.isCollapsed$.subscribe((state) => {
      this.isCollapsed = state;
    });
  }
  isToggled: boolean = false;
  userRole: string = '';
  // Método para alternar el estado
  toggleIcon() {
    this.isToggled = !this.isToggled;
  }

  constructor(private router: Router,
  private route: ActivatedRoute,
  private sidebarService: SidebarService
  ){
    const token = sessionStorage.getItem('token');
    if(token){
      const decodedToken: any = jwtDecode(token)
      this.userRole = decodedToken.rol
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isWorkerRole(): boolean {
    return this.userRole === 'Trabajador';
  }
  
}
