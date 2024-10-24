import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { BodegaService } from 'src/app/features/bodega/service/bodega.service';
import { ProdventaService } from 'src/app/features/prodventa/services/prodventa.service';
import { ProprovService } from 'src/app/features/proprov/service/proprov.service';
import { PedidoService } from 'src/app/features/pedido/service/pedido.service';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import { PagoService } from 'src/app/features/pago/service/pago.service';
import { ProveedorService } from 'src/app/features/proveedor/service/proveedor.service';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent {
  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Input() title: string = ''; // Título del modal
  @Input() fields: { id: string; label: string; type: string; options?: { value: string; label: string }[]; accept?: string; }[] = []; // Campos del formulario
  @Input() data: { [key: string]: any } = {}; // Define el tipo aquí// 
  @Input() dataU: any[] = [];

  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal
  @Output() save = new EventEmitter<any>(); // Evento para guardar cambios
  @Input() isEditing = false; // Asegúrate de declarar isEditing
  @Input() isViewingDetails: boolean = false;

  @Output() onRegisterSuccess = new EventEmitter<any>();
  @Output() confirmAction = new EventEmitter<void>();
  imageFile: File | null = null;
  imageFileUsu: File | null = null;
  previsualizacion: string | null = null;
  imageUrl: any

  intentoFallido: boolean = false;
  botonHabilitado: boolean = true;
  usuarios: any[] = [...this.dataU];

  // showProfilePicture: boolean = false;

  showProfilePicture: string | ArrayBuffer | null = null;
  pedidos: any[] = [];
  result: any[] = [];
  acc: any[] = [];

  form: FormGroup;
  private serviceMap: { [key: string]: any } = {}

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private usuarioService: UsuarioService,
    // private imageUploadService: ImageUploadService,
    private prodventaService: ProdventaService,
    private pagoService: PagoService,
    private bodegaService: BodegaService,
    private proveedorService: ProveedorService,
    private proprovService: ProprovService,
    // private authService: AuthService,
    private pedidoService: PedidoService,
    private sanitizer: DomSanitizer,
  ) {
    this.serviceMap = {
      'Usuario': this.usuarioService,
      'ProductoV': this.prodventaService,
      'Pago': this.pagoService,
      'Bodega': this.bodegaService,
      'Proveedor': this.proveedorService,
      'Proprov': this.proprovService,
      'Pedido': this.pedidoService,
    }
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.usuariosEmail();
    this.initializeForm();
    this.form.valueChanges.subscribe(() => {
      if (this.intentoFallido) {
        this.intentoFallido = false // Habilita el formulario cuando hay cambios
        this.botonHabilitado = true
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group(
      this.fields.reduce((acc, field) => {
        let validators = [];

        // Agregar validadores según el tipo de campo
        if (field.type === 'email') {
          validators.push(Validators.required, Validators.email, this.validacionEmail);
          // } else if (field.type === 'text' && field.label.toLowerCase().includes('telefono')) {
          //   validators.push(Validators.required, Validators.pattern(/^\d{10}$/));
        } else if (field.type === 'password') {
          validators.push(Validators.required, Validators.minLength(8), this.validacionContrasena);
        } else if (field.type === 'text' && field.label.toLowerCase().includes('nombre')) {
          validators.push(Validators.required); // Validador para el campo Nombres
        } else if (field.type === 'text' && field.label.toLowerCase().includes('apellido')) {
          validators.push(Validators.required); // Validador para el campo Apellidos
        } else if (field.type === 'number' && field.label.toLowerCase().includes('telefono')) {
          // Solo acepta números con el pattern
          validators.push(Validators.pattern(/^\d{10}$/));
        } else if (field.type === 'number' && field.label.toLowerCase().includes('nro. de identificación')) {
          // Solo acepta números y debe tener entre 8 y 10 dígitos
          validators.push(Validators.pattern(/^\d{8,10}$/));
        } else if (field.type === 'select') {
          validators.push(Validators.required); // Agregar validador requerido
        }

        acc[field.id] = [this.data[field.id] || '', validators];
        return acc;
      }, { showProfilePicture: [false] } as { [key: string]: any },)
    );

    if (this.title === 'Detalles del pedido') {
      this.Tablapedido(this.data['PED_ID']);
      console.log(this.pedidos)
    }

    if (this.data['RGU_IMG_PROFILE']) {
      this.previsualizacion = `${environment.apiUrlHttp}${this.data['RGU_IMG_PROFILE']}`;
    } else if (this.data['RGU_IMG_PROFILE'] === '') {
      this.previsualizacion = ''
    }
  }

  validacionEmail(control: AbstractControl): { [key: string]: boolean } | null {
    const emailRegex = (/^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,4})?$/);
    const email = control.value;
    return emailRegex.test(email) ? null : { invalidEmail: true }
  }

  validacionContrasena(control: AbstractControl) {
    const password = control.value;

    const hasMinLength = password ? password.length >= 8 : false;
    // const hasMaxLength = password ? password.length <= 8 : false;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&_*(),.?":{}|<>]/.test(password);

    if (!hasMinLength) {
      return { minlength: true };
    }

    if (!hasUpperCase) {
      return { uppercase: true };
    } else if (!hasNumber) {
      return { number: true };
    } else if (!hasSpecialChar) {
      return { specialchar: true };
    }

    return null;
  }

  formatCurrency(value: any): string {
    if (value == null) {
      return '';
    }

    if (typeof value === 'number') {
      return `${value.toLocaleString('es-ES')}`;
    }

    // Convertir cadenas numéricas a número
    const numericValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    if (!isNaN(numericValue)) {
      return `${numericValue.toLocaleString('es-ES')}`;
    }

    // Si no es un número, devolver el valor como cadena
    return value.toString();
  }

  closeModal() {
    this.close.emit();
  }

  confirm() {
    // if (this.form.valid) {
      const formValues = this.form.value; // Obtén los valores del formulario
      this.data = { ...formValues };
      const fechaRegistro = new Date();
      const offset = fechaRegistro.getTimezoneOffset();
      fechaRegistro.setMinutes(fechaRegistro.getMinutes() - offset)
      this.data['RGU_FCH_REGISTRO'] = fechaRegistro.toISOString();
      const formData = this.data;
      const service = this.getServiceBasedOnContext();
      if (service) {
        if (this.isEditing) {
          if (this.imageFileUsu) {
            if (this.imageFileUsu) {
              this.usuarioService.upload(this.imageFileUsu).subscribe(
                (response: any) => {
                  if (response.filePath) {
                    this.data['RGU_IMG_PROFILE'] = response.filePath;
                    sessionStorage.setItem('i_perfil', response.filePath);
                  }
                  const imageUrl = response.filePath; // Guarda la ruta de la imagen  
                  delete formData['showProfilePicture'];
                  this.actualizarDatos(formData);
                },
                (error: any) => {
                  console.error('Error al subir la imagen:', error);
                }
              );
            }
          } else {
            delete formData['showProfilePicture'];
            this.actualizarDatos(formData);
          }
        } else {
          if (this.imageFile || this.imageFileUsu) {
            if (this.imageFile) {
              this.prodventaService.upload(this.imageFile).subscribe(
                (response: any) => {
                  if (response.filePath) {
                    this.data['PROD_VENTA_IMAGEN'] = response.filePath;
                  }
                  const imageUrl = response.filePath; // Guarda la ruta de la imagen
                  console.log(this.imageUrl); // Suponiendo que el servidor devuelve la URL de la imagen

                  console.log('Imagen subida exitosamente:', imageUrl);
                  this.guardarDatos(formData)
                },
                (error: any) => {
                  console.error('Error al subir la imagen:', error);
                }
              );
            }
            if (this.imageFileUsu) {
              this.usuarioService.upload(this.imageFileUsu).subscribe(
                (response: any) => {
                  if (response.filePath) {
                    this.data['RGU_IMG_PROFILE'] = response.filePath;
                  }
                  const imageUrl = response.filePath;
                  this.guardarDatos(formData)
                },
                (error: any) => {
                  console.error('Error al subir la imagen:', error);
                }
              );
            }
          } else {
            this.guardarDatos(formData)
          }
        }
      } else {
        console.error('No se encontró un servicio adecuado para el contexto.');
      }
    // } else {
    //   console.error('Formulario inválido');
    // }
  }

  usuariosEmail() {

  }

  guardarDatos(formData: any) {
    this.usuarioService.getData().subscribe({
      next: (data) => {
        this.usuarios = data.filter((item: { RGU_ESTADO: number }) => item.RGU_ESTADO === 1);
        const emails = this.usuarios.map((item: { RGU_CORREO: string }) => item.RGU_CORREO);

        if (emails.includes(formData.RGU_CORREO)) {
          Swal.fire({
            title: 'Correo duplicado',
            text: 'Este correo ya existe. No se puede actualizar.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        } else {
          const service = this.getServiceBasedOnContext();
      service.saveData(formData).subscribe(
        (response: any) => {
          this.closeModal();
          this.data = [];
          Swal.fire({
            title: 'Éxito',
            text: 'Registro guardado satisfactoriamente',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.save.emit(response);
            location.reload();
          });
          // this.intentoFallido = false; 
          // this.botonHabilitado = true;
        },
        (error: any) => {
          console.error('Error al guardar los datos:', error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo guardar el registro',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          // this.intentoFallido = true; 
          // this.botonHabilitado = false;
        }

      );
        }
      },
      error: (err) => {
        console.error('Error obteniendo usuarios:', err);
      }
    });
  }

  actualizarDatos(formData: any) {
    this.usuarioService.getData().subscribe({
      next: (data) => {
        this.usuarios = data.filter((item: { RGU_ESTADO: number }) => item.RGU_ESTADO === 1);
        const usuarioActual = this.usuarios.find((item: { RGU_CORREO: string, RGU_ID: number }) => item.RGU_ID === formData.RGU_ID);
  
        if (usuarioActual && usuarioActual.RGU_CORREO === formData.RGU_CORREO) {
          this.actualizarRegistro(formData);
        } else {
          const emails = this.usuarios.map((item: { RGU_CORREO: string }) => item.RGU_CORREO);
          if (emails.includes(formData.RGU_CORREO)) {
            Swal.fire({
              title: 'Correo duplicado',
              text: 'Este correo ya existe. No se puede actualizar.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            this.actualizarRegistro(formData);
          }
        }
      },
      error: (err) => {
        console.error('Error obteniendo usuarios:', err);
      }
    });
  }
  
  private actualizarRegistro(formData: any): void {
    const service = this.getServiceBasedOnContext();
    service.updateData(formData).subscribe(
      (response: any) => {
        this.closeModal();
        this.data = [];
        Swal.fire({
          title: 'Éxito',
          text: 'Registro editado satisfactoriamente',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.save.emit(response);
          location.reload();
        });
      },
      (error: any) => {
        console.error('Error al editar los datos:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo editar el registro',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  private getServiceBasedOnContext() {
    switch (true) {
      case this.title.includes('Registrar usuario'):
      case this.title.includes('Editar usuario'):
        return this.serviceMap['Usuario'];
      case this.title.includes('Registrar producto en venta'):
      case this.title.includes('Editar producto en venta'):
        return this.serviceMap['ProductoV'];
      case this.title.includes('Registrar pago'):
      case this.title.includes('Editar pago'):
        return this.serviceMap['Pago'];
      case this.title.includes('Registrar bodega'):
      case this.title.includes('Editar bodega'):
        return this.serviceMap['Bodega'];
      case this.title.includes('Registrar pedido'):
      case this.title.includes('Editar pedido'):
        return this.serviceMap['Pedido'];
      case this.title.includes('Registrar proveedor'):
      case this.title.includes('Editar proveedor'):
        return this.serviceMap['Proveedor'];
      case this.title.includes('Registrar producto proveedor'):
      case this.title.includes('Editar producto proveedor'):
        return this.serviceMap['Proprov'];
      default:
        console.error('Contexto no encontrado para el título:', this.title);
        return null;
    }
  }
  handleFieldChange(fieldId: string, value: any) {
    if (this.form) {
      this.form.get(fieldId)?.setValue(value); // Actualizamos el valor en el formulario
    }
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        })
      };
    } catch (e) {
      // return null;
      reject(e)
    }
  })

  // Método para manejar el cambio de input de archivo (imagen)
  handleFileInputChange(event: any, fieldId: string) {
    console.log('File input changed:', event);
    const file = event.target.files[0];
    if (file) {
      if (fieldId === 'PROD_VENTA_IMAGEN') {
        this.imageFile = file;
      } else if (fieldId === 'RGU_IMG_PROFILE') {
        this.imageFileUsu = file;
      }
      this.extraerBase64(file).then((image: any) => {
        this.previsualizacion = image.base; // Establece la vista previa
      }).catch((error) => {
        console.error('Error al convertir la imagen:', error);
      });
    }
  }

  Tablapedido(pedId: any) {
    this.pedidoService.getData().subscribe(data => {
      console.log(pedId, 'idiota');
      const pedidosFiltrados = data.filter((pedido: { PED_ID: number; }) => pedido.PED_ID === pedId);

      const productosMap = new Map<string, number>(); // Para evitar duplicados
      console.log(productosMap)
      pedidosFiltrados.forEach((pedido: { PED_INFO: string | any[]; }) => {
        if (typeof pedido.PED_INFO === 'string') {
          try {
            const pedInfoArray = JSON.parse(pedido.PED_INFO);
            pedInfoArray.forEach((info: { id: string; cantidad: number; }) => {
              const id = info.id;
              const cantidad = info.cantidad;
              if (productosMap.has(id)) {
                productosMap.set(id, productosMap.get(id)! + cantidad); // Sumar la cantidad si ya existe
              } else {
                productosMap.set(id, cantidad); // Agregar nuevo producto
              }
            });
          } catch (error) {
            console.error('Error parsing PED_INFO JSON', error);
          }
        }
      });

      // Convertir el Map a un array de promesas para obtener los detalles de los productos
      const productPromises = Array.from(productosMap.keys()).map(id =>
        this.prodventaService.getProVenById(id).toPromise().then(data => ({
          nombre: data.PROD_VENTA_NOMBRE,
          precio: data.PROD_VENTA_PRECIO,
          descripcion: data.PROD_VENTA_DESCRIPCION,
          cantidad: productosMap.get(id)!,
          subtotal: data.PROD_VENTA_PRECIO * productosMap.get(id)!
        })).catch(error => {
          console.error('Error al obtener los datos:', error);
          return null; // Manejar el error
        })
      );
      console.log(productPromises)

      // Esperar a que todas las promesas se resuelvan
      Promise.all(productPromises).then(results => {
        this.pedidos = results.filter(result => result !== null); // Filtrar resultados nulos en caso de error
        console.log(this.pedidos = results.filter(result => result !== null))
      });
    });
  }

  getTotal(): number {
    return this.pedidos.reduce((acc, item) => acc + item.subtotal, 0);
  }

  formatDateForDatetimeLocal(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Mes de dos dígitos
    const day = ('0' + date.getDate()).slice(-2); // Día de dos dígitos
    const hours = ('0' + date.getHours()).slice(-2); // Horas de dos dígitos
    const minutes = ('0' + date.getMinutes()).slice(-2); // Minutos de dos dígitos

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  getFormattedDate(fieldId: string): string {
    const isoDate = this.data[fieldId];
    return isoDate ? this.formatDateForDatetimeLocal(isoDate) : '';
  }
}
