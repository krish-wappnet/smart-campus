import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-qr-code-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatButtonModule,
    MatIconModule
  ],
  providers: [DatePipe],
  templateUrl: './qr-code-dialog.component.html',
  styleUrls: ['./qr-code-dialog.component.scss']
})
export class QrCodeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<QrCodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { qrCode: string; expiresAt: Date | string },
    private datePipe: DatePipe
  ) {
    // Ensure expiresAt is a Date object
    if (typeof this.data.expiresAt === 'string') {
      this.data.expiresAt = new Date(this.data.expiresAt);
    }
  }

  get formattedExpiry(): string {
    return this.datePipe.transform(this.data.expiresAt, 'shortTime') || '';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
