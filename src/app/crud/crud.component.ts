import { Component } from '@angular/core';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent {
  items: string[] = [];

  agregarItem(item: string) {
    this.items.push(item);
  }

  eliminarItem(index: number) {
    this.items.splice(index, 1);
  }
}
