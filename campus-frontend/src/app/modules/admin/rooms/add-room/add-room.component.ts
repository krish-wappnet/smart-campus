import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';

import { Room } from '../room.interface';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule
  ],
  template: `
    <div class="dialog-content">
      <h2>Add Room</h2>
      <form [formGroup]="roomForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Room Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Capacity</mat-label>
          <input matInput type="number" formControlName="capacity" required min="1">
        </mat-form-field>

        <div class="dialog-actions">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!roomForm.valid">Add Room</button>
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
export class AddRoomComponent {
  roomForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRoomComponent>,
    private api: ApiService
  ) {
    this.roomForm = this.fb.group({
      name: ['', [Validators.required]],
      capacity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      const roomData: Room = this.roomForm.value;
      this.api.createRoom(roomData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error creating room:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}