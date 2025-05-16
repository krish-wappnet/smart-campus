import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimetableEntry } from '../../../models/timetable.model';
import { adminActions } from '../store/admin.actions';
import { CommonMaterialModule } from '../common-material.module';
import { TimetableDialogComponent } from './timetable-dialog.component';

@Component({
  selector: 'app-timetable',
  template: `
    <div class="container">
      <h2>Timetable Management</h2>
      
      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Filter by Day</mat-label>
          <mat-select [(value)]="selectedDay">
            <mat-option value="">All Days</mat-option>
            <mat-option value="monday">Monday</mat-option>
            <mat-option value="tuesday">Tuesday</mat-option>
            <mat-option value="wednesday">Wednesday</mat-option>
            <mat-option value="thursday">Thursday</mat-option>
            <mat-option value="friday">Friday</mat-option>
            <mat-option value="saturday">Saturday</mat-option>
            <mat-option value="sunday">Sunday</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="timetable-grid">
        <div *ngFor="let entry of filteredEntries" class="timetable-entry">
          <div class="entry-header">
            <span class="day">{{ entry.day }}</span>
            <span class="time">{{ entry.startTime }} - {{ entry.endTime }}</span>
          </div>
          <div class="entry-details">
            <p><strong>Class:</strong> {{ entry.className }}</p>
            <p><strong>Room:</strong> {{ entry.room }}</p>
            <p><strong>Teacher:</strong> {{ entry.teacherName }}</p>
            <button mat-icon-button (click)="openEditDialog(entry)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button (click)="deleteEntry(entry.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <button mat-raised-button color="primary" (click)="openAddDialog()">
        Add Timetable Entry
      </button>

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
    .timetable-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .timetable-entry {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 4px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .entry-details {
      padding: 10px;
      border-top: 1px solid #eee;
    }
  `],
  standalone: true,
  imports: [CommonMaterialModule, CommonModule, ReactiveFormsModule]
})
export class TimetableComponent implements OnInit {
  timetableEntries: TimetableEntry[] = [];
  selectedDay: string = '';
  timetableForm: FormGroup;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.timetableForm = this.fb.group({
      day: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      className: ['', Validators.required],
      roomName: ['', Validators.required],
      teacherName: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadTimetable();
  }

  loadTimetable() {
    this.store.dispatch(adminActions.loadTimetable());
  }

  get filteredEntries() {
    if (!this.selectedDay) {
      return this.timetableEntries;
    }
    return this.timetableEntries.filter(entry => entry.day === this.selectedDay);
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(TimetableDialogComponent, {
      width: '600px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(adminActions.addTimetableEntry({
        timetableEntry: this.timetableForm.value
      }));
      }
    });
  }

  openEditDialog(entry: TimetableEntry) {
    const dialogRef = this.dialog.open(TimetableDialogComponent, {
      width: '600px',
      data: { mode: 'edit', entry }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(adminActions.updateTimetableEntry({
        timetableEntry: { ...entry, ...result }
      }));
      }
    });
  }

  deleteEntry(entryId: string) {
    if (confirm('Are you sure you want to delete this timetable entry?')) {
      this.store.dispatch(adminActions.deleteTimetableEntry({ entryId }));
    }
  }
}
