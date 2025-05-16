import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectSchedule } from '../store/faculty.selectors';
import { updateClassSchedule } from '../store/faculty.action';
import { Observable } from 'rxjs';

interface Class {
  id: string;
  subject: string;
  teacherName: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-faculty-my-schedule',
  templateUrl: './my-schedule.component.html',
  standalone: false,
  // imports: [CommonModule, RouterLink],
  styleUrls: ['./my-schedule.component.scss']
})
export class MyScheduleComponent implements OnInit {
  schedule$!: Observable<Class[]>;
  editedClass: Class | null = null;

  constructor(private store: Store) {}

  ngOnInit() {
    this.schedule$ = this.store.select(selectSchedule);
  }

  editClass(selectedClass: Class) {
    this.editedClass = { ...selectedClass };
  }

  cancelEdit() {
    this.editedClass = null;
  }

  saveClassChanges() {
    if (!this.editedClass) return;
    
    this.store.dispatch(updateClassSchedule({ schedule: [this.editedClass] }));
    this.editedClass = null;
  }

  isEditingClass(selectedClass: Class) {
    return this.editedClass && this.editedClass.id === selectedClass.id;
  }

  getTimeSlots(): string[] {
    return ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  }
}
