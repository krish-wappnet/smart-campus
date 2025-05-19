import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../services/api.service';
import { StudentClass } from '../../../shared/types';

@Component({
  selector: 'app-faculty-lectures',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './lectures.component.html',
  styleUrls: ['./lectures.component.css']
})
export class LecturesComponent implements OnInit {
  classes: StudentClass[] = [];
  loading = true;
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.loading = true;
    this.error = null;
    
    this.api.getFacultyClasses().subscribe({
      next: (data) => {
        // Initialize lecture status as inactive for all classes
        this.classes = data.map(classItem => ({
          ...classItem,
          lectureStatus: 'inactive'
        }));
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load classes';
        this.loading = false;
      }
    });
  }

  startLecture(classId: string) {
    this.api.startLecture(classId).subscribe({
      next: () => {
        // Update the lecture status for the specific class
        this.classes = this.classes.map(classItem => 
          classItem.id === classId 
            ? { ...classItem, lectureStatus: 'active' }
            : classItem
        );
        // Refresh the classes list
        this.loadClasses();
      },
      error: (error) => {
        console.error('Failed to start lecture:', error);
      }
    });
  }

  endLecture(classId: string) {
    this.api.endLecture(classId).subscribe({
      next: () => {
        // Update the lecture status for the specific class
        this.classes = this.classes.map(classItem => 
          classItem.id === classId 
            ? { ...classItem, lectureStatus: 'inactive' }
            : classItem
        );
        // Refresh the classes list
        this.loadClasses();
      },
      error: (error) => {
        console.error('Failed to end lecture:', error);
      }
    });
  }
}
