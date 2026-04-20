import { db, storage, auth } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const registerTrainPost = async (formData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("로그인이 필요합니다.");

    let imageUrl = "";

    if (formData.trainImg) {
      const storageRef = ref(storage, `trains/${user.uid}_${formData.trainImg.name}`);
      
      const snapshot = await uploadBytes(storageRef, formData.trainImg);
      
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const docRef = await addDoc(collection(db, "trainings"), {
      trainerUid: user.uid,
      trainTitle: formData.trainTitle,
      day: formData.day,
      date: formData.date,
      ampm: formData.ampm,
      trainTime: formData.trainTime,
      trainPlace: formData.trainPlace,
      dogSize: formData.dogSize,
      ageGroup: formData.ageGroup,
      price: formData.price,
      trainDescription: formData.trainDescription,
      trainImg: imageUrl,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("등록 중 오류 발생:", error);
    throw error;
  }
};