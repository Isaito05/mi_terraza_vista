import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-check-box',
  // standalone: true,
  // imports: [],
  templateUrl: './check-box.component.html',
  styleUrl: './check-box.component.css'
})
export class CheckBoxComponent {
  @Input() checked: boolean = false; // Estado inicial del checkbox
  @Output() checkedChange = new EventEmitter<boolean>(); // Emitir cambio  
  @Output() click = new EventEmitter<void>();

 // Método para manejar el cambio del checkbox
  onCheckboxChange(event: Event) {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
    this.click.emit(); // Emite el evento de click
  }


  toggleChecked(): void {
    // this.checkedChange.emit(this.checked);    // Emite el nuevo estado
  }
}
