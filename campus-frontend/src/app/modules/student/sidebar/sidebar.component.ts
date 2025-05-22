import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faTachometerAlt, 
  faClipboardCheck, 
  faCalendarAlt, 
  faUser,
  faSignOutAlt,
  faBars,
  faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-student-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class StudentSidebarComponent implements OnInit {
  // Icons
  faTachometerAlt = faTachometerAlt;
  faClipboardCheck = faClipboardCheck;
  faCalendarAlt = faCalendarAlt;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faBars = faBars;
  faChalkboardTeacher = faChalkboardTeacher;
  
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
