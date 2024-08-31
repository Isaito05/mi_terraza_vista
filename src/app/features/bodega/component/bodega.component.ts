import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent implements OnInit {
  bodegas: any[] = [];
  proprov: any[] = [];
  proprovMap: { [key: number]: string } = {}; // Mapa para relacionar ID con nombre

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getBodegas();
    
  }

  getBodegas(): void {
    this.http.get<any[]>('http://localhost:3000/bodega').subscribe(data => {
      this.bodegas = data;
    });
  }

  isModalVisible: boolean = false;

  openModal() {
    this.isModalVisible = true;
  }

  handleClose() {
    this.isModalVisible = false;
  }

  handleConfirm() {
    console.log('Confirmed!');
    this.isModalVisible = false;
  }
}
