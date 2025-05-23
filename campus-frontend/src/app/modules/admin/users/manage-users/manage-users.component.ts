import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule, FloatLabelType } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import * as XLSX from 'xlsx';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    EditUserComponent
  ],
  template: `
    <div class="manage-users-container">
      <div class="header">
        <div class="header-content">
          <div class="header-text">
            <h2>User Management</h2>
            <p class="subtitle">Manage system users and their permissions</p>
          </div>
          <button
            mat-raised-button
            color="primary"
            (click)="addUser()"
            class="add-button"
          >
            <mat-icon>person_add</mat-icon>
            Add New User
          </button>
        </div>
      </div>

      <!-- Admin Card Section -->
      <div class="admin-section" *ngIf="admins.length > 0">
        <div class="section-header">
          <div class="section-title">
            <mat-icon class="section-icon">admin_panel_settings</mat-icon>
            <h3>Administrators</h3>
          </div>
          <span class="badge">{{ admins.length }} Admin{{ admins.length !== 1 ? 's' : '' }}</span>
        </div>
        <div class="admin-cards">
          <mat-card *ngFor="let admin of admins" class="admin-card">
            <mat-card-header>
              <div mat-card-avatar class="admin-avatar">
                <mat-icon>admin_panel_settings</mat-icon>
              </div>
              <mat-card-title>{{ admin.name }}</mat-card-title>
              <mat-card-subtitle>Administrator</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p><mat-icon>email</mat-icon> {{ admin.email }}</p>
              <p><mat-icon>calendar_today</mat-icon> Joined {{ admin.createdAt | date:'mediumDate' }}</p>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-icon-button (click)="editUser(admin)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteUser(admin)" matTooltip="Delete" *ngIf="admins.length > 1">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <!-- Tabs for Students and Faculty -->
      <div class="tabs-container">
        <mat-tab-group class="user-tabs" animationDuration="300ms" mat-stretch-tabs="false" mat-align-tabs="start">
          <!-- Students Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <div class="tab-label">
                <mat-icon>school</mat-icon>
                <span>Students</span>
                <span class="tab-badge">{{ students.length }}</span>
              </div>
            </ng-template>
            <div class="table-responsive">
              <div class="table-toolbar">
                <div class="search-container">
                  <mat-form-field appearance="outline" [floatLabel]="floatLabel" class="search-field">
                    <mat-label>Search students</mat-label>
                    <input 
                      matInput 
                      placeholder="Search by name or email" 
                      #searchInput 
                      (keyup)="applyFilter($event, 'students')"
                      aria-label="Search students">
                    <button mat-icon-button matSuffix aria-label="Search">
                      <mat-icon>search</mat-icon>
                    </button>
                  </mat-form-field>
                </div>
                <div class="table-actions">
                  <button mat-button color="primary" (click)="exportToExcel(students, 'students')">
                    <mat-icon>download</mat-icon> Export
                  </button>
                </div>
              </div>
              
              <table mat-table [dataSource]="students" class="mat-elevation-z1">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let user">
                    <div class="user-info">
                      <div class="user-avatar student">{{ user.name.charAt(0).toUpperCase() }}</div>
                      <div class="user-details">
                        <span class="user-name">{{ user.name }}</span>
                        <span class="user-role">Student</span>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let user">
                    <div class="user-email">{{ user.email }}</div>
                  </td>
                </ng-container>


                <ng-container matColumnDef="joined">
                  <th mat-header-cell *matHeaderCellDef>Joined</th>
                  <td mat-cell *matCellDef="let user">
                    <div class="date-container">
                      <mat-icon>event</mat-icon>
                      <div class="date-details">
                        <span class="date">{{ user.createdAt | date:'mediumDate' }}</span>
                        <span class="time-ago">{{ getTimeAgo(user.createdAt) }}</span>
                      </div>
                    </div>
                  </td>
                </ng-container>


                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let user" class="actions-cell">
                    <div class="action-buttons">
                      <button mat-icon-button (click)="editUser(user)" matTooltip="Edit">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button (click)="deleteUser(user)" matTooltip="Delete" color="warn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                    [class.selected]="selectedRow === row"
                    (click)="selectRow(row)">
                </tr>
              </table>

            <mat-paginator
              [pageSize]="5"
              [pageSizeOptions]="[5, 10, 25]"
              showFirstLastButtons>
            </mat-paginator>
          </div>
        </mat-tab>

          <!-- Faculty Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <div class="tab-label">
                <mat-icon>school</mat-icon>
                <span>Faculty</span>
                <span class="tab-badge">{{ faculty.length }}</span>
              </div>
            </ng-template>
          <div class="table-responsive">
            <div class="table-toolbar">
              <div class="search-container">
                <mat-form-field appearance="outline" [floatLabel]="floatLabel" class="search-field">
                  <mat-label>Search faculty</mat-label>
                  <input 
                    matInput 
                    placeholder="Search by name or email" 
                    #facultySearch 
                    (keyup)="applyFilter($event, 'faculty')"
                    aria-label="Search faculty">
                  <button mat-icon-button matSuffix aria-label="Search">
                    <mat-icon>search</mat-icon>
                  </button>
                </mat-form-field>
              </div>
              <div class="table-actions">
                <button mat-button color="primary" (click)="exportToExcel(faculty, 'faculty')">
                  <mat-icon>download</mat-icon> Export
                </button>
              </div>
            </div>
            
            <table mat-table [dataSource]="faculty" class="mat-elevation-z1">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-info">
                    <div class="user-avatar faculty">{{ user.name.charAt(0).toUpperCase() }}</div>
                    <div class="user-details">
                      <span class="user-name">{{ user.name }}</span>
                      <span class="user-role">Faculty</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-email">{{ user.email }}</div>
                </td>
              </ng-container>

              <ng-container matColumnDef="joined">
                <th mat-header-cell *matHeaderCellDef>Joined</th>
                <td mat-cell *matCellDef="let user">
                  <div class="date-container">
                    <mat-icon>event</mat-icon>
                    <div class="date-details">
                      <span class="date">{{ user.createdAt | date:'mediumDate' }}</span>
                      <span class="time-ago">{{ getTimeAgo(user.createdAt) }}</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user" class="actions-cell">
                  <div class="action-buttons">
                    <button mat-icon-button (click)="editUser(user)" matTooltip="Edit">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="deleteUser(user)" matTooltip="Delete" color="warn">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                  [class.selected]="selectedRow === row"
                  (click)="selectRow(row)">
              </tr>
            </table>
            <mat-paginator
              [pageSize]="5"
              [pageSizeOptions]="[5, 10, 25]"
              showFirstLastButtons>
            </mat-paginator>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    /* Base Styles */
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');
    
    :host {
      --primary-color: #3f51b5;
      --primary-light: #757de8;
      --primary-dark: #002984;
      --accent-color: #ff4081;
      --warn-color: #f44336;
      --success-color: #4caf50;
      --text-primary: rgba(0, 0, 0, 0.87);
      --text-secondary: rgba(0, 0, 0, 0.6);
      --divider-color: rgba(0, 0, 0, 0.12);
      --background: #f5f5f5;
      --card-bg: #ffffff;
      --hover-bg: rgba(0, 0, 0, 0.04);
      --border-radius: 8px;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
      --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1);
      font-family: 'Roboto', sans-serif;
    }
    
    /* Layout */
    .manage-users-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
    }
    
    /* Header */
    .header {
      margin-bottom: 32px;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .header-text h2 {
      font-size: 28px;
      font-weight: 500;
      color: var(--primary-dark);
      margin: 0 0 4px 0;
    }
    
    .subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 14px;
    }
    
    /* Admin Section */
    .admin-section {
      margin-bottom: 32px;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }
    
    .section-title h3 {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
      color: var(--text-primary);
    }
    
    .section-icon {
      color: var(--primary-color);
    }
    
    .badge {
      background-color: var(--primary-light);
      color: white;
      border-radius: 16px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    /* Admin Cards */
    .admin-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .admin-card {
      border-radius: var(--border-radius) !important;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid var(--divider-color);
    }
    
    .admin-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md) !important;
    }
    
    .mat-mdc-card-header {
      padding: 16px 16px 8px;
      border-bottom: 1px solid var(--divider-color);
      background-color: rgba(63, 81, 181, 0.04);
    }
    
    .admin-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 18px;
    }
    
    .admin-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .admin-info {
      margin-left: 12px;
    }
    
    .admin-info .mat-mdc-card-title {
      font-size: 16px;
      font-weight: 500;
      margin: 0;
    }
    
    .admin-info .mat-mdc-card-subtitle {
      color: var(--text-secondary);
      font-size: 12px;
      margin: 2px 0 0 0;
    }
    
    .card-actions {
      margin-left: auto;
    }
    
    .mat-mdc-card-content {
      padding: 16px;
    }
    
    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .detail-row mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 8px;
      color: var(--primary-color);
    }
    
    /* Tabs */
    .tabs-container {
      background: white;
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    
    .mat-mdc-tab-group {
      --mdc-secondary-navigation-tab-container-height: 56px;
    }
    
    .mat-mdc-tab-header {
      background-color: white;
      border-bottom: 1px solid var(--divider-color);
    }
    
    .tab-label {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
    }
    
    .tab-badge {
      background-color: var(--primary-light);
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .mat-mdc-tab-body-wrapper {
      padding: 24px;
    }
    
    /* Table Toolbar */
    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 8px 0;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .search-container {
      flex: 1;
      min-width: 200px;
      max-width: 300px;
      display: flex;
      align-items: center;
      
      .mat-mdc-form-field {
        width: 100%;
        margin: 0;
        font-size: 13px;
        
        .mdc-text-field {
          background-color: #fff;
          border-radius: 20px;
          padding: 0 12px;
          height: 40px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          
          &:hover, &.mdc-text-field--focused {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transform: none;
          }
          
          .mdc-notched-outline {
            display: none;
          }
          
          .mat-mdc-form-field-infix {
            padding: 4px 0;
            min-height: 32px;
            width: auto;
          }
          
          .mat-mdc-form-field-flex {
            height: 100%;
            padding: 0;
            align-items: center;
          }
          
          .mat-mdc-form-field-icon-suffix {
            padding: 0;
            margin-left: 4px;
            opacity: 0.7;
            transition: opacity 0.2s ease;
            
            &:hover {
              opacity: 1;
            }
            
            button {
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              
              mat-icon {
                font-size: 18px;
                width: 18px;
                height: 18px;
                color: var(--primary-color);
              }
            }
          }
          
          input {
            padding: 4px 0;
            font-size: 14px;
            color: #333;
            caret-color: var(--primary-color);
            
            &::placeholder {
              color: #999;
              opacity: 1;
              transition: opacity 0.2s ease;
            }
            
            &:focus::placeholder {
              opacity: 0.7;
            }
          }
          
          .mat-mdc-form-field-label {
            color: #666;
            font-size: 14px;
            padding-left: 8px;
          }
          
          &.mat-mdc-form-field-should-float .mat-mdc-form-field-label {
            display: none;
          }
        }
      }
    }
    
    .table-actions {
      display: flex;
      gap: 8px;
    }
    
    /* Table */
    .table-responsive {
      overflow-x: auto;
      border-radius: var(--border-radius);
      background: white;
    }
    
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }
    
    th.mat-header-cell {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 14px;
      padding: 16px;
      background-color: #fafafa;
      border-bottom: 1px solid var(--divider-color);
    }
    
    td.mat-cell {
      padding: 16px;
      color: var(--text-primary);
      border-bottom: 1px solid var(--divider-color);
      vertical-align: middle;
    }
    
    .header-cell {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .sort-button {
      width: 24px;
      height: 24px;
      line-height: 24px;
    }
    
    .sort-button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      line-height: 18px;
    }
    
    /* User Cell */
    .user-cell .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 500;
      font-size: 16px;
    }
    
    .user-avatar.student {
      background-color: #4caf50;
    }
    
    .user-avatar.faculty {
      background-color: #ff9800;
    }
    
    .user-details {
      display: flex;
      flex-direction: column;
    }
    
    .user-name {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .user-email, .user-role {
      font-size: 12px;
      color: var(--text-secondary);
    }
    
    /* Date Cell */
    .date-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .date-container mat-icon {
      color: var(--primary-color);
    }
    
    .date-details {
      display: flex;
      flex-direction: column;
    }
    
    .date {
      font-size: 14px;
      color: var(--text-primary);
    }
    
    .time-ago {
      font-size: 12px;
      color: var(--text-secondary);
    }
    
    /* Actions */
    .actions-cell {
      white-space: nowrap;
    }
    
    .action-buttons {
      display: flex;
      gap: 4px;
    }
    
    /* Table Footer */
    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-top: 1px solid var(--divider-color);
      background-color: #fafafa;
    }
    
    .table-info {
      font-size: 12px;
      color: var(--text-secondary);
    }
    
    /* Empty State */
    .empty-state {
      padding: 40px 16px;
      text-align: center;
      color: var(--text-secondary);
    }
    
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: var(--divider-color);
    }
    
    .empty-state h4 {
      margin: 8px 0 4px;
      color: var(--text-primary);
    }
    
    .empty-state p {
      margin: 0;
      font-size: 14px;
    }
    
    /* Responsive */
    @media (max-width: 959px) {
      .admin-cards {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
      
      .header-content {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-container {
        min-width: 100%;
      }
      
      .table-toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      
      .table-actions {
        justify-content: flex-end;
      }
    }
    
    @media (max-width: 600px) {
      .manage-users-container {
        padding: 16px;
      }
      
      .admin-cards {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-wrap: wrap;
        justify-content: flex-end;
      }
    }
    
    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      :host {
        --text-primary: rgba(255, 255, 255, 0.87);
        --text-secondary: rgba(255, 255, 255, 0.6);
        --divider-color: rgba(255, 255, 255, 0.12);
        --background: #121212;
        --card-bg: #1e1e1e;
        --hover-bg: rgba(255, 255, 255, 0.08);
      }
      
      .tabs-container, 
      .table-responsive,
      .mat-mdc-tab-header,
      .table-footer {
        background-color: var(--card-bg);
      }
      
      .mat-mdc-card {
        background-color: var(--card-bg);
        color: var(--text-primary);
      }
      
      .mat-mdc-card-header {
        background-color: rgba(63, 81, 181, 0.08) !important;
      }
    }
  `, `
    /* Base Styles */
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');
    
    :host {
      --primary-color: #3f51b5;
      --primary-light: #757de8;
      --primary-dark: #002984;
      --accent-color: #ff4081;
      --warn-color: #f44336;
      --success-color: #4caf50;
      --text-primary: rgba(0, 0, 0, 0.87);
      --text-secondary: rgba(0, 0, 0, 0.6);
      --divider-color: rgba(0, 0, 0, 0.12);
      --background: #f5f5f5;
      --card-bg: #ffffff;
      --hover-bg: rgba(0, 0, 0, 0.04);
      --border-radius: 8px;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
      --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1);
    }
    .manage-users-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header h2 {
      margin: 0;
      color: #3f51b5;
      font-weight: 500;
    }

    .add-button {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 42px;
      border-radius: 8px;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      margin-top: 16px;
    }

    .admin-section {
      margin-bottom: 32px;
    }
    .section-title {
      color: #5f6368;
      font-size: 1.1rem;
      margin-bottom: 16px;
      font-weight: 500;
    }
    .admin-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .admin-card {
      transition: transform 0.2s, box-shadow 0.2s;
      border-radius: 12px !important;
      overflow: hidden;
    }
    .admin-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
    }
    .admin-avatar {
      background: #3f51b5;
      color: white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .admin-avatar mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .mat-mdc-card-header {
      padding: 16px 16px 0;
    }
    .mat-mdc-card-content {
      padding: 8px 16px;
    }
    .mat-mdc-card-content p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
      color: #5f6368;
    }
    .mat-mdc-card-actions {
      padding: 8px 8px 16px 0;
      margin: 0;
    }

    /* Tabs styling */
    .user-tabs {
      margin-top: 24px;
    }
    .mat-mdc-tab-group {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    .mat-mdc-tab-header {
      background: #f5f5f5;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .mat-mdc-tab-body-wrapper {
      padding: 16px;
    }

    /* Table styling */
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    th.mat-header-cell {
      font-weight: 600;
      color: #5f6368;
      font-size: 0.875rem;
      padding: 12px 16px;
      background: #fafafa;
      border-bottom: 1px solid #e0e0e0;
    }

    td.mat-cell {
      padding: 12px 16px;
      color: #3c4043;
      border-bottom: 1px solid #f1f1f1;
    }

    tr.mat-row:hover {
      background: #f5f5f5;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-icon {
      color: #5f6368;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .admin-cards {
        grid-template-columns: 1fr;
      }
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      .add-button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ManageUsersComponent implements OnInit, AfterViewInit {
  admins: User[] = [];
  students: User[] = [];
  faculty: User[] = [];
  floatLabel: FloatLabelType = 'never' as FloatLabelType;
  filteredStudents: User[] = [];
  filteredFaculty: User[] = [];
  
  // Table properties
  displayedColumns: string[] = ['name', 'email', 'joined', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 0;
  totalItems = 0;
  sortField = 'name';
  sortDirection = 'asc';
  selectedRow: User | null = null;
  searchTerm = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.api.getUsers().subscribe({
      next: (data: any) => {
        this.admins = data.filter((user: any) => user.role === 'admin');
        this.students = data.filter((user: any) => user.role === 'student');
        this.faculty = data.filter((user: any) => user.role === 'faculty');
        
        // Initialize filtered data
        this.filteredStudents = [...this.students];
        this.filteredFaculty = [...this.faculty];
        
        // Update the data source
        this.updateDataSource();
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.showError('Failed to load users. Please try again later.');
      }
    });
  }
  
  updateDataSource(): void {
    // Update the data source with current filtered data
    this.dataSource.data = this.filteredStudents; // Default to students tab
    this.totalItems = this.filteredStudents.length;
  }
  
  applyFilter(event: Event, type: 'students' | 'faculty'): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTerm = filterValue;
    
    if (type === 'students') {
      this.filteredStudents = this.students.filter(user => 
        user.name.toLowerCase().includes(filterValue) || 
        user.email.toLowerCase().includes(filterValue)
      );
      this.dataSource.data = this.filteredStudents;
      this.totalItems = this.filteredStudents.length;
    } else {
      this.filteredFaculty = this.faculty.filter(user => 
        user.name.toLowerCase().includes(filterValue) || 
        user.email.toLowerCase().includes(filterValue)
      );
      this.dataSource.data = this.filteredFaculty;
      this.totalItems = this.filteredFaculty.length;
    }
    
    // Reset to first page
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  
  sortData(sort: Sort, type: 'students' | 'faculty'): void {
    const data = type === 'students' ? [...this.filteredStudents] : [...this.filteredFaculty];
    
    if (!sort.active || sort.direction === '') {
      // Reset to default sort
      this.sortField = 'name';
      this.sortDirection = 'asc';
      return;
    }
    
    this.sortField = sort.active;
    this.sortDirection = sort.direction;
    
    const sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active as keyof User], b[sort.active as keyof User], isAsc);
    });
    
    if (type === 'students') {
      this.filteredStudents = sortedData;
      this.dataSource.data = this.filteredStudents;
    } else {
      this.filteredFaculty = sortedData;
      this.dataSource.data = this.filteredFaculty;
    }
    
    // Announce the sort state for screen readers
    this.liveAnnouncer.announce(`Sorted ${sort.direction} by ${sort.active}`);
  }
  
  private compare(a: any, b: any, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'edit-user-dialog',
      data: { ...user }
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        this.api.updateUser(user.id, result).subscribe({
          next: () => {
            this.showSuccess('User updated successfully');
            this.loadUsers();
          },
          error: (error: any) => {
            console.error('Error updating user:', error);
            this.showError('Failed to update user. Please try again.');
          }
        });
      }
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'edit-user-dialog',
      data: { role: 'student' } // Default to student role
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        this.api.createUser(result).subscribe({
          next: () => {
            this.showSuccess('User created successfully');
            this.loadUsers();
          },
          error: (error: any) => {
            console.error('Error creating user:', error);
            this.showError('Failed to create user. Please try again.');
          }
        });
      }
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.api.deleteUser(user.id).subscribe({
          next: () => {
            this.showSuccess('User deleted successfully');
            this.loadUsers();
          },
          error: (error: any) => {
            console.error('Error deleting user:', error);
            this.showError('Failed to delete user. Please try again.');
          }
        });
      }
    });
  }
  
  // Helper methods
  selectRow(row: User): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }
  
  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    
    return 'Just now';
  }
  
  getDisplayedRange(type: 'students' | 'faculty'): string {
    const data = type === 'students' ? this.filteredStudents : this.filteredFaculty;
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, data.length);
    return `${start}-${end}`;
  }
  
  onPageChange(event: PageEvent, type: 'students' | 'faculty'): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }
  
  exportToExcel(data: User[], type: string): void {
    try {
      const exportData = data.map(user => ({
        Name: user.name,
        Email: user.email,
        Role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        'Joined Date': new Date(user.createdAt).toLocaleDateString(),
        'Last Updated': new Date(user.updatedAt).toLocaleString()
      }));
      
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `${type} Data`);
      
      // Generate Excel file with current timestamp
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `${type}-${date}.xlsx`);
      
      this.showSuccess(`Exported ${data.length} ${type} to Excel`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      this.showError('Failed to export data. Please try again.');
    }
  }
  
  // Notification helpers
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
  
  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
