import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/payment.css";
import { addDoc, collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import modalOneBtn from "../../components/public/modalOneBtn";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedItems = location.state?.selectedItems || [];
  const totalAmount = location.state?.totalAmount || 0;

  const [dogs, setDogs] = useState([]);

  // 강아지 선택
  const [selectedDogs, setSelectedDogs] = useState({});

  // 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 유저 강아지 정보 가져오기
  useEffect(() => {
    const fetchDogs = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setDogs(userDoc.data().dogs || []);
      }
    };

    fetchDogs();
  }, []);

  // 강아지 선택
  const handleDogChange = (itemId, dogId) => {
    setSelectedDogs((prev) => ({
      ...prev,
      [itemId]: dogId,
    }));
  };

  // 결제 처리
  const handleCompletePayment = async () => {
    const user = auth.currentUser;

    if (!user) {
      setModalMsg("로그인이 필요합니다.");
      setIsModalOpen(true);
      return;
    }

    if (selectedItems.length === 0) {
      setModalMsg("결제할 항목이 없습니다.");
      setIsModalOpen(true);
      return;
    }

    try {
      // 결제 저장
      await Promise.all(
        selectedItems.map((item) =>
          addDoc(collection(db, "payments"), {
            uid: user.uid,
            userEmail: user.email,
            trainId: item.trainId,
            trainTitle: item.trainTitle,
            trainerName: item.trainerName,
            price: item.price,
            date: item.date,
            trainPlace: item.trainPlace,
            dogId: selectedDogs[item.id || item.trainId] || "default_dog_id",
            paymentDate: new Date().toISOString(),
            status: "결제완료",
          }),
        ),
      );

      // 장바구니 삭제
      await Promise.all(
        selectedItems.map((item) => {
          if (item.id) {
            return deleteDoc(doc(db, "carts", item.id));
          }
          return null;
        }),
      );

      setModalMsg("결제가 완료되었습니다.");
      setIsModalOpen(true);
      setIsSuccess(true);
    } catch (error) {
      console.error("결제 실패:", error);
      setModalMsg("결제 중 오류가 발생했습니다.");
      setIsModalOpen(true);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      navigate("/");
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-title">결제하기</div>

      <div className="payment-card-wrapper">
        {/* 왼쪽 */}
        <div className="left-container">
          {selectedItems.map((item) => (
            <div key={item.id || item.trainId} className="payment-item">
              <span className="info-label">훈련명</span>
              <span className="info-value">{item.trainTitle}</span>

              <span className="info-label">훈련사</span>
              <span className="info-value">{item.trainerName} 훈련사</span>

              <span className="info-label">일시</span>
              <span className="info-value">{item.date}</span>

              <span className="info-label">장소</span>
              <span className="info-value">{item.trainPlace}</span>

              <span className="info-label">예약 강아지</span>
              <select
                className="dog-select"
                onChange={(e) =>
                  handleDogChange(item.id || item.trainId, e.target.value)
                }
              >
                <option value="">강아지 선택</option>

                {dogs.map((dog) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name}
                  </option>
                ))}
              </select>

              <div className="item-line"></div>
            </div>
          ))}

          {selectedItems.length === 0 && <p>결제할 정보가 없습니다.</p>}
        </div>

        {/* 오른쪽 */}
        <div className="right-container">
          <div className="total-price-box">
            <p className="item-summary-title">
              {selectedItems.length > 1
                ? `${selectedItems[0].trainTitle} 외 ${
                    selectedItems.length - 1
                  }건`
                : selectedItems[0]?.trainTitle}
            </p>

            <p className="total-label">총 금액</p>
            <p className="total-price">{totalAmount.toLocaleString()}원</p>
          </div>

          <button className="btn1" onClick={handleCompletePayment}>
            결제 하기
          </button>
        </div>
      </div>

      <ModalOneBtn
        isOpen={isModalOpen}
        modalText={modalMsg}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default Payment;
