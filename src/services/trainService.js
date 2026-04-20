import { db, storage, auth } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

export const registerTrainPost = async (formData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("로그인이 필요합니다.");

    let trainerName = "익명";
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        // DB의 필드명(name 혹은 displayName)에 맞춰서 가져옵니다.
        trainerName = userSnap.data().name || userSnap.data().displayName || "이름 없음";
      }
    } catch (e) {
      console.log("사용자 이름을 가져오는데 실패했습니다.", e);
    }

    let imageUrl = "";

    if (formData.trainImg) {
      const storageRef = ref(storage, `trains/${user.uid}_${formData.trainImg.name}`);
      
      const snapshot = await uploadBytes(storageRef, formData.trainImg);
      
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const docRef = await addDoc(collection(db, "trainings"), {
      trainerUid: user.uid,
      trainerName: trainerName,
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