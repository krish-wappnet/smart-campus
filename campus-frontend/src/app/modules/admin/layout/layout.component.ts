import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    FontAwesomeModule,
    MatProgressBarModule
  ],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <app-sidebar class="sidebar"></app-sidebar>
      
      <!-- Main Content -->
      <div class="main-content">
        <!-- Top Bar -->
        <header class="top-bar">
          <div class="top-bar-content">
            <h1 class="page-title">{{ pageTitle }}</h1>
            <div class="top-bar-actions">
              <!-- Add global actions here if needed -->
            </div>
          </div>
          <mat-progress-bar *ngIf="loading" mode="indeterminate" color="primary"></mat-progress-bar>
        </header>
        
        <!-- Page Content -->
        <main class="content">
          <router-outlet (activate)="onActivate($event)" (deactivate)="onDeactivate($event)"></router-outlet>
        </main>
        
        <!-- Footer -->
        <footer class="footer">
          <div class="footer-content">
            <span class="copyright">&copy; {{ currentYear }} Smart Campus. All rights reserved.</span>
            <div class="footer-links">
              <a href="#" class="footer-link">Privacy Policy</a>
              <span class="divider">|</span>
              <a href="#" class="footer-link">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
      
      <!-- Global Notifications/Modals -->
    </div>
  `,
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  loading = false;
  pageTitle = 'Dashboard';
  currentYear = new Date().getFullYear();
  
  private routerEventsSub: Subscription | null = null;
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Subscribe to router events to update page title
    this.routerEventsSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
    });
  }
  
  ngOnDestroy() {
    if (this.routerEventsSub) {
      this.routerEventsSub.unsubscribe();
    }
  }
  
  onActivate(component: any) {
    // Reset scroll position when a new route is activated
    window.scrollTo(0, 0);
    
    // Check if component has a pageTitle property
    if (component && component.pageTitle) {
      this.pageTitle = component.pageTitle;
    } else {
      this.pageTitle = this.getPageTitleFromRoute();
    }
  }
  
  onDeactivate(component: any) {
    // Cleanup if needed when component is deactivated
  }
  
  private updatePageTitle() {
    this.pageTitle = this.getPageTitleFromRoute();
  }
  
  private getPageTitleFromRoute(): string {
    let route = this.router.routerState.root;
    let title = 'Dashboard'; // Default title
    
    // Traverse the route tree to find the activated route with a title
    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.data && route.snapshot.data['title']) {
        title = route.snapshot.data['title'];
      }
    }
    
    return title;
  }
  
  // Show loading indicator
  setLoading(loading: boolean) {
    this.loading = loading;
  }
}
