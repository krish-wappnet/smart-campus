import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { QrScannerModule } from '../../../../shared/qr-scanner/qr-scanner.module';
import { environment } from '../../../../../environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    QrScannerModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Scan QR Code</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="scanner-container">
          <zxing-scanner
            #scanner
            [enable]="scannerEnabled"
            [device]="selectedDevice || undefined"
            [formats]="allowedFormats"
            (camerasFound)="onCamerasFound($event)"
            (scanSuccess)="onScanSuccess($event)"
            (permissionResponse)="onHasPermission($event)">
          </zxing-scanner>

          <div *ngIf="!hasDevices" class="no-devices">
            <mat-spinner></mat-spinner>
            <p>Looking for camera devices...</p>
          </div>

          <div *ngIf="hasDevices && availableDevices.length > 1" class="device-selector">
            <mat-form-field appearance="outline">
              <mat-label>Select Camera</mat-label>
              <mat-select [(value)]="selectedDevice">
                <mat-option *ngFor="let device of availableDevices" [value]="device">
                  {{ device.label || device.deviceId }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <div *ngIf="qrResult" class="scan-result">
          <h3>Scan Result:</h3>
          <pre>{{ qrResult | json }}</pre>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button color="primary" [routerLink]="['/student/dashboard']">
          <mat-icon>arrow_back</mat-icon> Back to Dashboard
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .scanner-container {
      position: relative;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .no-devices {
      text-align: center;
      padding: 2rem;
    }
    
    .device-selector {
      margin: 1rem 0;
    }
    
    .scan-result {
      margin-top: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
    }
    
    zxing-scanner {
      display: block;
      border-radius: 4px;
      overflow: hidden;
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QrScannerComponent implements OnDestroy {
  @ViewChild('scanner') scanner!: ZXingScannerComponent;
  
  // Scanner configuration
  scannerEnabled = true;
  hasDevices = false;
  hasPermission = false;
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | null = null;
  qrResult: any;
  loading = false;
  allowedFormats = [BarcodeFormat.QR_CODE];
  
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  // Handle camera devices found
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = devices && devices.length > 0;
    
    // Select the first available camera
    if (this.hasDevices) {
      this.selectedDevice = devices[0];
    }
  }

  // Handle scan success
  onScanSuccess(result: string): void {
    this.qrResult = result;
    this.loading = true;
    
    try {
      // Try to parse as URL first
      const url = new URL(result);
      const params = new URLSearchParams(url.search);
      const token = params.get('token');
      const classId = params.get('classId');
      
      if (token && classId) {
        this.markAttendanceFromUrl(token, classId);
      } else {
        this.markAttendanceFromQRCode(result);
      }
    } catch (e) {
      // If it's not a valid URL, try to process as direct QR code data
      this.markAttendanceFromQRCode(result);
    }
  }

  // Handle permission response
  onHasPermission(has: boolean): void {
    this.hasPermission = has;
    if (!has) {
      this.snackBar.open('Camera access was denied', 'OK', { duration: 5000 });
    }
  }

  private async markAttendanceFromQRCode(qrCode: string) {
    try {
      const response: any = await this.http.post(
        `${environment.apiUrl}/attendance/mark`,
        { qrCode }
      ).toPromise();
      
      this.showSuccess(response);
    } catch (error: any) {
      this.handleError(error);
    } finally {
      this.loading = false;
    }
  }

  private async markAttendanceFromUrl(token: string, classId: string) {
    try {
      const response: any = await this.http.post(
        `${environment.apiUrl}/attendance/mark/url?token=${token}&classId=${classId}`,
        {}
      ).toPromise();
      
      this.showSuccess(response);
    } catch (error: any) {
      this.handleError(error);
    } finally {
      this.loading = false;
    }
  }

  private showSuccess(response: any) {
    let message = 'Attendance marked successfully!';
    if (response.alreadyMarked) {
      message = 'Attendance was already marked for this session.';
    }
    
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
    
    // Navigate back after a short delay
    setTimeout(() => {
      this.router.navigate(['/student/dashboard']);
    }, 2000);
  }

  private handleError(error: any) {
    console.error('Error marking attendance:', error);
    let errorMessage = 'Failed to mark attendance. Please try again.';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 403) {
      errorMessage = 'You are not authorized to mark attendance for this class.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid QR code. Please scan a valid attendance QR code.';
    }
    
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.selectedDevice = device || null;
  }


  ngOnDestroy(): void {
    this.scannerEnabled = false;
  }
}
