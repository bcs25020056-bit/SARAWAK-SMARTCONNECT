import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, onSnapshot, Timestamp, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Auth Helpers
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export { signInWithEmailAndPassword, createUserWithEmailAndPassword };
export const logout = () => signOut(auth);

// ===============================================================
// OOP CONCEPT DEMONSTRATION
// ===============================================================

/**
 * ENCAPSULATION & INHERITANCE: Parent Class
 * Here we encapsulate basic data properties and behaviors.
 */
class BaseEntity {
  /**
   * ENCAPSULATION (Public): Accessible from anywhere.
   */
  public id: string;

  /**
   * ENCAPSULATION (Private): Only accessible inside this class.
   * This protects the data from being changed incorrectly.
   */
  private secretKey: string = "INTERNAL_USE_ONLY";

  constructor(id: string) {
    this.id = id;
  }

  /**
   * POLYMORPHISM: Method Overloading
   * TypeScript simulates method overloading by providing multiple signatures 
   * for a single implementation. This allows the method to handle different 
   * types of inputs in different ways.
   */
  public updateValue(val: string): void;
  public updateValue(val: number): void;
  public updateValue(val: any): void {
    console.log(`Updating ${this.id} with value:`, val);
  }

  /**
   * OPERATOR OVERLOADING (Concept Illustration):
   * IMPORTANT: JavaScript/TypeScript does NOT natively support operator overloading 
   * (e.g., redefining how '+' works between objects). 
   * Instead, we use methods like 'add' or 'plus' to simulate this behavior.
   */
  public combine(other: BaseEntity): string {
    return `${this.id} & ${other.id}`;
  }

  /**
   * FUNCTION (METHOD): A public method to get formatted data.
   */
  public getInfo(): string {
    return `ID: ${this.id}`;
  }

  /**
   * PRIVATE METHOD: Helper function used only internally.
   */
  private processSecurity() {
    return this.secretKey.toLowerCase();
  }
}

/**
 * INHERITANCE: Child Class
 * The JobPost class inherits properties and methods from BaseEntity (Parent).
 */
class JobPost extends BaseEntity {
  public title: string;

  constructor(id: string, title: string) {
    // Calling 'super' transfers the parent class properties to this child.
    super(id);
    this.title = title;
  }

  /**
   * POLYMORPHISM: Method Overriding
   * Overriding occurs when a child class provides a specific implementation 
   * for a method that is already defined in its parent class.
   * This is a key part of Polymorphism: the same method call produces 
   * different results depending on the object type.
   */
  public override getInfo(): string {
    return `Job [${this.id}]: ${this.title}`;
  }
}

// ===============================================================

// Firestore Error Handler
/**
 * ENCAPSULATION: The OperationType enum encapsulates possible firestore operations 
 * into a single defined type, preventing invalid values.
 */
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

/**
 * INHERITANCE / STRUCTURE: This interface defines the structure required for 
 * error reporting, serving as a base for error objects.
 */
export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

/**
 * FUNCTION (PROCEDURE): A reusable logic block that handles firesfore errors 
 * and formats them for the application.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
