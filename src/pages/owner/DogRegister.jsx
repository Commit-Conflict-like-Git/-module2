import React, { useState } from "react";
import { db, auth, storage } from "../../firebase/config";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "../../assets/css/dogRegister.css";
import ModalOneBtn from "../../components/public/modalOneBtn";

function DogRegister() {
  const navigate = useNavigate();
  const [dogInfo, setDogInfo] = useState({
    name: "",
    birth: "",
    gender: "male",
    breed: "",
    weight: "",
    note: "",
    photo: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDogInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setDogInfo((prev) => ({ ...prev, photo: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      setModalMsg("로그인이 필요합니다.");
      setIsModalOpen(true);
      return;
    }

    setIsUploading(true);

    try {
      // 1. 중복 체크
      const dogsRef = collection(db, "dogs");
      const q = query(
        dogsRef,
        where("userId", "==", user.uid),
        where("name", "==", dogInfo.name.trim()),
        where("breed", "==", dogInfo.breed.trim()),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setModalMsg("이미 등록된 반려견 정보입니다.");
        setIsModalOpen(true);
        setIsUploading(false);
        return;
      }

      // 2. 이미지 Firebase Storage 업로드
      let imageUrl = "";
      if (dogInfo.photo) {
        const storageRef = ref(
          storage,
          `dogs/${user.uid}_${Date.now()}_${dogInfo.photo.name}`,
        );
        const snapshot = await uploadBytes(storageRef, dogInfo.photo);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 3. 최상위 'dogs' 컬렉션에 상세 정보 저장
      const newDogData = {
        userId: user.uid,
        name: dogInfo.name,
        birth: dogInfo.birth,
        gender: dogInfo.gender,
        breed: dogInfo.breed,
        weight: Number(dogInfo.weight),
        note: dogInfo.note,
        photo: imageUrl,
        createdAt: new Date(),
      };
      const docRef = await addDoc(dogsRef, newDogData);
      const dogId = docRef.id;

      // 4. 유저 정보 업데이트
      const detailsDocRef = doc(db, "users", user.uid, "owner", "info_details");
      const detailsDocSnap = await getDoc(detailsDocRef);

      if (detailsDocSnap.exists()) {
        await updateDoc(detailsDocRef, {
          dogs: arrayUnion(dogId),
        });
      } else {
        await setDoc(detailsDocRef, {
          dogs: [dogId],
        });
      }

      // 성공
      setModalMsg("반려견 정보 등록이 완료되었습니다!");
      setIsSuccess(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("등록 중 오류 발생:", error);
      setModalMsg("정보 등록에 실패했습니다.");
      setIsModalOpen(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      navigate("/mypage");
    }
  };

  return (
    <div className="register-container">
      <h2>반려견 등록</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="scroll-content">
          <label className="input-label">반려견 사진</label>
          <div className="input-row">
            <input
              type="text"
              className="trainpost-textbox"
              readOnly
              placeholder="사진을 선택해주세요"
              value={dogInfo.photo?.name || ""}
            />
            <label className="btn1 file-btn">
              파일선택
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>

          <label className="input-label">이름</label>
          <input
            name="name"
            placeholder="강아지 이름을 입력해주세요"
            onChange={handleChange}
            required
          />

          <label className="input-label">생년월일</label>
          <input
            name="birth"
            type="date"
            className="b-day-content"
            onChange={handleChange}
            required
          />

          <label className="input-label">성별</label>
          <select name="gender" value={dogInfo.gender} onChange={handleChange}>
            <option value="male">남아</option>
            <option value="female">여아</option>
          </select>

          <label className="input-label">견종</label>
          <input
            name="breed"
            placeholder="견종을 입력해주세요 예) 푸들, 말티즈"
            onChange={handleChange}
            required
          />

          <label className="input-label">몸무게</label>
          <input
            name="weight"
            type="number"
            step="0.1"
            placeholder="kg 단위로 입력헤주세요"
            onChange={handleChange}
            required
          />

          <label className="input-label">특이사항</label>
          <textarea
            name="note"
            placeholder="성격이나 주의할 점을 적어주세요"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn1 submit-btn"
          disabled={isUploading}
        >
          {isUploading ? "등록 중..." : "등록하기"}
        </button>
      </form>

      {/* 모달 컴포넌트 배치 */}
      <ModalOneBtn
        isOpen={isModalOpen}
        modalText={modalMsg}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default DogRegister;
