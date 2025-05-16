import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/auth/auth.selectors';
import { Observable } from 'rxjs';
import { User } from '../../../store/auth/auth.interface';
import { adminActions } from '../store/admin.actions';
import { selectTotalUsers, selectTotalClasses, selectTotalRooms, selectPendingLeaves, selectRecentActivities } from '../store/admin.selectors';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user$: Observable<User | null>;
  totalUsers$: Observable<number>;
  totalClasses$: Observable<number>;
  totalRooms$: Observable<number>;
  pendingLeaves$: Observable<number>;
  recentActivities$: Observable<any[]>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.totalUsers$ = this.store.select(selectTotalUsers);
    this.totalClasses$ = this.store.select(selectTotalClasses);
    this.totalRooms$ = this.store.select(selectTotalRooms);
    this.pendingLeaves$ = this.store.select(selectPendingLeaves);
    this.recentActivities$ = this.store.select(selectRecentActivities);
  }

  ngOnInit() {
    this.store.dispatch(adminActions.loadDashboardData());
  }
}
