import { AfterViewInit, Component, Renderer2, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NgxLoadingModule } from 'ngx-loading';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import * as CryptoJS from 'crypto-js';
import { DatosService } from 'src/app/core/services/datos.service';
declare var $: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgxLoadingModule, CommonModule],  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements AfterViewInit, OnInit{
  currentFragment: string = '';
  private hoverListeners: Array<() => void> = [];  // Para almacenar los listeners de hover
  username: string = '';
  apellido: string = '';
  i_perfil: string | null = '';
  role: string | null = '';
  rol_ad: boolean = false;
  userId!: number;
  imangenPerfil: string = '';
  cartCount: number = 0;

  isLoading: boolean = false; // Cambia a 'true' cuando el usuario se loguee
  usuario: any
  secretKey = 'your-secret-key'
  private authSubscription!: Subscription;
  isSticky: boolean = false;

  
  // Método para usar una imagen por defecto si la imagen de perfil falla
  imagenPorDefecto(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    // console.log(imgElement)
    imgElement.src = 'assets/images/pf.jpg'; // Imagen por defecto si no se encuentra la imagen en el servidor
  }

  constructor(
    private router: Router, 
    private renderer: Renderer2, 
    public authService: AuthService,
    private usuarioService: UsuarioService,
    private datoService: DatosService
  ){}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token')
    // console.log('Auth Token:', token); // Verificar token
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.id;
      this.role = decodedToken.rol;
      this.username = decodedToken.nombre;
      this.apellido = decodedToken.apellido;
      this.i_perfil = decodedToken.i_perfil;
    }

    if(this.role === 'Administrador' || this.role === 'Trabajador') {
      this.rol_ad = true;
    }

    this.imangenPerfil = this.getImagenUsuario();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const urlTree = this.router.parseUrl(this.router.url);
        this.currentFragment = urlTree.fragment || '';

        // Ajustar el scroll manualmente después de la navegación
        if (this.currentFragment) {
          setTimeout(() => {
            const yOffset = -100; // Offset para ajustar la posición
            const element = document.getElementById(this.currentFragment);
            if (element) {
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }, 0);
        }
      }
    });

    // Suscribirse al observable de usuario
    this.usuarioService.$usuario.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
    
        // Si necesitas usar sessionStorage para obtener datos iniciales
        const encryptedData = sessionStorage.getItem('user');
        if (encryptedData) {
          try {
            const decryptedData = this.decryptData(encryptedData); // Desencriptar los datos de sessionStorage
            const parseData = JSON.parse(decryptedData); // Luego parsear los datos desencriptados
            this.usuario = parseData;
          } catch (error) {
            console.error('Error al desencriptar o parsear los datos del usuario:', error);
            sessionStorage.removeItem('user'); // Limpiar si los datos son inválidos
            // return null
          }
        }
    
        this.imangenPerfil = this.getImagenUsuario();
        // console.log(this.imangenPerfil, ':imagen perfil después de la actualización');
      }
    });
    this.datoService.cart$.subscribe(cart => {
      this.cartCount = cart.reduce((total, item) => total + item.CANTIDAD, 0);
    });
  }

  // addProductToCart(product: any) {
  //   this.datoService.addProduct(product);
  // }
  // updateCartCount() {
  //   const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
  //   this.cartCount = cart.reduce((total:any, producto:any) => total + producto.CANTIDAD, 0);
  // }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.querySelector('nav');
    if (navbar) {
      this.isSticky = navbar.classList.contains('sticky-top');
    }
  }


  private decryptData(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    console.log('Decrypted Data:', decryptedText); // Verificar el contenido descifrado
    return decryptedText
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
    if (imagen !== 'no hay imagen') {
      return `${environment.apiUrlHttp}${imagen}?t=${new Date().getTime()}`;
    }
    return `${environment.apiUrlHttp}${this.i_perfil}?t=${new Date().getTime()}`; // Ruta de la imagen por defecto
  }

  // Método que se ejecuta cuando se cierra la sesión
  logOut() {
      // Mostrar el spinner antes de cerrar sesión
      this.isLoading = true;

      // setTimeout(() => {
        this.authService.logout(); // Aquí se hace el logout
        this.datoService.clearCart();
        // this.router.navigate(['/home']).then(() => {
        //   // Ocultar el spinner después de navegar
        //   this.isLoading = false;
        // });
      // }, 1000); // Tiempo simulado de espera antes de cerrar sesión
  }

  isActive(fragment: string): boolean {
    return this.currentFragment === fragment;
  }

  // Detectar cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.initializeDropdownHover(event.target.innerWidth);
  }

  // Spinner function
  private initializeSpinner(): void {
    setTimeout(() => {
      if (document.getElementById('spinner')) {
        document.getElementById('spinner')?.classList.remove('show');
      }
    }, 1);
  }

  // Función para inicializar el botón "back to top"
  private initializeScrollToTop(): void {
    $(window).scroll( () => {
      if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
      } else if ($(this).scrollTop() <= 300) { 
        $('.back-to-top').fadeOut('slow');
      }
    });
  
    $('.back-to-top').click(function () {
      $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
      return false;
    });
  }

  // Dropdown hover functionality
  private initializeDropdownHover(windowWidth: number): void {
    const dropdowns = document.querySelectorAll('.dropdown');
    const showClass = 'show';

    // Limpiar los listeners anteriores para evitar duplicados
    this.cleanHoverListeners();

    if (windowWidth >= 992) {
      dropdowns.forEach(dropdown => {
        const mouseEnterListener = this.renderer.listen(dropdown, 'mouseenter', () => {
          this.renderer.addClass(dropdown, showClass);
          const toggle = dropdown.querySelector('.dropdown-toggle');
          const menu = dropdown.querySelector('.dropdown-menu');
          if (toggle && menu) {
            this.renderer.setAttribute(toggle, 'aria-expanded', 'true');
            this.renderer.addClass(menu, showClass);
          }
        });

        const mouseLeaveListener = this.renderer.listen(dropdown, 'mouseleave', () => {
          this.renderer.removeClass(dropdown, showClass);
          const toggle = dropdown.querySelector('.dropdown-toggle');
          const menu = dropdown.querySelector('.dropdown-menu');
          if (toggle && menu) {
            this.renderer.setAttribute(toggle, 'aria-expanded', 'false');
            this.renderer.removeClass(menu, showClass);
          }
        });

        // Almacenar los listeners para poder limpiarlos más tarde
        this.hoverListeners.push(mouseEnterListener, mouseLeaveListener);
      });
    }
  }

  // Limpiar los listeners de hover
  private cleanHoverListeners(): void {
    this.hoverListeners.forEach(unlisten => unlisten());  // Eliminar los listeners previos
    this.hoverListeners = [];  // Vaciar el array
  }

  ngAfterViewInit(): void {
    this.initializeSpinner();
    this.initializeScrollToTop()

    // Iniciar el comportamiento del dropdown con el tamaño actual de la ventana
    this.initializeDropdownHover(window.innerWidth);

    // Iniciar el carrusel de testimonios
    $('.testimonial-carousel').owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      center: true,
      margin: 24,
      dots: true,
      loop: true,
      nav: false,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 2
        },
        992: {
          items: 3
        }
      }
    });
  }
}

const secretKey = 'Secret-key'
function decryptData(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
