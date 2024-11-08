import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';

export const authRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AngularFireAuth);
  const router = inject(Router);

  return authService.authState.pipe(
    map((user) => !!user),
    tap((isLoggedin) => {
      if (isLoggedin) {
        router.navigate(['/chats']);
      }
    }),
    map((isLoggedin) => !isLoggedin)
  );
};
