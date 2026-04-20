import React, { useState } from "react";
import { db, auth } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../../assets/css/dogRegister.css";

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
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const dogsCollectionRef = collection(db, "dogs", user.uid);

      await addDoc(dogsCollectionRef, {
        name: dogInfo.name,
        birth: dogInfo.birth,
        gender: dogInfo.gender,
        breed: dogInfo.breed,
        weight: Number(dogInfo.weight),
        note: dogInfo.note,
        photo: dogInfo.photo ? dogInfo.photo.name : "",
        createdAt: new Date(),
      });

      alert("반려견이 성공적으로 등록되었습니다! 🐾");
      navigate("/mypage");
    } catch (error) {
      console.error("등록 중 오류 발생:", error);
      alert("등록에 실패했습니다.");
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
              />
            </label>
          </div>

          <label className="input-label">이름</label>
          <input
            name="name"
            placeholder="강아지 이름을 입력하세요"
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
            placeholder="예: 푸들, 말티즈"
            onChange={handleChange}
            required
          />

          <label className="input-label">몸무게</label>
          <input
            name="weight"
            type="string"
            step="0.1"
            placeholder="kg 단위로 입력"
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

        <button type="submit" className="btn1 submit-btn">
          등록하기
        </button>
      </form>
    </div>
  );
}

export default DogRegister;
