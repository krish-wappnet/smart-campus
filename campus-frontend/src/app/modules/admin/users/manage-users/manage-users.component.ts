import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';
import { EditUserComponent } from '../edit-user/edit-user.component';

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
    EditUserComponent
  ],
  template: `
    <div class="manage-users-container">
      <div class="header">
        <h2>Manage Users</h2>
        <button
          mat-raised-button
          color="primary"
          (click)="addUser()"
          class="add-button"
        >
          <mat-icon>person_add</mat-icon>
          Add User
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="users" class="mat-elevation-z8">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let user">{{ user.id }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let user">{{ user.name }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let user">
              <span [class]="'role-badge ' + user.role.toLowerCase()">
                {{ user.role }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <button
                mat-icon-button
                [matTooltip]="'Edit user'"
                (click)="editUser(user)"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                [matTooltip]="'Delete user'"
                (click)="deleteUser(user)"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>

        <mat-paginator
          [pageSizeOptions]="[5, 10, 25, 100]"
          showFirstLastButtons
        ></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .manage-users-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .add-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    table {
      width: 100%;
    }

    th.mat-header-cell {
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
    }

    td.mat-cell {
      padding: 16px;
    }

    .role-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .role-badge.admin {
      background: #e3f2fd;
      color: #1976d2;
    }

    .role-badge.faculty {
      background: #fff3e0;
      color: #f57c00;
    }

    .role-badge.student {
      background: #e8f5e9;
      color: #2e7d32;
    }

    button.mat-icon-button {
      margin: 0 4px;
    }

    mat-paginator {
      padding: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }
  `]
})
export class ManageUsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  users = [];

  constructor(
    private api: ApiService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.api.getUsers().subscribe({
      next: (data: any) => {
        this.users = data;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
      }
    });
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.api.updateUser(user.id, result).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (error: any) => {
            console.error('Error updating user:', error);
          }
        });
      }
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '500px',
      data: null // Passing null to indicate this is a new user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.createUser(result).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (error: any) => {
            console.error('Error creating user:', error);
          }
        });
      }
    });
  }

  deleteUser(user: any): void {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      this.api.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error: any) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}
