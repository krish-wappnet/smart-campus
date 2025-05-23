import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { FormsModule } from '@angular/forms';
import * as QRCode from 'qrcode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface QrCodeDialogData {
  classId: string;
  qrCode: string;
  expiresAt?: Date;
  className?: string;
}

@Component({
  selector: 'app-qr-code-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ZXingScannerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Mark Attendance</h2>
    <mat-dialog-content>
      <div class="qr-image-container">
        <img *ngIf="qrCodeDataUrl" [src]="qrCodeDataUrl" alt="QR Code" width="200" height="200" />
      </div>
      <form (ngSubmit)="onSubmit()" #attendanceForm="ngForm">
        <mat-form-field appearance="outline" style="width: 100%; margin-top: 16px;">
          <mat-label>Email</mat-label>
          <input matInput type="email" name="email" [(ngModel)]="email" required />
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="!email || loading">
          <span *ngIf="!loading">Submit</span>
          <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
        </button>
      </form>
      <p class="scan-instructions">Enter your email and click Submit to mark attendance.</p>
      <div *ngIf="message" class="message">{{ message }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .qr-image-container {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }
    .scan-instructions {
      text-align: center;
      margin-top: 16px;
      color: #666;
    }
    .message {
      margin-top: 16px;
      color: #388e3c;
      text-align: center;
    }
  `]
})
export class QrCodeDialogComponent {
  BarcodeFormat = BarcodeFormat;
  qrCodeDataUrl: string = '';
  email: string = '';
  loading = false;
  message = '';
  private apiUrl = 'http://localhost:3000/classes';

  constructor(
    public dialogRef: MatDialogRef<QrCodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QrCodeDialogData,
    private http: HttpClient
  ) {
    this.generateQrCodeDataUrl(data.qrCode);
  }

  generateQrCodeDataUrl(token: string) {
    QRCode.toDataURL(token, { width: 200, margin: 1 }, (err: Error | null, url: string | undefined) => {
      if (!err && url) {
        this.qrCodeDataUrl = url;
      }
    });
  }

  onSubmit() {
    if (!this.email) return;
    this.loading = true;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(
      `${this.apiUrl}/${this.data.classId}/mark-attendance`,
      {
        token: this.data.qrCode,
        email: this.email
      },
      { headers }
    ).subscribe({
      next: (response: any) => {
        this.message = `Attendance marked successfully! Status: ${response.status}`;
        this.loading = false;
        setTimeout(() => this.dialogRef.close(true), 1500);
      },
      error: (error) => {
        this.message = error.error?.message || 'Failed to mark attendance. Please try again.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}