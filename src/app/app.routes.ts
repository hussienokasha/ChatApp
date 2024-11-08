import { Routes } from '@angular/router';
import { ChatsComponent } from './Pages/chats/chats.component';
import { SigninComponent } from './Pages/signin/signin.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { PasswordResetComponent } from './Pages/password-reset/password-reset.component';
import { ChatComponent } from './Components/chat/chat.component';
import { NoChatComponent } from './Components/no-chat/no-chat.component';
import { authGuard } from './Guard/auth.guard';
import { authRedirectGuard } from './Guard/auth-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chats',
    pathMatch: 'full',
  },
  {
    path: 'chats',
    runGuardsAndResolvers:"always",
    component: ChatsComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: NoChatComponent },
      { path: 'chat/:id', component: ChatComponent,runGuardsAndResolvers:"always" },
    ],
  },
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [authRedirectGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [authRedirectGuard],
  },
  { path: 'password-reset', component: PasswordResetComponent },
 
];
