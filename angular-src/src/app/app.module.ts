import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { VertNavComponent } from './components/vert-nav/vert-nav.component';
import { ViewsComponent } from './components/views/views.component';

export function tokenGetter(){
  return localStorage.getItem("jwt");
}

const appRoutes: Routes = [
  { path:'', component: HomeComponent },
  { path:'login', component: LoginComponent},
  { path:'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path:'views', component: ViewsComponent, canActivate: [AuthGuard] }
];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    ProfileComponent,
    HomeComponent,
    VertNavComponent,
    ViewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    })
  ],
  providers: [AuthService, CookieService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
