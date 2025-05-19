import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';

import { Class } from '../class.interface';

@Component({
  selector: 'app-add-class',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="dialog-content">
      <h2>Add Class</h2>
      <form [formGroup]="classForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Class Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Faculty</mat-label>
          <mat-select formControlName="facultyId" required>
            <mat-option *ngFor="let faculty of facultyList" [value]="faculty.id">
              {{ faculty.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Room</mat-label>
          <mat-select formControlName="roomId" required>
            <mat-option *ngFor="let room of roomList" [value]="room.id">
              {{ room.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Timeslot</mat-label>
          <mat-select formControlName="timeslotId" required>
            <mat-option *ngFor="let timeslot of timeslotList" [value]="timeslot.id">
              {{ timeslot.dayOfWeek.charAt(0).toUpperCase() + timeslot.dayOfWeek.slice(1) }} -
              {{ timeslot.startTime }} to {{ timeslot.endTime }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="dialog-actions">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!classForm.valid">Add Class</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-content {
      padding: 24px;
      max-width: 500px;
    }

    h2 {
      margin-bottom: 24px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }
  `]
})
export class AddClassComponent {
  classForm: FormGroup;
  facultyList: any[] = [];
  roomList: any[] = [];
  timeslotList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddClassComponent>,
    private api: ApiService
  ) {
    this.classForm = this.fb.group({
      name: ['', [Validators.required]],
      facultyId: ['', [Validators.required]],
      roomId: ['', [Validators.required]],
      timeslotId: ['', [Validators.required]]
    });

    // Load dropdown data
    this.loadFacultyList();
    this.loadRoomList();
    this.loadTimeslotList();
  }

  loadFacultyList(): void {
    this.api.getFacultyUsers().subscribe({
      next: (data: any) => {
        this.facultyList = data;
      },
      error: (error: any) => {
        console.error('Error loading faculty:', error);
      }
    });
  }

  loadRoomList(): void {
    this.api.getRooms().subscribe({
      next: (data: any) => {
        this.roomList = data;
      },
      error: (error: any) => {
        console.error('Error loading rooms:', error);
      }
    });
  }

  loadTimeslotList(): void {
    this.api.getTimeslots().subscribe({
      next: (data: any) => {
        this.timeslotList = data;
      },
      error: (error: any) => {
        console.error('Error loading timeslots:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.classForm.valid) {
      const classData: Class = this.classForm.value;
      this.api.createClass(classData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error creating class:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
