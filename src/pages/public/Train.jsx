import "../../assets/css/train.css";
import paw from "../../assets/img/paw.svg";
import { useNavigate } from "react-router-dom";
import trainData from "../../pages/owner/trainData.json";

function Train() {
  const navigate = useNavigate();

  const trainingData = trainData;

  const handleCardClick = (id) => {
    navigate(`/train/${id}`);
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
            key={item.trainId}
            className="train-card"
            onClick={() => handleCardClick(item.trainId)}
          >
            <div className="tr-card-img">
              {item.trainImg && (
                <img src={item.trainImg} alt={item.trainTitle} />
              )}
            </div>
            <div className="tr-card-content">
              <span className="tr-card-title">{item.trainTitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Train;
