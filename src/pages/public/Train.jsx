import "../../assets/css/train.css";
import paw from "../../assets/img/paw.svg";
import { useNavigate } from "react-router-dom";
import trainData from "../../pages/owner/trainData.json";
import TrainCard from "../owner/TrainCard";
import SearchBar from "./SearchBar";
import "../../assets/css/searchBar.css";

function Train() {
  const navigate = useNavigate();

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
        <SearchBar />
      </div>

      <div className="train-list">
        {/* map 함수를 사용하여 카드 자동 생성 */}
        {trainData.map((item) => (
          <TrainCard
            key={item.trainId}
            item={item}
            onClick={() => handleCardClick(item.trainId)}
          />
        ))}
      </div>
    </div>
  );
}

export default Train;
