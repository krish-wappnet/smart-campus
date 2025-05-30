import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeDialogComponent } from './qr-code-dialog.component';

describe('QrCodeDialogComponent', () => {
  let component: QrCodeDialogComponent;
  let fixture: ComponentFixture<QrCodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrCodeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
