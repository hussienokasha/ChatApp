import { Injectable } from '@angular/core';
import { authState, user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { arrayUnion, FieldValue } from 'firebase/firestore';
import {
  catchError,
  combineLatest,
  forkJoin,
  from,
  map,
  of,
  switchMap,
  take,
  tap,
  throwError,
  timestamp,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth
  ) {}

  getAllChats() {
    return from(this.fireAuth.currentUser).pipe(
      switchMap((user) => {
        return this.firestore.collection('users').doc(user?.uid).valueChanges();
      }),
      switchMap((userData: any) => {
        const chatsId = userData.chatsId;
        if (Array.isArray(chatsId)) {
          return combineLatest(
            chatsId.map((id) =>
              this.firestore.collection('chats').doc(id).valueChanges()
            )
          );
        } else if (typeof chatsId === 'string') {
          return of(
            this.firestore.collection('chats').doc(chatsId).valueChanges()
          );
        } else {
          return of([]);
        }
      })
    );
  }

  getChatById(chatId: string) {
    return this.firestore.collection('chats').doc(chatId).valueChanges();
  }
  createChat(receiverData: any) {
    let chatRef: any;
    return this.fireAuth.authState.pipe(
      switchMap((user: any) => {
        // Use 'get()' to retrieve user data once and avoid re-triggering
        return this.firestore.collection('users').doc(user.uid).get();
      }),
      switchMap((docSnapshot: any) => {
        const currentUserData = docSnapshot.data();
        chatRef = this.firestore.collection('chats').doc();

        return from(
          chatRef.set({
            chatId: chatRef.ref.id,
            lastMessage: '',
            timestamp: '',
            users: [
              {
                uid: currentUserData.uid,
                displayName: currentUserData.displayName,
              },
              { uid: receiverData.uid, displayName: receiverData.displayName },
            ],
          })
        ).pipe(
          switchMap(() => {
            return this.firestore
              .collection('users')
              .doc(currentUserData.uid)
              .update({
                chatsId: firebase.firestore.FieldValue.arrayUnion(
                  chatRef.ref.id
                ),
              });
          }),
          switchMap(() => {
            return this.firestore
              .collection('users')
              .doc(receiverData.uid)
              .update({
                chatsId: firebase.firestore.FieldValue.arrayUnion(
                  chatRef.ref.id
                ),
              });
          }),
          switchMap(() => {
            let messageRef = this.firestore
              .collection('chats')
              .doc(chatRef.ref.id)
              .collection('messages')
              .doc();
            return messageRef.set({
              messageId: messageRef.ref.id,
              senderId: currentUserData.uid,
              receiverId: receiverData.uid,
              text: null,
              timestamp: '',
            });
          })
        );
      })
    );
  }
}
