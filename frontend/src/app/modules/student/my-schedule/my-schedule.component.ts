import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUpcomingClasses } from '../store/student.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-student-my-schedule',
  templateUrl: './my-schedule.component.html',
  standalone: false,
  // imports: [CommonModule],
  styleUrls: ['./my-schedule.component.scss']
})
export class MyScheduleComponent implements OnInit {
  schedule$!: Observable<any[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.schedule$ = this.store.select(selectUpcomingClasses);
  }

  getDayClasses(day: string, schedule: any[]) {
    return schedule.filter(item => item.day === day);
  }

  getTimeSlots(): string[] {
    const timeSlots: string[] = [];
    // Generate time slots from 8:00 AM to 5:00 PM in 1-hour increments
    for (let hour = 8; hour <= 17; hour++) {
      const time = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 ${hour === 12 ? 'PM' : 'AM'}`;
      timeSlots.push(time);
    }
    return timeSlots;
  }
}
