import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule } from '@angular/forms';
//import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { ViewsComponent } from './components/views/views.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChildviewComponent } from './components/childview/childview.component';
import { WholeviewComponent } from './components/wholeview/wholeview.component';

import { AuthService } from './services/auth.service';
import { GService } from './services/g.service';
import { InterceptorService } from './services/interceptor.service';
import { AuthGuard } from './guards/auth.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { PubProfComponent } from './components/pub-prof/pub-prof.component';



export function tokenGetter(){
  return localStorage.getItem("jwt");
}

const appRoutes: Routes = [
  { path:'', component: HomeComponent },
  { path:'login', component: LoginComponent},
  { path:'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path:'views', component: WholeviewComponent, canActivate: [AuthGuard]},
  { path:'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  { path:':link', component: PubProfComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    ProfileComponent,
    HomeComponent,
    ViewsComponent,
    SidebarComponent,
    ChildviewComponent,
    WholeviewComponent,
    SettingsComponent,
    PubProfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    //AngularSvgIconModule.forRoot(),
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    })
  ],
  providers: [AuthService, GService, CookieService, AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
