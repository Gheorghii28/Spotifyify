import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserFirebaseData, UserDataClass } from '../models/firebase.model';
import { UserProfile } from '../models/spotify.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firestore: Firestore = inject(Firestore);

  async checkUserInFirestore(userProfile: UserProfile): Promise<void> {
    if (!userProfile?.id) {
      return;
    }
    try {
      const docRef = doc(this.firestore, 'users', userProfile.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const userData = new UserDataClass(userProfile.id);
        await this.setDocument('users', userProfile.id, userData.toJSON());
      }
    } catch (error) {
      console.error('Error checking user in Firestore:', error);
    }
  }

  public async setDocument(
    collectionName: string,
    documentId: string,
    documentData: UserFirebaseData
  ): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, documentId);
      await setDoc(docRef, documentData);
    } catch (error) {
      console.error('Error setting document in Firestore:', error);
    }
  }

  public async updateDocument<T extends Partial<UserFirebaseData>>(
    collectionName: string,
    documentId: string,
    data: T
  ): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, documentId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(
        `Error updating document ${documentId} in collection ${collectionName}:`,
        error
      );
    }
  }
}
