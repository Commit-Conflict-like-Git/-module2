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
  documentId,
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
          // 1. 유저 정보 가져오기
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData(data);

            // 2. 역할에 따른 처리
            if (data.role === "trainer") {
              // 훈련사: 본인에게 배정된 훈련 목록만 가져오기
              const trainerPaymentQuery = query(
                collection(db, "trainings"),
                where("trainerUid", "==", currentUser.uid),
              );
              const paySnap = await getDocs(trainerPaymentQuery);
              setPayments(
                paySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
              );
            } else {
              // 사용자: 강아지 정보 + 본인 결제 내역 + 후기
              const detailsRef = doc(
                db,
                "users",
                currentUser.uid,
                "owner",
                "info_details",
              );
              const detailsSnap = await getDoc(detailsRef);

              if (detailsSnap.exists() && detailsSnap.data().dogs?.length > 0) {
                const dogIds = detailsSnap.data().dogs;
                const dogsQuery = query(
                  collection(db, "dogs"),
                  where(documentId(), "in", dogIds),
                );
                const dogSnap = await getDocs(dogsQuery);
                setDogs(
                  dogSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
                );
              }

              const userPaymentQuery = query(
                collection(db, "payments"),
                where("uid", "==", currentUser.uid),
              );
              const paySnap = await getDocs(userPaymentQuery);
              setPayments(
                paySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
              );
            }
          }
        } catch (error) {
          console.error("데이터 로딩 실패:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return <div className="mypage-user-container">데이터 로딩 중...</div>;
  if (!userData)
    return <div className="mypage-user-container">로그인이 필요합니다.</div>;

  // 역할 확인용 변수
  const isTrainer = userData.role === "trainer";

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
            {userData.userName || userData.name} {isTrainer && "(훈련사)"}
          </p>
          <button className="btn1">정보 수정</button>
        </div>
      </div>

      <div className="mypage-main-container">
        {/* 왼쪽 섹션: 역할에 따라 '나의 반려견' 또는 '피드백 작성' */}
        <div className="mypage-myDogs">
          <div className="myDog-content">
            <div className="mypage-section-header">
              <p className="myDog-title">
                {isTrainer ? "피드백 작성" : "나의 반려견"}
              </p>
              {!isTrainer && (
                <button
                  className="btn1"
                  onClick={() => navigate("/dog/register")}
                >
                  등록하기
                </button>
              )}
            </div>
          </div>

          <div className="dog-list">
            {isTrainer ? (
              // 훈련사 화면: 피드백 목록
              payments.length === 0 ? (
                <p className="non-msg">작성할 피드백이 없습니다.</p>
              ) : (
                payments.map((item) => (
                  <div key={item.id} className="dog-card">
                    <div className="dog-info">
                      <p className="dog-name">{item.trainTitle}</p>
                      <button className="btn1">작성하기</button>
                    </div>
                  </div>
                ))
              )
            ) : // 일반 사용자 화면: 기존 강아지 리스트
            dogs.length === 0 ? (
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
                    <p className="dog-name">
                      {dog.name} | {dog.breed} | {dog.weight}kg
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 오른쪽 섹션: 훈련 목록 및 후기 */}
        <div className="mypage-train-review">
          <div className="mypage-trainList">
            <div className="trainList-content">
              <div className="mypage-section-header">
                <p className="trainList-title">
                  {isTrainer ? "담당 훈련 목록" : "훈련 목록"}
                </p>
                <button
                  className="btn1"
                  onClick={() => navigate("/trainpaymentlist")}
                >
                  더보기
                </button>
              </div>
            </div>
            <div className="train-list-body">
              {payments.length === 0 ? (
                <div className="non-msg">내역이 없습니다.</div>
              ) : (
                payments.map((pay) => (
                  <div key={pay.id} className="train-item-card">
                    <p className="train-item-card-title">{pay.trainTitle}</p>
                    <p>
                      {isTrainer
                        ? `신청자: ${pay.userName}`
                        : `${pay.trainerName} 훈련사`}
                    </p>
                    <p>{pay.price?.toLocaleString()}원</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mypage-review">
            <div className="reviewList-content">
              <div className="mypage-section-header">
                <p className="reviewList-title">훈련 후기</p>
                <button className="btn1">더보기</button>
              </div>
            </div>
            <div className="review-list-body">
              <p className="non-msg">작성된 후기가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
