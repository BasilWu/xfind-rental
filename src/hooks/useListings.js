// src/hooks/useListings.js
import { db, storage } from "../firebase";
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 取得所有房源
export async function getListings() {
  const querySnapshot = await getDocs(collection(db, "listings"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 新增房源
export async function addListing(data) {
  const {
    title, description, address, city, district, street,
    latitude, longitude, amenities, areaSize, availableFrom,
    pricePerMonth, roomType, imageFiles, landlordId,
    status = "published"
  } = data;

  // 圖片上傳
  let images = [];
  if (imageFiles && imageFiles.length > 0) {
    for (let file of imageFiles) {
      const storageRef = ref(storage, `listings/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      images.push(url);
    }
  }

  const docRef = await addDoc(collection(db, "listings"), {
    title,
    description,
    address,
    city,
    district,
    street,
    latitude: latitude ? Number(latitude) : null,
    longitude: longitude ? Number(longitude) : null,
    amenities: amenities || [],
    areaSize: areaSize ? Number(areaSize) : null,
    availableFrom: availableFrom ? new Date(availableFrom) : null,
    pricePerMonth: pricePerMonth ? Number(pricePerMonth) : null,
    roomType,
    images,
    landlordId,
    status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// 編輯房源
export async function updateListing(listingId, data) {
  data.updatedAt = serverTimestamp();
  await updateDoc(doc(db, "listings", listingId), data);
}

// 刪除房源
export async function deleteListing(listingId) {
  await deleteDoc(doc(db, "listings", listingId));
}