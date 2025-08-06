import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { authOnlyGuard } from './guards/auth-only.guard';
import { AddOfficerComponent } from './components/add-officer/add-officer.component';
import { ListOfficerComponent } from './components/list-officer/list-officer.component';
import { MapComponent } from './components-library/map/map.component';
import { CreateComplaintComponent } from './components/create-complaint/create-complaint.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { CurrentComplaintComponent } from './components/current-complaint/current-complaint.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

export const routes: Routes = [
    {path:'register', component:RegisterComponent, canActivate: [authGuard] },
    {path:'login', component:LoginComponent, canActivate: [authGuard] },
    {path:'home',component:HomeComponent, canActivate:[authOnlyGuard]},
    {path:'addOfficer',component:AddOfficerComponent, canActivate:[authOnlyGuard]},
    {path:'officersList',component:ListOfficerComponent,canActivate:[authOnlyGuard]},
    {path:'createComplaint',component:CreateComplaintComponent,canActivate:[authOnlyGuard]},
    {path:'map',component:MapComponent,canActivate:[authOnlyGuard]},
    {path:'complaints',component:ComplaintsComponent, canActivate:[authOnlyGuard]},
    {path:'current-complaints',component:CurrentComplaintComponent, canActivate:[authOnlyGuard]},
    {path: 'edit-complaint/:id', component: CreateComplaintComponent, canActivate: [authOnlyGuard] },
    {path:'profile',component:ProfileComponent, canActivate:[authOnlyGuard]},
    {path:'edit-profile',component:EditProfileComponent, canActivate:[authOnlyGuard]},
    {path:'change-password',component:ChangePasswordComponent, canActivate:[authOnlyGuard]},
    {path:'**', redirectTo:'login', pathMatch:'full'},
];
