import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectClasses } from '../store/faculty.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-faculty-my-classes',
  templateUrl: './my-classes.component.html',
  standalone: false,
  // imports: [CommonModule, RouterLink],
  styleUrls: ['./my-classes.component.scss']
})
export class MyClassesComponent implements OnInit {
  classes$!: Observable<any[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.classes$ = this.store.select(selectClasses);
  }

  getClassAttendance(classId: string) {
    // This would typically be an API call to get attendance statistics
    // For now, we'll simulate with mock data
    return {
      totalStudents: 30,
      present: 25,
      absent: 5,
      percentage: 83.33
    };
  }
}
