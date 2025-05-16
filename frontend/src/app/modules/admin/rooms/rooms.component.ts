import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Room } from '../../../models/room.model';
import { CommonMaterialModule } from '../common-material.module';
import { adminActions } from '../store/admin.actions';
import { RoomDialogComponent } from './room-dialog.component';

@Component({
  selector: 'app-rooms',
  template: `
    <div class="container">
      <h2>Rooms Management</h2>
      
      <button mat-raised-button color="primary" (click)="openAddDialog()">
        Add Room
      </button>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Search rooms...">
        </mat-form-field>
      </div>

      <div class="rooms-grid">
        <div *ngFor="let room of filteredRooms" class="room-card">
          <h3>{{ room.name }}</h3>
          <p>Capacity: {{ room.capacity }}</p>
          <p>Location: {{ room.location }}</p>
          <p>Equipment: {{ room.equipment.join(', ') }}</p>
          <button mat-icon-button (click)="openEditDialog(room)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteRoom(room.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>

      <mat-dialog-container></mat-dialog-container>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .filters {
      margin: 20px 0;
    }
    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .room-card {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 4px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `],
  standalone: true,
  imports: [
    CommonMaterialModule, 
    CommonModule, 
    ReactiveFormsModule,
    FormsModule
  ]
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  searchTerm: string = '';
  roomForm: FormGroup;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      equipment: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.store.dispatch(adminActions.loadRooms());
  }

  get filteredRooms() {
    return this.rooms.filter(room => 
      room.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(adminActions.addRoom({ room: result }));
      }
    });
  }

  openEditDialog(room: Room) {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: '500px',
      data: { mode: 'edit', room }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(adminActions.updateRoom({ room: result }));
      }
    });
  }

  deleteRoom(roomId: string) {
    if (confirm('Are you sure you want to delete this room?')) {
      this.store.dispatch(adminActions.deleteRoom({ roomId }));
    }
  }
}
