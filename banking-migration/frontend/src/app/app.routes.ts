import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { CustomerDashboardComponent } from './features/customer/customer-dashboard/customer-dashboard.component';
import { AccountOpeningComponent } from './features/customer/account-opening/account-opening.component';
import { CheckStatusComponent } from './features/customer/check-status/check-status.component';
import { OnlineRegistrationComponent } from './features/customer/online-registration/online-registration.component';
import { CustomerLoginComponent } from './features/customer/customer-login/customer-login.component';
import { InterestCalculatorComponent } from './features/customer/interest-calculator/interest-calculator.component';
import { TransactionEntryComponent } from './features/customer/transaction-entry/transaction-entry.component';
import { TransactionHistoryComponent } from './features/customer/transaction-history/transaction-history.component';
import { ManagerLoginComponent } from './features/manager/manager-login/manager-login.component';
import { ManagerApprovalComponent } from './features/manager/manager-approval/manager-approval.component';
import { CustomerDetailComponent } from './features/manager/customer-detail/customer-detail.component';
import { AuthGuard } from './core/auth/auth.guard';
import { ManagerAuthGuard } from './core/auth/manager-auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'customer/dashboard', component: CustomerDashboardComponent },
  { path: 'customer/account-opening', component: AccountOpeningComponent },
  { path: 'customer/check-status', component: CheckStatusComponent },
  { path: 'customer/register', component: OnlineRegistrationComponent },
  { path: 'customer/login', component: CustomerLoginComponent },
  { path: 'customer/interest-calculator', component: InterestCalculatorComponent },
  {
    path: 'customer/transactions/new',
    component: TransactionEntryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'customer/transactions/history',
    component: TransactionHistoryComponent,
    canActivate: [AuthGuard],
  },
  { path: 'manager/login', component: ManagerLoginComponent },
  {
    path: 'manager/approvals',
    component: ManagerApprovalComponent,
    canActivate: [ManagerAuthGuard],
  },
  {
    path: 'manager/customer/:requestId',
    component: CustomerDetailComponent,
    canActivate: [ManagerAuthGuard],
  },
  { path: '**', redirectTo: '' },
];
