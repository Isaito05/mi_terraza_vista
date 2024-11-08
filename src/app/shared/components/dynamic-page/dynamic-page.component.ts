import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Importa DomSanitizer
import { NavbarComponent } from '../navbar/navbar.component';
import { jwtDecode } from 'jwt-decode';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import { SharedModule } from "../../shared.module";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
declare var $: any;

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [RouterModule, NavbarComponent, SharedModule, CommonModule, FooterComponent],
  templateUrl: './dynamic-page.component.html',
  styleUrls: ['./dynamic-page.component.css']
})
export class DynamicPageComponent implements OnInit, AfterViewInit {

  private hoverListeners: Array<() => void> = [];  // Para almacenar los listeners de hover
  safePageContent: SafeHtml = ''; // SafeHtml para el contenido seguro
  userId!: number;
  usuario: any = {}
 // Otras propiedades
 pageName: string = '';
 isMenuPage: boolean = false;  // Bandera para saber si es la página de menú

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,  // Inyecta DomSanitizer
    private renderer: Renderer2,
    private usuarioService:UsuarioService,
    private cd: ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
    const pageName = this.route.snapshot.paramMap.get('pageName');
    // if (pageName) {
    //   this.loadPageContent(pageName);
    // }
    if (pageName) {
      this.pageName = pageName;
      // Verifica si la página es 'menu' y ajusta la bandera
      if (this.pageName === 'menu') {
        this.isMenuPage = true;
      } else {
        this.isMenuPage = false;
        this.loadPageContent(this.pageName); // Si no es 'menu', carga el contenido HTML
      }
    }
  

    console.log('Page Name:', pageName);  // Para depurar y verificar el valor

    if (pageName) {
      this.loadPageContent(pageName);  // Usa pageName directamente
    } else {
      console.error('Page name is missing!');
    }

    const token = sessionStorage.getItem('token'); 
    console.log('Auth Token:', token); // Verificar token
    if (token) {
      const decodedToken: any = jwtDecode(token);
      console.log('User token:', decodedToken); 
      this.userId = decodedToken.id;
      console.log('User ID:', this.userId); // Verificar userId
  
      this.usuarioService.getUsuarioById(this.userId).subscribe(
        (data) => {
          this.usuario = data;
          console.log('Usuario obtenido:', this.usuario);

          this.cd.detectChanges();
        },
        (error) => {
          console.error('Error al obtener los datos del usuario', error);
        }
      );
    }
  }
  

  // Cargar el contenido de la página de forma segura
  loadPageContent(pageName: string) {
    const filePath = `/assets/pages/${pageName}.html`;
    this.http.get(filePath, { responseType: 'text' }).subscribe(
      content => {
        this.safePageContent = this.sanitizer.bypassSecurityTrustHtml(content);
      },
      err => {
        console.error('Error loading page content:', err);
        this.safePageContent = this.sanitizer.bypassSecurityTrustHtml('<h2>Error loading page</h2>');
      }
    );
  }
  

  // Detectar cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.initializeDropdownHover(event.target.innerWidth);
  }

  // Función para inicializar el spinner
  private initializeSpinner(): void {
    setTimeout(() => {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  }

  // Función para inicializar el botón "back to top"
  private initializeScrollToTop(): void {
    $(window).scroll(() => {
      // Usamos $(window) en lugar de $(this) para evitar problemas de contexto
      if ($(window).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
      } else {
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
    this.initializeScrollToTop(); // Inicializar el botón "back to top"
    this.initializeSpinner();

    // Iniciar el comportamiento del dropdown con el tamaño actual de la ventana
    this.initializeDropdownHover(window.innerWidth);
  }
}
