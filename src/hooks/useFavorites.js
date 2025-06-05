import { db } from "../firebase";
import {
  collection, addDoc, getDocs, query, where, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";

// 取得當前用戶所有收藏的 listingId
export async function getFavoriteIds(userId) {
  const q = query(collection(db, "favorites"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().listingId);
}

// 收藏
export async function addFavorite(userId, listingId) {
  await addDoc(collection(db, "favorites"), {
    userId, listingId, createdAt: serverTimestamp()
  });
}

// 取消收藏
export async function removeFavorite(userId, listingId) {
  const q = query(
    collection(db, "favorites"),
    where("userId", "==", userId),
    where("listingId", "==", listingId)
  );
  const snapshot = await getDocs(q);
  for (let d of snapshot.docs) {
    await deleteDoc(doc(db, "favorites", d.id));
  }
}