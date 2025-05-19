import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-manage-classes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <h2>My Classes</h2>
      
      <table mat-table [dataSource]="classes" class="mat-elevation-z8">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Class Name</th>
          <td mat-cell *matCellDef="let class">{{ class.name }}</td>
        </ng-container>

        <ng-container matColumnDef="room">
          <th mat-header-cell *matHeaderCellDef>Room</th>
          <td mat-cell *matCellDef="let class">{{ class.room.name }}</td>
        </ng-container>

        <ng-container matColumnDef="day">
          <th mat-header-cell *matHeaderCellDef>Day</th>
          <td mat-cell *matCellDef="let class">{{ class.timeslot.dayOfWeek }}</td>
        </ng-container>

        <ng-container matColumnDef="time">
          <th mat-header-cell *matHeaderCellDef>Time</th>
          <td mat-cell *matCellDef="let class">
            {{ class.timeslot.startTime }} - {{ class.timeslot.endTime }}
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
  `,
  styles: [`
    .container {
      padding: 24px;
    }

    h2 {
      margin-bottom: 24px;
    }

    table {
      width: 100%;
    }
  `]
})
export class ManageClassesComponent {
  displayedColumns: string[] = ['name', 'room', 'day', 'time'];
  classes: any[] = [];

  constructor(private api: ApiService) {
    this.loadClasses();
  }

  loadClasses(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.classes = [];
      return;
    }

    this.api.getFacultyClasses().subscribe({
      next: (data: any) => {
        if (data && Array.isArray(data)) {
          this.classes = data;
        } else {
          this.classes = [];
        }
      },
      error: (error: any) => {
        console.error('Error loading faculty classes:', error);
        this.classes = [];
      }
    });
  }
}
