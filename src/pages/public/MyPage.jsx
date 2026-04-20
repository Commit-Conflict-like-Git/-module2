import React, { useEffect, useState } from "react";
import "../../assets/css/mypage.css";
import userImg from "../../assets/img/user-img.svg";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

function MyPage() {
  const [userData, setUserData] = useState(null);
  const [dogs, setDogs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          // 유저 정보 가져오기
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }

          // 반려견 목록 가져오기
          const dogsRef = collection(db, "users", currentUser.uid, "dogs");
          const dogSnap = await getDocs(dogsRef);
          const dogList = dogSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDogs(dogList);

          // 결제 내역 가져오기
          const paymentSnap = await getDocs(
            query(
              collection(db, "payments"),
              where("uid", "==", currentUser.uid),
            ),
          );
          const paymentList = paymentSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPayments(paymentList);
        } catch (error) {
          console.error("데이터 로딩 실패:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="mypage-user-container">데이터 로딩 중...</div>;
  }

  if (!userData) {
    return <div className="mypage-user-container">로그인이 필요합니다.</div>;
  }

  return (
    <div>
      <div className="mypage-user-container">
        <img
          src={userData.profileImage || userImg}
          alt="프로필"
          className="mypage-user-img"
        />
        <div className="user-content">
          <p className="mypage-user-name">
            {userData.userName || userData.name}
          </p>
          <button className="btn1">더보기</button>
        </div>
      </div>

      <div className="mypage-main-container">
        {/* 왼쪽 */}
        <div className="mypage-myDogs">
          <div className="myDog-content">
            <div className="mypage-section-header">
              <p className="myDog-title">나의 반려견</p>
              <button
                className="btn1"
                onClick={() => navigate("/dog/register")}
              >
                등록하기
              </button>
            </div>
          </div>

          <div className="dog-list">
            {dogs.length === 0 ? (
              <p className="non-msg">등록된 강아지가 없습니다.</p>
            ) : (
              dogs.map((dog) => (
                <div key={dog.id} className="dog-card">
                  <img
                    src={dog.photo || userImg}
                    alt={dog.name}
                    className="dog-img"
                  />
                  <div className="dog-info">
                    <p className="dog-name">{dog.name}</p>
                    <p className="dog-breed">{dog.breed}</p>
                    <p className="dog-weight">{dog.weight}kg</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 오른쪽 */}
        <div className="mypage-train-review">
          {/* 훈련 목록 */}
          <div className="mypage-trainList">
            <div className="trainList-content">
              <div className="mypage-section-header">
                <p className="trainList-title">훈련 목록</p>
                <button className="btn1">더보기</button>
              </div>
            </div>

            <div className="train-list-body">
              {payments.length === 0 ? (
                <div className="non-msg">결제 내역이 없습니다.</div>
              ) : (
                payments.map((pay) => (
                  <div key={pay.id} className="train-item-card">
                    <p className="train-item-card-title">{pay.trainTitle}</p>

                    <p>{pay.trainerName} 훈련사</p>

                    <p>{pay.price?.toLocaleString()}원</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 후기 */}

          <div className="mypage-review">
            <div className="mypage-reviewList">
              <div className="reviewList-content">
                <div className="mypage-section-header">
                  <p className="reviewList-title">훈련 후기</p>

                  <button className="btn1">더보기</button>
                </div>
              </div>

              <div className="review-list-body">
                <p className="non-msg">작성한 후기가 없습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MyPage;
