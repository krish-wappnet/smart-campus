import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectClasses } from '../store/student.selectors';
import { markAttendance } from '../store/student.action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-student-my-classes',
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

  markAttendance(classId: string, status: 'present' | 'absent') {
    this.store.dispatch(markAttendance({ classId, status }));
  }
}
