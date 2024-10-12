import { AfterViewInit, Component, Renderer2, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports:[RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  private hoverListeners: Array<() => void> = [];  // Para almacenar los listeners de hover

  constructor(private renderer: Renderer2) { }

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
