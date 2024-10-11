import { Component } from '@angular/core';
import { NgxLoadingModule } from 'ngx-loading';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ImageUploadService } from 'src/app/core/services/image-upload.service';
import { environment } from 'src/environments/environment';

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
  i_perfil: string | null = '';
  role: string | null = '';
  
  loading: boolean = false;
  imangenPerfil: string = '';

  constructor( private authService: AuthService, private imagenService: ImageUploadService ){}

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    this.role = sessionStorage.getItem('role');
    this.apellido = sessionStorage.getItem('apellido');
    this.i_perfil = sessionStorage.getItem('i_perfil');

    if (!this.i_perfil || this.i_perfil === '') {
      this.imangenPerfil = 'assets/images/pf.jpg'
    } else {
      this.imangenPerfil = `${environment.apiUrlHttp}${this.i_perfil}?t=${new Date().getTime()}`;
    }
  }

  imagenPorDefecto(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.log(imgElement)
    imgElement.src = 'assets/images/pf.jpg'; // Imagen por defecto si no se encuentra la imagen en el servidor
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
