import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/trainDetaile.css";
import "../../assets/css/button.css";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import ModalOneBtn from "../../components/public/modalOneBtn";

function TrainDetaile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      const docSnap = await getDoc(doc(db, "trainings", id));
      if (docSnap.exists()) {
        setItem(docSnap.data());
      }
    };
    fetchDetail();
  }, [id]);

  // 장바구니 추가 로직
  const handleAddToCart = async () => {
    if (!item) return;
    const user = auth.currentUser;

    if (!user) {
      setModalMsg("로그인이 필요합니다.");
      setIsModalOpen(true);
      return;
    }

    const cartItem = {
      uid: user.uid,
      trainId: id,
      trainTitle: item.trainTitle,
      trainerName: item.trainerName,
      price: item.price,
      date: item.date,
      trainPlace: item.trainPlace,
    };

    try {
      await addDoc(collection(db, "carts"), cartItem);
      setModalMsg("장바구니에 훈련이 추가되었습니다.");
      setIsModalOpen(true);
    } catch (error) {
      console.error("장바구니 저장 에러: ", error);
      setModalMsg("장바구니 담기에 실패했습니다. 다시 시도해주세요.");
      setIsModalOpen(true);
    }
  };

  const handleToPayment = () => {
    if (!item) return;
    navigate("/payment", {
      state: {
        selectedItems: [
          {
            id: null,
            trainId: id,
            trainTitle: item.trainTitle,
            trainerName: item.trainerName,
            price: item.price,
            date: item.date,
            trainPlace: item.trainPlace,
          },
        ],
        totalAmount: item.price,
      },
    });
  };

  if (!item) return <div>로딩중...</div>;

  return (
    <div className="container">
      <div className="container-left">
        <img
          src="/src/assets/img/menu.svg"
          alt="메뉴바"
          className="menubar"
          onClick={() => navigate("/Train")}
        />
        <div className="top-group">
          <p className="train-title">{item.trainTitle}</p>
          <img src={item.trainImg} alt={item.trainTitle} className="trainImg" />
        </div>
        <hr />
        <div className="train-content">
          <p>{item.trainDescription}</p>
        </div>
        <hr />
        <div className="review-box">
          <div className="review-title-box">
            <div className="review-title">훈련 후기</div>
            <button className="btn1">더보기</button>
          </div>
          <div className="review-content">
            우리 아이가 다른 친구를 보고 안 짖어요!
          </div>
          <div className="review-content">
            입질 때문에 힘들었는데 드디어 해결책을 찾았습니다.
          </div>
          <div className="review-content">
            '기다려'를 1분 넘게 하다니 기적 같아요!
          </div>
        </div>
        <div className="notice-box">
          <div className="notice-title-box">
            <div className="notice-title">훈련 공지사항</div>
            <button className="btn1">더보기</button>
          </div>
          <div className="notice-content">
            훈련 이용 시 주의사항 및 안전 수칙
          </div>
          <div className="notice-content">훈련사 피드백 확인 방법</div>
          <div className="notice-content">
            훈련 예약 취소 및 환불 규정에 대해 안내드립니다.
          </div>
        </div>
      </div>

      <div className="container-right">
        <div className="timeTitle">훈련 시간: </div>
        <div className="trainTime">
          <span>{item.date}</span>
          <span>{item.day}</span>
          <span>{item.ampm}</span>
          <span>{item.trainTime}</span>
        </div>
        <div className="trainerTitle">담당 훈련사: </div>
        <div className="trainTrainer">
          <span>{item.trainerName} 훈련사</span>
        </div>
        <div className="moneyTitle">비용: </div>
        <div className="money">
          <span>{item.price?.toLocaleString()}원</span>
        </div>
        <div className="btn-group">
          <button className="btn1 pay" onClick={handleToPayment}>
            결제하기
          </button>
          <button className="btn3" onClick={handleAddToCart}>
            장바구니 담기
          </button>
        </div>
      </div>

      {/* 모달 */}
      <ModalOneBtn
        isOpen={isModalOpen}
        modalText={modalMsg}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default TrainDetaile;
