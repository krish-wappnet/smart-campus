import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
// Material modules are imported in StudentModule

const routes: Routes = [
  {
    path: 'scan',
    component: QrScannerComponent,
    data: { title: 'Scan QR Code' }
  }
];

@NgModule({
  declarations: [QrScannerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    // Material modules are provided by the parent module
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ZXingScannerModule
  ]
})
export class AttendanceModule { }
