import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    // CommonModule,
    UploadRoutingModule,
    UploadComponent,
    FormsModule
  ]
})
export class UploadModule { }
