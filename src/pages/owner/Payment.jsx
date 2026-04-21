import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/payment.css";
import { addDoc, collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import ModalOneBtn from "../../components/public/modalOneBtn";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedItems = location.state?.selectedItems || [];

  const [dogs, setDogs] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedDogs, setSelectedDogs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 합계 계산
  const totalAmount = selectedItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + price;
  }, 0);

  // 유저 및 강아지 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // user에서 정보 가져오기
        const infoRef = doc(db, "users", user.uid, "owner", "info_details");
        const infoSnap = await getDoc(infoRef);

        if (!infoSnap.exists()) return;

        const data = infoSnap.data();
        const dogIds = data.dogs || [];

        setUserData(data);

        // dogs 컬렉션에서 실제 정보 가져오기
        const dogPromises = dogIds.map(async (dogId) => {
          const dogRef = doc(db, "dogs", dogId);
          const dogSnap = await getDoc(dogRef);

          if (dogSnap.exists()) {
            return {
              id: dogId,
              ...dogSnap.data(),
            };
          }
          return null;
        });

        const dogList = (await Promise.all(dogPromises)).filter(Boolean);

        setDogs(dogList);

        console.log("강아지 목록:", dogList);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  // 1. 강아지 선택 시 객체 전체를 찾아 저장하도록 수정
  const handleDogChange = (itemId, dogId) => {
    const dogInfo = dogs.find((d) => d.id === dogId); // ID로 강아지 객체 찾기
    setSelectedDogs((prev) => ({
      ...prev,
      [itemId]: dogInfo, // ID가 아닌 객체 자체를 저장
    }));
  };

  // 결제 처리
  const handleCompletePayment = async () => {
    const user = auth.currentUser;

    if (!user || !userData) {
      setModalMsg("유저 정보가 없습니다. 로그인이 필요합니다.");
      setIsModalOpen(true);
      return;
    }

    if (selectedItems.length === 0) {
      setModalMsg("결제할 항목이 없습니다.");
      setIsModalOpen(true);
      return;
    }

    // 모든 항목에 강아지가 선택되었는지 확인
    const allSelected = selectedItems.every(
      (item) => selectedDogs[item.id || item.trainId],
    );
    if (!allSelected) {
      setModalMsg("예약할 강아지를 선택해주세요.");
      setIsModalOpen(true);
      return;
    }

    try {
      await Promise.all(
        selectedItems.map(async (item) => {
          const dogInfo = selectedDogs[item.id || item.trainId];

          return addDoc(collection(db, "payments"), {
            uid: user.uid,
            userEmail: user.email,
            userName: userData.userName || user.displayName,

            trainId: item.trainId,
            trainerId: item.trainerUid || item.trainerId || "",
            trainTitle: item.trainTitle,
            trainerName: item.trainerName,
            price: Number(item.price) || 0,
            date: item.date,
            trainPlace: item.trainPlace,

            // 강아지 정보
            dogId: dogInfo?.id || "default_id",
            dogName: dogInfo?.dogName || dogInfo?.name || "정보 없음",
            dogPhoto: dogInfo?.dogPhoto || dogInfo?.photo || "",
            dogType: dogInfo?.dogType || "",

            paymentDate: new Date().toISOString(),
            status: "결제완료",
            feedback: "",
          });
        }),
      );

      setIsSuccess(true);
      setModalMsg("결제가 완료되었습니다.");
      setIsModalOpen(true);
    } catch (error) {
      console.error("결제 저장 실패:", error);
      setModalMsg("결제 중 오류가 발생했습니다.");
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      navigate("/trainpaymentlist");
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-title">결제하기</div>

      <div className="payment-card-wrapper">
        <div className="left-container">
          {selectedItems.map((item) => (
            <div key={item.id || item.trainId} className="payment-item">
              <span className="payment-info-title">훈련명</span>
              <span className="payment-info-value">{item.trainTitle}</span>

              <span className="payment-info-title">훈련사</span>
              <span className="payment-info-value">
                {item.trainerName} 훈련사
              </span>

              <span className="payment-info-title">일시</span>
              <span className="payment-info-value">{item.date}</span>

              <span className="payment-info-title">장소</span>
              <span className="payment-info-value">{item.trainPlace}</span>

              <span className="payment-info-title">예약 강아지</span>
              <select
                className="dog-select"
                onChange={(e) =>
                  handleDogChange(item.id || item.trainId, e.target.value)
                }
              >
                <option value="">강아지 선택</option>
                {dogs.map((dog) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.dogName || dog.name}
                  </option>
                ))}
              </select>

              <div className="item-line"></div>
            </div>
          ))}
          {selectedItems.length === 0 && <p>결제할 정보가 없습니다.</p>}
        </div>

        <div className="right-container">
          <div className="total-price-box">
            <p className="item-summary-title">
              {selectedItems.length > 1
                ? `${selectedItems[0].trainTitle} 외 ${selectedItems.length - 1}건`
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
