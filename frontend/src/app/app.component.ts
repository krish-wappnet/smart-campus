import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { AppState } from './store';
import { selectIsAuthenticated } from './store/auth/auth.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AppComponent implements OnInit {
  private store = inject(Store<AppState>);
  
  isAuthenticated$ = this.store.select(selectIsAuthenticated);
  currentUrl$ = inject(Router).events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(event => event.url)
  );
  
  isHomePage$ = this.currentUrl$.pipe(
    map(url => url === '/' || url === '/auth')
  );

  features = [
    {
      icon: '📅',
      title: 'Class Scheduling',
      description: 'Effortlessly manage class timetables with conflict detection.',
    },
    {
      icon: '✅',
      title: 'Attendance Tracking',
      description: 'Track student attendance in real-time with automated logging.',
    },
    {
      icon: '📊',
      title: 'Activity Analytics',
      description: 'Visualize student engagement with heatmaps and calendars.',
    },
    {
      icon: '🎥',
      title: 'Live Lecture Control',
      description: 'Start and end lectures with seamless attendance integration.',
    },
  ];

  constructor() {}

  ngOnInit() {
    // No need for manual subscription as we're using async pipe in template
    // The isAuthenticated$ and isHomePage$ observables are already set up
  }
}