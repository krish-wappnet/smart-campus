import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { authReducer, authFeatureKey } from './store';
import { adminReducer } from './modules/admin/store/admin.reducer';
import { facultyReducer } from './modules/faculty/store/faculty.reducer';
import { studentReducer } from './modules/student/store/student.reducer';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { CoreModule } from './core/core.module';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot({
      auth: authReducer,
      admin: adminReducer,
      faculty: facultyReducer,
      student: studentReducer
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
