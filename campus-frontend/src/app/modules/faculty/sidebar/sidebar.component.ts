import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faTachometerAlt, 
  faUsers, 
  faChalkboardTeacher, 
  faClipboardCheck, 
  faCalendarAlt, 
  faSignOutAlt,
  faBars
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-faculty-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class FacultySidebarComponent implements OnInit {
  // Icons
  faTachometerAlt = faTachometerAlt;
  faUsers = faUsers;
  faChalkboardTeacher = faChalkboardTeacher;
  faClipboardCheck = faClipboardCheck;
  faCalendarAlt = faCalendarAlt;
  faSignOutAlt = faSignOutAlt;
  faBars = faBars;
  
  isMobileMenuOpen = false;

  constructor(private authService: AuthService, private store: Store) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
