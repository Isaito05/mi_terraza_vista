import { AfterViewInit, Component, Renderer2, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/auth/auth.service';
import { NgxLoadingModule } from 'ngx-loading';
import { ImageUploadService } from 'src/app/core/services/image-upload.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
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
  username: string | null = '';
  apellido: string | null = '';
  i_perfil: string | null = '';
  role: string | null = '';
  userId!: number;
  
  loading: boolean = false;
  imangenPerfil: string = '';

  isLoggedIn = false; // Cambia a 'true' cuando el usuario se loguee
  private authSubscription!: Subscription;
  
  // Método para usar una imagen por defecto si la imagen de perfil falla
  imagenPorDefecto(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.log(imgElement)
    imgElement.src = 'assets/images/pf.jpg'; // Imagen por defecto si no se encuentra la imagen en el servidor
  }

  constructor(private router: Router, private renderer: Renderer2, private authService: AuthService,private imagenService: ImageUploadService) { }

  ngOnInit(): void {
  // Suscribirse al observable para actualizar el estado de isLoggedIn
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
        console.log('Estado de isLoggedIn actualizado:', this.isLoggedIn);
      }
    );
    
    // Código existente para obtener datos de sesión    
    const token = sessionStorage.getItem('token'); 
    console.log('Auth Token:', token); // Verificar token
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.id;
      this.imangenPerfil = decodedToken.i_perfil;
      this.username = decodedToken.nombre;
      this.apellido = decodedToken.apellido;
      this.role = decodedToken.rol;
  
      if (!this.imangenPerfil || this.imangenPerfil === '') {
        this.imangenPerfil = 'assets/images/pf.jpg'
      } else {
        this.imangenPerfil = `${environment.apiUrlHttp}${this.imangenPerfil}?t=${new Date().getTime()}`;
      }
    }

    
    // if (!this.i_perfil || this.i_perfil === '') {
    //   this.imangenPerfil = 'assets/images/pf.jpg'
    // } else {
    //   this.imangenPerfil = `${environment.apiUrlHttp}${this.i_perfil}?t=${new Date().getTime()}`;
    // }
    
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
  }

  // Método que se ejecuta cuando se cierra la sesión
    logOut() {
      this.loading = true
      // document.body.style.overflow = 'hidde';
      setTimeout(() => {
        this.loading = false
        // document.body.style.overflow = 'auto';
        this.authService.logout();
      },1000);
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

  ngOnDestroy(): void {
    // Limpiar la suscripción al destruir el componente
    this.authSubscription.unsubscribe();
  }

}
