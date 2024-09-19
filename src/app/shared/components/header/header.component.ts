import { Component } from '@angular/core';
import { NgxLoadingModule } from 'ngx-loading';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgxLoadingModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  username: string | null = '';
  apellido: string | null = '';
  role: string | null = '';
  loading: boolean = false;

  constructor( private authService: AuthService ){}

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    this.role = sessionStorage.getItem('role');
    this.apellido = sessionStorage.getItem('apellido');
  }

  logOut() {
    this.loading = true
    // document.body.style.overflow = 'hidde';
    setTimeout(() => {
      this.loading = false
      // document.body.style.overflow = 'auto';
      this.authService.logout();
    },1000);
  }
}
