import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  public archivos: any = [];
  public previsualizacion: string = '';

  constructor(private sanitizer: DomSanitizer, private res: AuthService) {

  }
  ngOnit(): void {

  }
  onFileSelected(event: any){
    this.archivos = event.target.files[0];
    this.extraerBase64(this.archivos).then((image: any) => {
      this.previsualizacion = image.base;
    });
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

  // onUpload(): any {
  //   if (this.archivos) {
  //     this.res.upload(this.archivos).subscribe(
  //       response => {
  //         console.log(response);
  //         alert(response.mesg);
  //       },
  //       error => {
  //         console.error(error);
  //         alert('Error al cargar el archivo');
  //       }
  //     );
  //   }
  // }
}

