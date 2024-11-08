import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, combineLatest, from, map, Observable, of, switchMap } from 'rxjs';
import { User } from '../Interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  getCurrentUser(): Observable<User | undefined> {
    return from(this.auth.currentUser).pipe(
      switchMap((user) => {
        const userId = user?.uid;
        if (userId) {
          return this.firestore
            .collection<User>('users')
            .doc(userId)
            .valueChanges();
        } else {
          return of(undefined);
        }
      }),
      catchError((error) => {
        console.error('Error fetching user data:', error);
        return of(undefined);
      })
    );
  }
  searchUser(value: string) {
    const lowerCaseValue = value.toLowerCase(); 
    return this.firestore.collection<User>('users').valueChanges().pipe(
      map(users => users.filter(user =>
        user.displayName && user.displayName.toLowerCase().includes(lowerCaseValue)
      ))
    );
  }



}
