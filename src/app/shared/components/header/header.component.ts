import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { NgxLoadingModule } from 'ngx-loading';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ImageUploadService } from 'src/app/core/services/image-upload.service';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgxLoadingModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  username: string = '';
  apellido: string = '';
  i_perfil: string | null = '';
  role: string | null = '';
  
  loading: boolean = false;
  imangenPerfil: string = '';
  usuario: any;

  constructor( 
    private authService: AuthService, 
    private usuarioService: UsuarioService, 
    private router: Router ){}

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token)
      this.role = decodedToken.rol;
      this.username = decodedToken.nombre;
      this.apellido = decodedToken.apellido;
      this.i_perfil = decodedToken.i_perfil;
    }

    // if(this.i_perfil=== '') {
    //   this.i_perfil = 'assets/images/pf.jpg'
    // }
    this.imangenPerfil = this.getImagenUsuario();
    // console.log(this.imangenPerfil)
    this.usuarioService.$usuario.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
        this.imangenPerfil = this.getImagenUsuario();
        console.log(this.imangenPerfil, ':imagen perfil después de la actualización');
      }
    });
  }

  getNombreUsuario(): string {
    const nombre = this.usuario ? this.usuario.RGU_NOMBRES : 'Invitado';
    if(nombre !== 'Invitado'){
      return nombre
    }
    return this.username
  }

  getApellidoUsuario(): string {
    const apellido = this.usuario ? this.usuario.RGU_APELLIDOS : 'Invitado';
    if(apellido !== 'Invitado') {
      return apellido
    }
    return this.apellido
  }

  getImagenUsuario(): string {
    const imagen = this.usuario ? this.usuario.RGU_IMG_PROFILE: 'no hay imagen'
    // console.log(imagen)
    if (imagen !== 'no hay imagen') {
      return `${environment.apiUrlHttp}${imagen}?t=${new Date().getTime()}`;
    }
    return `${environment.apiUrlHttp}${this.i_perfil}?t=${new Date().getTime()}`; // Ruta de la imagen por defecto
  }

  imagenPorDefecto(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/pf.jpg'; // Imagen por defecto si no se encuentra la imagen en el servidor
  }

  logOut() {
    this.loading = true
    // document.body.style.overflow = 'hidde';
    setTimeout(() => {
      this.loading = false
      // document.body.style.overflow = 'auto';
      this.authService.logout();
      this.router.navigate(['/login'])
    },1000);
  }
}
