import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '@store/auth/auth.selectors';
import { AuthService } from '../../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faTachometerAlt, 
  faUsers, 
  faDoorOpen, 
  faClock, 
  faChalkboardTeacher, 
  faCalendarAlt, 
  faSignOutAlt,
  faBars
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  // Icons
  faTachometerAlt = faTachometerAlt;
  faUsers = faUsers;
  faDoorOpen = faDoorOpen;
  faClock = faClock;
  faChalkboardTeacher = faChalkboardTeacher;
  faCalendarAlt = faCalendarAlt;
  faSignOutAlt = faSignOutAlt;
  faBars = faBars;
  
  isMobileMenuOpen = false;

  constructor(private store: Store, private authService: AuthService) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
