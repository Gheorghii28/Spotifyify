import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firestore: Firestore = inject(Firestore);

  public async setDocument(
    collectionName: string,
    documentId: string,
    documentData: User
  ): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, documentId);
      await setDoc(docRef, documentData);
    } catch (error) {
      console.error('Error setting document in Firestore:', error);
    }
  }

  public async updateDocument<T extends Partial<User>>(
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

  public async getDocument<T>(
    collectionName: string,
    documentId: string
  ): Promise<T | undefined> {
    const docRef = doc(this.firestore, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : undefined;
  }

  public async checkDocumentExists(
    collectionName: string,
    documentId: string
  ): Promise<boolean> {
    const docRef = doc(this.firestore, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }
}
