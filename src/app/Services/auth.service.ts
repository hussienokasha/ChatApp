import { Injectable, Signal, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  BehaviorSubject,
  catchError,
  from,

  Observable,

  switchMap,
  tap,
  throwError,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {

  }

  signup(email: string, password: string, displayName: string) {
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        const userId = userCredential.user?.uid;
        if (userId) {
          return from(
            this.firestore.collection('users').doc(userId).set({
              uid:userId,
              displayName: displayName,
              email: email,
              status: 'online',
              chatsId: [],
            })
          ).pipe(
            catchError((error) => {
              return throwError(() => error.message);
            })
          );
        }
        return throwError(() => console.log('id is missing'));
      }),
      catchError((error) => {
        console.error('Signup error: ', error);
        return throwError(() => error.message);
      })
    );
  }
  signIn(email: string, password: string) {
    return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(
      catchError((e) => {
        console.log('Error while logging in:', e.message);
        return throwError(() => new Error(e.message));
      }),
    );
  }

  signOut() {
    return from(this.auth.signOut()).pipe(
      catchError((e) => {
        console.log('error while log out', e.message);
        return throwError(() => e.message);
      })
    );
  }

}
