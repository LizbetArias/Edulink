import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

interface User {
  username: string;
  password: string;
}

interface Employee {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  cumpleanos: string;
  estado: 'Activo' | 'Inactivo';
}

/*----------------------------------------Login-----------------------------------------------------*/
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
 
    <div *ngIf="!isLoggedIn" class="login-container">
      <h1 class="edulink-title">Edulink</h1>
      <h2 style="text-align: center; margin-bottom: 1.5rem; color: #374151;">Iniciar sesion</h2>
      
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <div class="form-group">
          <label for="username">Nombre de Usuario</label>
          <input 
            type="text" 
            id="username"
            name="username"
            class="form-control"
            [(ngModel)]="user.username"
            required
            minlength="3"
            #username="ngModel">
          <div *ngIf="username.invalid && (username.dirty || username.touched)" class="error-message">
            <div *ngIf="username.errors?.['required']">Nombre de usuario requerida</div>
            <div *ngIf="username.errors?.['minlength']">Debe de tener al menos 3 digitos</div>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password"
            name="password"
            class="form-control"
            [(ngModel)]="user.password"
            required
            minlength="6"
            #password="ngModel">
          <div *ngIf="password.invalid && (password.dirty || password.touched)" class="error-message">
            <div *ngIf="password.errors?.['required']">contraseña requerida</div>
            <div *ngIf="password.errors?.['minlength']">La contraseña debe de tener un minimo de 6 digitos</div>
          </div>
        </div>

        <button 
          type="submit" 
          class="btn btn-primary btn-block"
          [disabled]="!loginForm.form.valid">
          Login
        </button>
      </form>
    </div>
    <div class="fondo">
    <div *ngIf="isLoggedIn" class="crud-container">
      <div class="header-actions">
        <h1 style="color: #374151;">Listado de Personal</h1>
        <div class="actions-right">
          <div class="search-box">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar personal..."
              [(ngModel)]="searchTerm"
              (input)="filterEmployees()">
          </div>
          <button class="btn btn-success" (click)="openAddModal()">
            Agregar 
          </button>
          <button class="btn warning" (click)="exportToExcel()">
            Exportar a Excel
          </button>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Cumpleaños</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let employee of paginatedEmployees">
              <td>{{employee.id}}</td>
              <td>{{employee.nombres}}</td>
              <td>{{employee.apellidos}}</td>
              <td>{{employee.email}}</td>
              <td>{{employee.cumpleanos | date:'dd/MM/yyyy'}}</td>
              <td>
                <span [class]="'status-badge ' + employee.estado.toLowerCase()">
                  {{employee.estado}}
                </span>
              </td>
              <td class="actions">
                <button class="btn btn-sm btn-primary" (click)="openEditModal(employee)" title="Editar">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger" (click)="confirmDelete(employee)" title="Eliminar">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pafinacion -->
      <div class="pagination">
        <button 
          class="btn btn-primary"
          [disabled]="currentPage === 1"
          (click)="changePage(currentPage - 1)">
          Anterior
        </button>
        <span class="page-info">
          Página {{currentPage}} de {{totalPages}}
        </span>
        <button 
          class="btn btn-primary"
          [disabled]="currentPage === totalPages"
          (click)="changePage(currentPage + 1)">
          Siguiente
        </button>
      </div>

      <!-- Editar/Agregar-->
      <div class="modal" *ngIf="showModal">
        <div class="modal-content">
          <h2 style="margin-bottom: 1.5rem">{{editingEmployee ? 'Editar' : 'Agregar'}} Personal</h2>
          <form (ngSubmit)="saveEmployee()" #employeeForm="ngForm">
            <div class="form-group">
              <label for="nombres">Nombres</label>
              <input 
                type="text" 
                id="nombres"
                name="nombres"
                class="form-control"
                [(ngModel)]="currentEmployee.nombres"
                required
                #nombres="ngModel">
              <div *ngIf="nombres.invalid && (nombres.dirty || nombres.touched)" class="error-message">
                <div *ngIf="nombres.errors?.['required']">Nombres son requeridos</div>
              </div>
            </div>

            <div class="form-group">
              <label for="apellidos">Apellidos</label>
              <input 
                type="text" 
                id="apellidos"
                name="apellidos"
                class="form-control"
                [(ngModel)]="currentEmployee.apellidos"
                required
                #apellidos="ngModel">
              <div *ngIf="apellidos.invalid && (apellidos.dirty || apellidos.touched)" class="error-message">
                <div *ngIf="apellidos.errors?.['required']">Apellidos son requeridos</div>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email"
                name="email"
                class="form-control"
                [(ngModel)]="currentEmployee.email"
                required
                email
                #email="ngModel">
              <div *ngIf="email.invalid && (email.dirty || email.touched)" class="error-message">
                <div *ngIf="email.errors?.['required']">Email es requerido</div>
                <div *ngIf="email.errors?.['email']">Email no válido</div>
              </div>
            </div>

            <div class="form-group">
              <label for="cumpleanos">Cumpleaños</label>
              <input 
                type="date" 
                id="cumpleanos"
                name="cumpleanos"
                class="form-control"
                [(ngModel)]="currentEmployee.cumpleanos"
                required
                #cumpleanos="ngModel">
              <div *ngIf="cumpleanos.invalid && (cumpleanos.dirty || cumpleanos.touched)" class="error-message">
                <div *ngIf="cumpleanos.errors?.['required']">Cumpleaños es requerido</div>
              </div>
            </div>

            <div class="form-group">
              <label for="estado">Estado</label>
              <select 
                id="estado"
                name="estado"
                class="form-control"
                [(ngModel)]="currentEmployee.estado"
                required
                #estado="ngModel">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <div *ngIf="estado.invalid && (estado.dirty || estado.touched)" class="error-message">
                <div *ngIf="estado.errors?.['required']">Estado es requerido</div>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end">
              <button type="button" class="btn btn-danger" (click)="closeModal()">
                Cancelar
              </button>
              <button 
                type="submit" 
                class="btn btn-success"
                [disabled]="!employeeForm.form.valid">
                {{editingEmployee ? 'Actualizar' : 'Guardar'}}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal" *ngIf="showDeleteConfirmation">
        <div class="modal-content confirmation-modal">
          <h2 style="margin-bottom: 1.5rem">Confirmar Eliminación</h2>
          <p>¿Está seguro que desea eliminar a {{employeeToDelete?.nombres}} {{employeeToDelete?.apellidos}}?</p>
          <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem">
            <button class="btn btn-secondary" (click)="cancelDelete()">
              Cancelar
            </button>
            <button class="btn btn-danger" (click)="deleteEmployee()">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class App {
  user: User = {
    username: '',
    password: ''
  };
  
  isLoggedIn = false;
  showModal = false;
  showDeleteConfirmation = false;
  editingEmployee: Employee | null = null;
  employeeToDelete: Employee | null = null;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 4;

  employees: Employee[] = Array.from({ length: 55 }, (_, i) => ({
    id: i + 1,
    nombres: `Nombre${i + 1}`,
    apellidos: `Apellido${i + 1}`,
    email: `empleado${i + 1}@empresa.com`,
    cumpleanos: new Date(1980 + Math.floor(i/12), i % 12, 1 + (i % 28)).toISOString().split('T')[0],
    estado: i % 5 === 0 ? 'Inactivo' : 'Activo'
  }));

  filteredEmployees: Employee[] = [...this.employees];

  currentEmployee: Employee = {
    id: 0,
    nombres: '',
    apellidos: '',
    email: '',
    cumpleanos: '',
    estado: 'Activo'
  };

  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  get paginatedEmployees(): Employee[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onSubmit() {
    if (this.user.username && this.user.password) {
      this.isLoggedIn = true;
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddModal() {
    this.editingEmployee = null;
    this.currentEmployee = {
      id: this.employees.length + 1,
      nombres: '',
      apellidos: '',
      email: '',
      cumpleanos: '',
      estado: 'Activo'
    };
    this.showModal = true;
  }

  openEditModal(employee: Employee) {
    this.editingEmployee = employee;
    this.currentEmployee = { ...employee };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingEmployee = null;
  }

  confirmDelete(employee: Employee) {
    this.employeeToDelete = employee;
    this.showDeleteConfirmation = true;
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.employeeToDelete = null;
  }

  deleteEmployee() {
    if (this.employeeToDelete) {
      this.employees = this.employees.filter(e => e.id !== this.employeeToDelete!.id);
      this.filterEmployees();
      this.showDeleteConfirmation = false;
      this.employeeToDelete = null;
    }
  }

  saveEmployee() {
    if (this.editingEmployee) {
      const index = this.employees.findIndex(e => e.id === this.editingEmployee!.id);
      this.employees[index] = { ...this.currentEmployee };
    } else {
      this.employees.push({ ...this.currentEmployee });
    }
    this.filterEmployees();
    this.closeModal();
  }

  filterEmployees() {
    if (!this.searchTerm) {
      this.filteredEmployees = [...this.employees];
    } else {
      const search = this.searchTerm.toLowerCase();
      this.filteredEmployees = this.employees.filter(employee => 
        employee.nombres.toLowerCase().includes(search) ||
        employee.apellidos.toLowerCase().includes(search) ||
        employee.email.toLowerCase().includes(search)
      );
    }
    this.currentPage = 1;
  }

  exportToExcel() {
    const data = this.employees.map(employee => ({
      ID: employee.id,
      Nombres: employee.nombres,
      Apellidos: employee.apellidos,
      Email: employee.email,
      Cumpleaños: employee.cumpleanos,
      Estado: employee.estado
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Empleados');
    XLSX.writeFile(wb, 'listado_personal.xlsx');
  }
}

bootstrapApplication(App);