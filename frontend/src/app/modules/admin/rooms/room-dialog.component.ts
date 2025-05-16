import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Room } from '../../../models/room.model';

@Component({
  selector: 'app-room-dialog',
  template: `
    <h2 mat-dialog-title>{{ mode === 'add' ? 'Add Room' : 'Edit Room' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="roomForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Room Name</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="roomForm.get('name')?.hasError('required')">
            Room name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Capacity</mat-label>
          <input matInput type="number" formControlName="capacity" required>
          <mat-error *ngIf="roomForm.get('capacity')?.hasError('required')">
            Capacity is required
          </mat-error>
          <mat-error *ngIf="roomForm.get('capacity')?.hasError('min')">
            Capacity must be at least 1
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Location</mat-label>
          <input matInput formControlName="location" required>
          <mat-error *ngIf="roomForm.get('location')?.hasError('required')">
            Location is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Equipment</mat-label>
          <input matInput formControlName="equipment" placeholder="Comma separated list">
          <mat-error *ngIf="roomForm.get('equipment')?.hasError('required')">
            Equipment is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" required></textarea>
          <mat-error *ngIf="roomForm.get('description')?.hasError('required')">
            Description is required
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="roomForm.value" [disabled]="roomForm.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-error {
      font-size: 12px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,      // For mat-dialog-title, mat-dialog-content, mat-dialog-actions
    MatFormFieldModule,   // For mat-form-field
    MatInputModule,       // For matInput
    MatButtonModule       // For mat-button
  ]
})
export class RoomDialogComponent {
  roomForm: FormGroup;
  mode: 'add' | 'edit';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', room?: Room }
  ) {
    this.mode = data.mode;
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      equipment: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (data.room) {
      this.roomForm.patchValue(data.room);
    }
  }

  onSubmit() {
    if (this.roomForm.valid) {
      this.dialogRef.close(this.roomForm.value);
    }
  }
}