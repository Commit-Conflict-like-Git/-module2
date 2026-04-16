import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/trainDetaile.css";
import "../../assets/css/button.css";
import trainData from "../../pages/owner/trainData.json";

function TrainDetaile() {
  const { id } = useParams();

  const navigate = useNavigate();

  const detail = trainData.find((item) => item.trainId === id);

  if (!detail) return <div>데이터를 불러오는 중...</div>;

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
          <div className="trainImg">{detail.trainImg}</div>
        </div>

        <hr />

        <div className="train-content">
          <p>{detail.trainDescription}</p>
        </div>

        <div className="review-box">
          <div className="review-title-box">
            <div className="review-title">훈련 후기</div>
            <button className="btn1">더보기</button>
          </div>
          <div className="review-content">dddd</div>
          <div className="review-content">dddd</div>
          <div className="review-content">dddd</div>
        </div>

        <div className="notice-box">
          <div className="notice-title-box">
            <div className="notice-title">훈련 공지사항</div>
            <button className="btn1">더보기</button>
          </div>
          <div className="notice-content">dddd</div>
          <div className="notice-content">dddd</div>
          <div className="notice-content">dddd</div>
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
          <span>{detail.price.toLocaleString()}원</span>
        </div>

        <div className="btn-group">
          <button className="btn1 pay">결제하기</button>
          <button className="btn3">장바구니 담기</button>
        </div>
      </div>
    </div>
  );
}

export default TrainDetaile;
