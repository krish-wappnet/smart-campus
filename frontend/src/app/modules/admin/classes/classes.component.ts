import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Class } from '../../../models/class.model';
import { adminActions } from '../store/admin.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClassDialogComponent } from './class-dialog.component';

@Component({
  selector: 'app-classes',
  template: `
    <div class="container">
      <h2>Classes Management</h2>
      
      <button mat-raised-button color="primary" (click)="openAddDialog()">
        Add Class
      </button>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Search classes...">
        </mat-form-field>
      </div>

      <div class="classes-grid">
        <div *ngFor="let class of filteredClasses" class="class-card">
          <h3>{{ class.name }}</h3>
          <p>Section: {{ class.section }}</p>
          <p>Teacher: {{ class.teacherName }}</p>
          <button mat-icon-button (click)="openEditDialog(class)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteClass(class.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>

      <mat-dialog-container></mat-dialog-container>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .filters {
      margin: 20px 0;
    }
    .classes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .class-card {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 4px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatDialogModule
]
})
export class ClassesComponent implements OnInit {
  classes: Class[] = [];
  searchTerm: string = '';
  classForm: FormGroup;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      section: ['', Validators.required],
      teacherName: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      
    });
  }

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.store.dispatch(adminActions.loadClasses());
  }

  get filteredClasses() {
    const searchTerm = this.searchTerm.toLowerCase();
    return this.classes.filter((selectedClass: Class) =>
      selectedClass.name.toLowerCase().includes(searchTerm) ||
      (selectedClass.code && selectedClass.code.toLowerCase().includes(searchTerm))
    );
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ClassDialogComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(adminActions.addClass({ class: result }));
      }
    });
  }

  openEditDialog(selectedClass: Class) {
    const dialogRef = this.dialog.open(ClassDialogComponent, {
      width: '500px',
      data: { mode: 'edit', class: selectedClass }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(adminActions.updateClass({ class: result }));
      }
    });
  }

  deleteClass(id: string) {
    if (confirm('Are you sure you want to delete this class?')) {
      this.store.dispatch(adminActions.deleteClass({ classId: id }));
    }
  }
}
