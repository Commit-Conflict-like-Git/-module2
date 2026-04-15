import "../../assets/css/train.css";
import paw from "../../assets/img/paw.svg";
import { useNavigate } from "react-router-dom";

function Train() {
  const navigate = useNavigate();

  const trainingData = [
    { id: 1, title: "사회성 길들이기 기초", img: "" },
    { id: 2, title: "배변 훈련의 정석", img: "" },
    { id: 3, title: "산책 매너 배우기", img: "" },
    { id: 4, title: "분리불안 예방 교육", img: "" },
    { id: 5, title: "기본 복종 훈련", img: "" },
    { id: 6, title: "클리커 트레이닝", img: "" },
  ];

  const handleCardClick = (id) => {
    navigate(`/Train/${id}`);
  };

  return (
    <div className="back-container">
      <div className="list-header">
        <div className="title-group">
          <img
            src="src/assets/img/paw.svg"
            alt="개 발바닥"
            className="paw-icon"
          />
          <div className="training-title">전체훈련 목록</div>
        </div>

        <div className="search-group">
          <select className="filter-select">
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
          </select>

          <div className="search-box">
            <input type="text" placeholder="검색어를 입력하세요" />
            <div className="search-btn">
              <img src="src/assets/img/reading-glasses.svg" alt="돋보기" />
            </div>
          </div>
        </div>
      </div>

      <div className="train-list">
        {/* map 함수를 사용하여 카드 자동 생성 */}
        {trainingData.map((item) => (
          <div
            key={item.id}
            className="train-card"
            onClick={() => handleCardClick(item.id)}
          >
            <div className="tr-card-img">
              {item.img && <img src={item.img} alt={item.title} />}
            </div>
            <div className="tr-card-content">
              <span className="tr-card-title">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Train;
