import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-title>Student Profile</mat-card-title>
        
        <mat-card-content>
          <div class="profile-header">
            <div class="profile-image">
              <img [src]="profilePhoto" alt="Profile Photo" />
            </div>
            <div class="profile-info">
              <h2>{{ studentName }}</h2>
              <p class="student-id">Student ID: {{ studentId }}</p>
              <p class="program">{{ program }}</p>
            </div>
          </div>

          <div class="profile-sections">
            <mat-card class="section-card">
              <mat-card-title>Contact Information</mat-card-title>
              <mat-card-content>
                <div class="contact-info">
                  <mat-icon>email</mat-icon>
                  <span>{{ email }}</span>
                </div>
                <div class="contact-info">
                  <mat-icon>phone</mat-icon>
                  <span>{{ phone }}</span>
                </div>
                <div class="contact-info">
                  <mat-icon>home</mat-icon>
                  <span>{{ address }}</span>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="section-card">
              <mat-card-title>Academic Information</mat-card-title>
              <mat-card-content>
                <div class="academic-info">
                  <div class="info-item">
                    <mat-icon>school</mat-icon>
                    <div>
                      <span class="label">Year of Study</span>
                      <span class="value">{{ yearOfStudy }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <mat-icon>calendar_today</mat-icon>
                    <div>
                      <span class="label">Enrollment Date</span>
                      <span class="value">{{ enrollmentDate | date:'mediumDate' }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <mat-icon>class</mat-icon>
                    <div>
                      <span class="label">Current CGPA</span>
                      <span class="value">{{ cgpa }}</span>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="section-card">
              <mat-card-title>Emergency Contacts</mat-card-title>
              <mat-card-content>
                <div class="contact-list">
                  <div *ngFor="let contact of emergencyContacts" class="contact-item">
                    <div class="contact-name">
                      <mat-icon>person</mat-icon>
                      <span>{{ contact.name }}</span>
                    </div>
                    <div class="contact-details">
                      <div class="contact-detail">
                        <mat-icon>phone</mat-icon>
                        <span>{{ contact.phone }}</span>
                      </div>
                      <div class="contact-detail">
                        <mat-icon>relation</mat-icon>
                        <span>{{ contact.relationship }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .profile-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .profile-header {
      display: flex;
      gap: 32px;
      margin-bottom: 32px;
      align-items: center;
    }

    .profile-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid #2196f3;
    }

    .profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-info h2 {
      font-size: 24px;
      color: #333;
      margin: 0;
    }

    .student-id {
      color: #666;
      font-size: 16px;
      margin: 8px 0;
    }

    .program {
      color: #2196f3;
      font-size: 16px;
      margin: 0;
    }

    .profile-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .section-card {
      background: #f8f9fa;
      border-radius: 8px;
    }

    .contact-info {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid #eee;
    }

    .contact-info:last-child {
      border-bottom: none;
    }

    .academic-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid #eee;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .label {
      color: #666;
      font-size: 14px;
    }

    .value {
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }

    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid #eee;
    }

    .contact-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .contact-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .contact-detail {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }

    @media (max-width: 768px) {
      .profile-header {
        flex-direction: column;
        text-align: center;
        align-items: center;
      }

      .profile-sections {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StudentProfileComponent implements OnInit {
  profilePhoto = 'assets/default-profile.png';
  studentName = '';
  studentId = '';
  program = '';
  email = '';
  phone = '';
  address = '';
  yearOfStudy = '';
  enrollmentDate = new Date();
  cgpa = '';
  emergencyContacts: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadProfileData();
  }

  loadProfileData() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    this.api.getStudentProfile().subscribe({
      next: (profile: any) => {
        this.studentName = profile.name;
        this.studentId = profile.studentId;
        this.program = profile.program;
        this.email = profile.email;
        this.phone = profile.phone;
        this.address = profile.address;
        this.yearOfStudy = profile.yearOfStudy;
        this.enrollmentDate = new Date(profile.enrollmentDate);
        this.cgpa = profile.cgpa;
        this.emergencyContacts = profile.emergencyContacts;

        if (profile.photoUrl) {
          this.profilePhoto = profile.photoUrl;
        }
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
      }
    });
  }
}
