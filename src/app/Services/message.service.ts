import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  loadMessages(chatId: string) {
    return this.firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages', (ref) => ref.orderBy('timestamp'))
      .valueChanges();
  }

  async sendMessage(message: string, receiverId: string, chatId: string) {
    const user = await this.auth.currentUser;
    const senderId = user?.uid;
    const messageRef = this.firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .doc();
    const messageId = messageRef.ref.id;
    await messageRef.set({
      messageId: messageId,
      senderId: senderId,
      receiverId: receiverId,
      text: message,
      timestamp: new Date().toISOString(),
    });
    this.firestore
      .collection('chats')
      .doc(chatId)
      .update({ lastMessage: message, timestamp: new Date().toISOString() });
  }
  deleteMessage(mId: string, chatId: string) {
    return this.firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .doc(mId)
      .delete();
  }
}
