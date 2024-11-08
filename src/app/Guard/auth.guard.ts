import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AngularFireAuth);
  const router = inject(Router);
  return authService.authState.pipe(
    map((user) => !!user),tap(isLogged=>{
      if(!isLogged){
        router.navigate(['/signin']);
      }
    })
  );
};
