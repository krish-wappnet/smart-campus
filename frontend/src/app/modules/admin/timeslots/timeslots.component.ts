import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Timeslot } from '../../../models/timeslot.model';
import { TimeslotDialogComponent } from './timeslot-dialog.component';
import { selectTimeslots } from '../store/admin.selector';
import { adminActions } from '../store/admin.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonMaterialModule } from '../common-material.module';

@Component({
  selector: 'app-timeslots',
  template: `
    <div class="container">
      <h2>Timeslots Management</h2>
      
      <button mat-raised-button color="primary" (click)="openAddDialog()">
        Add Timeslot
      </button>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Search timeslots...">
        </mat-form-field>
      </div>

      <div class="timeslots-grid">
        <div *ngFor="let timeslot of timeslots$ | async" class="timeslot-card">
          <h3>{{ timeslot.name }}</h3>
          <p>Start Time: {{ timeslot.startTime }}</p>
          <p>End Time: {{ timeslot.endTime }}</p>
          <p>Days: {{ timeslot.days.join(', ') }}</p>
          <button mat-icon-button (click)="openEditDialog(timeslot)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteTimeslot(timeslot.id)">
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
    .timeslots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .timeslot-card {
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
    CommonMaterialModule,
    FormsModule
  ]
})
export class TimeslotsComponent implements OnInit {
  timeslots$: Observable<Timeslot[]>;
  searchTerm: string = '';

  constructor(
    private store: Store,
    private dialog: MatDialog
  ) {
    this.timeslots$ = this.store.select(selectTimeslots);
  }

  ngOnInit() {
    this.store.dispatch(adminActions.loadTimeslots());
  }

  get filteredTimeslots() {
    return this.timeslots$.pipe(
      map((timeslots: Timeslot[]) => timeslots.filter(timeslot => 
        timeslot.dayOfWeek.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        timeslot.startTime.includes(this.searchTerm) ||
        timeslot.endTime.includes(this.searchTerm)
      ))
    );
  }

  openAddDialog() {
    const dialogRef = this.dialog.open<any>(TimeslotDialogComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe((result: Timeslot | undefined) => {
      if (result) {
        this.store.dispatch(adminActions.addTimeslot({ timeslot: result }));
      }
    });
  }

  openEditDialog(timeslot: Timeslot) {
    const dialogRef = this.dialog.open<any>(TimeslotDialogComponent, {
      width: '500px',
      data: { mode: 'edit', timeslot }
    });

    dialogRef.afterClosed().subscribe((result: Timeslot | undefined) => {
      if (result) {
        this.store.dispatch(adminActions.updateTimeslot({ timeslot: result }));
      }
    });
  }

  deleteTimeslot(timeslotId: string) {
    if (confirm('Are you sure you want to delete this timeslot?')) {
      this.store.dispatch(adminActions.deleteTimeslot({ timeslotId }));
    }
  }
}
