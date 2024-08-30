import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  // Propiedad para rastrear el estado del icono
  ngOnInit(): void {
    const toggler = document.querySelector('.btn') as HTMLElement;
    const sidebar = document.querySelector('#sidebar') as HTMLElement;

    if (toggler && sidebar) {  // Verifica que ambos elementos existen
      toggler.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }
  }
  isToggled: boolean = false;

  // Método para alternar el estado
  toggleIcon() {
    this.isToggled = !this.isToggled;
  }
  
}
