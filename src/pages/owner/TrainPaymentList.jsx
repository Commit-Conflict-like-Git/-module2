import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import "../../assets/css/trainpaymentlist.css";

function TrainPaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTrainer, setIsTrainer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // 1. 현재 로그인 유저 확인
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 2. 유저 역할 확인
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        const role = userData?.role?.toUpperCase();

        const checkTrainer = role === "TRAINER";
        setIsTrainer(checkTrainer);

        let q;
        if (checkTrainer) {
          q = query(
            collection(db, "trainings"),
            where("trainerUid", "==", user.uid),
          );
        } else {
          q = query(collection(db, "payments"), where("uid", "==", user.uid));
        }

        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPayments(list);
      } catch (e) {
        console.error("데이터 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMoveNav = (item) => {
    if (isTrainer) {
      navigate(`/train/${item.id}`);
    } else {
      navigate(`/train/${item.trainId}`);
    }
  };

  if (loading) return <div className="loading">목록을 불러오는 중...</div>;

  return (
    <div className="list-container">
      <div className="list-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          &lt; 뒤로가기
        </button>
        <h2>{isTrainer ? "담당 훈련 목록" : "나의 훈련 내역"}</h2>
      </div>

      <div className="payment-grid">
        {payments.length === 0 ? (
          <div className="empty-msg-box">
            <p className="empty-msg">내역이 존재하지 않습니다.</p>
          </div>
        ) : (
          payments.map((item) => (
            <div key={item.id} className="payment-item-card">
              <div className="card-top">
                <h3 className="card-title">{item.trainTitle}</h3>
              </div>

              <div className="card-body">
                <p>일시: {item.date}</p>
                <p>훈련사: {item.trainerName} 훈련사</p>
                <p>장소: {item.trainPlace}</p>
              </div>

              <div className="card-footer">
                <button className="btn1" onClick={() => handleMoveNav(item)}>
                  상세보기
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TrainPaymentList;
