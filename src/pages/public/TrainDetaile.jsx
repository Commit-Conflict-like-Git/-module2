import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/trainDetaile.css";
import "../../assets/css/button.css";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

function TrainDetaile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);

  // 1. 훈련 정보 불러오기
  useEffect(() => {
    const fetchDetail = async () => {
      const docRef = doc(db, "trainings", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDetail(docSnap.data());
      }
    };

    fetchDetail();
  }, [id]);

  if (!detail) return <div>로딩중...</div>;
  // 2. 장바구니에 추가하기
  // const handleAddToCart = async () => {};
  const handleAddToCart = () => {
    console.log("장바구니 클릭");
  };

  const handleToPayment = () => {
    navigate("/payment", {
      state: {
        // selectedItems를 현재 보고 있는 훈련 1개만 배열에 담아서 보냄
        selectedItems: [
          {
            id: id,
            title: detail.trainTitle,
            trainer: detail.trainerName,
            price: detail.price,
            day: detail.date,
            location: detail.trainPlace,
          },
        ],
        totalAmount: detail.price,
      },
    });
    console.log("결제하기 버튼 클릭 - 데이터 전달 완료");
  };

  return (
    <div className="container">
      {/* 왼쪽 영역 */}
      <div className="container-left">
        <img
          src="/src/assets/img/menu.svg"
          alt="메뉴바"
          className="menubar"
          onClick={() => navigate("/Train")}
        />
        <div className="top-group">
          <p className="train-title">{detail.trainTitle}</p>
          <img
            src={detail.trainImg}
            alt={detail.trainTitle}
            className="trainImg"
          />
        </div>

        <hr />

        <div className="train-content">
          <p>{detail.trainDescription}</p>
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
          <span>{detail.date}</span>
          <span>{detail.day}</span>
          <span>{detail.ampm}</span>
          <span>{detail.trainTime}</span>
        </div>

        <div className="trainerTitle">담당 훈련사: </div>
        <div className="trainTrainer">
          <span>{detail.trainerName} 훈련사</span>
        </div>

        <div className="moneyTitle">비용: </div>
        <div className="money">
          <span>{detail.price?.toLocaleString()}원</span>
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
    </div>
  );
}

export default TrainDetaile;
