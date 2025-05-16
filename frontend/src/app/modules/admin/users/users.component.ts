import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import { User } from '../../../store/auth/auth.interface';
import { Role } from '../../../core/models/role.enum';
import { adminActions } from '../store/admin.actions';
import { selectUsers } from '../store/admin.selectors';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterOutlet, 
    FormsModule, 
    ReactiveFormsModule,
    DialogModule
  ],
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  filteredUsers$: Observable<User[]>;
  displayDialog = false;
  editMode = false;
  selectedUser: User | null = null;
  userForm: FormGroup;
  selectedRole: string = '';
  selectedStatus: string = '';
  searchQuery: string = '';

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    this.users$ = this.store.select(selectUsers);
    this.filteredUsers$ = combineLatest([
      this.users$,
      this.selectedRole,
      this.selectedStatus,
      this.searchQuery
    ]).pipe(
      map(([users, role, status, query]: [User[], string, string, string]) => {
        return users.filter(user => {
          const matchesRole = !role || user.role === role;
          const matchesStatus = !status || user.status === status;
          const matchesSearch = !query || 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase());
          return matchesRole && matchesStatus && matchesSearch;
        });
      })
    );

    this.userForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.store.dispatch(adminActions.loadUsers());
  }

  openAddUserDialog() {
    this.editMode = false;
    this.userForm.reset();
    this.displayDialog = true;
  }

  openEditUserDialog(user: User) {
    this.editMode = true;
    this.selectedUser = user;
    this.userForm.patchValue(user);
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
    this.selectedUser = null;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.editMode && this.selectedUser) {
        this.onUpdateUser(this.selectedUser.id, userData);
      } else {
        this.onAddUser(userData);
      }
      this.closeDialog();
    }
  }

  onAddUser(user: User) {
    this.store.dispatch(adminActions.addUser({ user }));
  }

  onUpdateUser(id: string, changes: Partial<User>) {
    const updatedUser: User = {
      id,
      name: changes.name || this.selectedUser?.name || '',
      email: changes.email || this.selectedUser?.email || '',
      role: changes.role || this.selectedUser?.role || Role.STUDENT,
      status: changes.status || this.selectedUser?.status || 'ACTIVE',
      createdAt: this.selectedUser?.createdAt || new Date(),
      updatedAt: new Date()
    };
    this.store.dispatch(adminActions.updateUser({ user: updatedUser }));
  }

  onDeleteUser(user: User) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.store.dispatch(adminActions.deleteUser({ user }));
    }
  }

  deleteUser(user: User) {
    this.onDeleteUser(user);
  }

  applyFilters() {
    // Filters are automatically applied through the combineLatest observable
  }
}
