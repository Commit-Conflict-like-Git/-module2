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

  // 상세 데이터 가져오기
  useEffect(() => {
    const fetchDetail = async () => {
      const docSnap = await getDoc(doc(db, "trainings", id));
      if (docSnap.exists()) {
        setItem(docSnap.data());
      }
    };
    fetchDetail();
  }, [id]);

  const getPrice = (price) => {
    return Number(String(price).replace(/,/g, "")) || 0;
  };

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
      price: getPrice(item.price), // 숫자로 저장
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

  //  결제
  const handleToPayment = () => {
    if (!item) return;

    const price = getPrice(item.price);

    navigate("/payment", {
      state: {
        selectedItems: [
          {
            id: null,
            trainId: id,
            trainTitle: item.trainTitle,
            trainerName: item.trainerName,
            price: price,
            date: item.date,
            trainPlace: item.trainPlace,
          },
        ],
      },
    });
  };

  if (!item) return <div>로딩중...</div>;

  return (
    <div className="container">
      {/* 왼쪽 */}
      <div className="container-left">
        <img
          src="/src/assets/img/menu.svg"
          alt="메뉴바"
          className="menubar"
          onClick={() => navigate("/train")}
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

        {/* 후기 */}
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

        {/* 공지 */}
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

      {/* 오른쪽 */}
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
          <span>{getPrice(item.price).toLocaleString()}원</span>
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
