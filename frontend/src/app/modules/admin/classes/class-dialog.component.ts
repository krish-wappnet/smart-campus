import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Class } from '../../../models/class.model';

@Component({
  selector: 'app-class-dialog',
  template: `
    <div class="dialog-container">
      <h2>{{ mode === 'add' ? 'Add Class' : 'Edit Class' }}</h2>
      <form [formGroup]="classForm" (ngSubmit)="onSubmit()" class="form">
        <div class="form-group">
          <label for="name">Class Name</label>
          <input id="name" type="text" formControlName="name" required>
        </div>

        <div class="form-group">
          <label for="code">Class Code</label>
          <input id="code" type="text" formControlName="code" required>
        </div>

        <div class="form-group">
          <label for="capacity">Capacity</label>
          <input id="capacity" type="number" formControlName="capacity" required>
        </div>

        <div class="form-group">
          <label for="department">Department</label>
          <input id="department" type="text" formControlName="department" required>
        </div>

        <div class="buttons">
          <button type="button" (click)="onCancel()" class="cancel-btn">Cancel</button>
          <button type="submit" [disabled]="!classForm.valid" class="submit-btn">
            {{ mode === 'add' ? 'Add Class' : 'Update Class' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `.dialog-container { padding: 20px; max-width: 500px; margin: 0 auto; }`,
    `h2 { color: #333; margin-bottom: 20px; text-align: center; }`,
    `.form { display: flex; flex-direction: column; gap: 15px; }`,
    `.form-group { display: flex; flex-direction: column; gap: 5px; }`,
    `label { color: #666; font-weight: 500; }`,
    `input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }`,
    `input:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); }`,
    `.buttons { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }`,
    `.cancel-btn, .submit-btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: all 0.2s ease; }`,
    `.cancel-btn { background: #fff; color: #666; border: 1px solid #ddd; }`,
    `.cancel-btn:hover { background: #f8f9fa; }`,
    `.submit-btn { background: #007bff; color: white; }`,
    `.submit-btn:hover { background: #0056b3; }`,
    `.submit-btn:disabled { background: #ccc; cursor: not-allowed; }`
  ],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ClassDialogComponent {
  classForm: FormGroup;
  mode: 'add' | 'edit' = 'add';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ClassDialogComponent>
  ) {
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      department: ['', Validators.required]
    });

    if (data && data.class) {
      this.mode = 'edit';
      this.classForm.patchValue(data.class);
    }
  }

  onSubmit() {
    if (this.classForm.valid) {
      this.dialogRef.close(this.classForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
