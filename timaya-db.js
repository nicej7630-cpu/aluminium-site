// Timaya Aluminum Products: private database connection (Firebase)
// Testimonials are visible to everyone only when approved. Only the admin can add, approve or delete.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, doc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLFRqiqLQ5TloPof8m19Wo5gVIdowUhS0",
  authDomain: "timaya-aluminum.firebaseapp.com",
  projectId: "timaya-aluminum",
  storageBucket: "timaya-aluminum.firebasestorage.app",
  messagingSenderId: "600430707404",
  appId: "1:600430707404:web:9324ff762858b100ab3869"
};

export const ADMIN_EMAIL = "alumtiy@gmail.com";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── ADMIN SIGN-IN ──
export const adminSignIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const adminSignOut = () => signOut(auth);
export const onAdminChange = cb => onAuthStateChanged(auth, cb);

// ── PUBLIC: approved testimonials only ──
export async function listApprovedTestimonies(){
  const snap = await getDocs(query(collection(db, "testimonials"), where("approved", "==", true)));
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return list;
}

// ── ADMIN: everything ──
export async function listAllTestimonies(){
  const snap = await getDocs(query(collection(db, "testimonials"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function addTestimony(data){
  await addDoc(collection(db, "testimonials"), { ...data, approved: true, createdAt: serverTimestamp() });
}
export async function setTestimonialApproved(id, approved){
  await updateDoc(doc(db, "testimonials", id), { approved: approved });
}
export async function deleteTestimony(id){
  await deleteDoc(doc(db, "testimonials", id));
}

// ── SITE SETTINGS (text, contact details, which sections show) ──
export async function getSettings(){
  const s = await getDoc(doc(db, "site", "settings"));
  return s.exists() ? s.data() : {};
}
export async function saveSettings(data){
  await setDoc(doc(db, "site", "settings"), data, { merge: true });
}

// ── PHOTOS (shown on the website when visible) ──
export async function listVisiblePhotos(){
  const snap = await getDocs(query(collection(db, "photos"), where("visible", "==", true)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function listAllPhotos(){
  const snap = await getDocs(collection(db, "photos"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (b.order||0) - (a.order||0));
}
export async function addPhoto(data){
  await addDoc(collection(db, "photos"), { ...data, createdAt: serverTimestamp() });
}
export async function setPhotoVisible(id, visible){
  await updateDoc(doc(db, "photos", id), { visible: visible });
}
export async function deletePhoto(id){
  await deleteDoc(doc(db, "photos", id));
}
