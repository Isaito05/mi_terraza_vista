import { Component, OnInit } from '@angular/core';
import { ProprovService } from '../service/proprov.service';

@Component({
  selector: 'app-proprov',
  templateUrl: './proprov.component.html',
  styleUrls: ['./proprov.component.css']
})
export class ProprovComponent implements OnInit {
  proprovs: any[] = []; // Variable para almacenar la lista de proprovs
  constructor(private ProprovService: ProprovService) { }

  ngOnInit(): void {
    this.ProprovService.getData().subscribe(data => {
      this.proprovs = data; // Asigna los datos recibidos a la variable proprovs
      console.log(this.proprovs); // Muestra los datos en la consola para verificar
    });
  }
}

