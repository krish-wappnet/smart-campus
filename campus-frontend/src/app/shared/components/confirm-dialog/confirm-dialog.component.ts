import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false" cdkFocusInitial>
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button 
        mat-raised-button 
        [color]="data.confirmColor || 'primary'"
        [mat-dialog-close]="true"
      >
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 400px;
        width: 100%;
      }
      
      h2 {
        margin: 0 0 16px;
        font-size: 20px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
      }
      
      p {
        margin: 0 0 16px;
        font-size: 16px;
        line-height: 1.5;
        color: rgba(0, 0, 0, 0.6);
      }
      
      mat-dialog-actions {
        padding: 8px 24px 16px;
        margin: 0 -24px -16px;
      }
      
      button {
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        h2 {
          color: rgba(255, 255, 255, 0.87);
        }
        
        p {
          color: rgba(255, 255, 255, 0.6);
        }
      }
    `
  ]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
