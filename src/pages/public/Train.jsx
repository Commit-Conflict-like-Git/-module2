import "../../assets/css/train.css";
import paw from "../../assets/img/paw.svg";
import { useNavigate } from "react-router-dom";
import trainData from "../../pages/owner/trainData.json";
import TrainCard from "../owner/TrainCard";
import SearchBar from "./SearchBar";
import "../../assets/css/searchBar.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

function Train() {
  const navigate = useNavigate();

  const [trainingData, setTrainingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "trainings"));

      const data = querySnapshot.docs.map((doc) => {
        const d = doc.data();

        return {
          id: doc.id,
          trainTitle: d.title,
          trainDescription: d.description,
          trainImg: d.trainImg,
          price: d.price,
        };
      });

      console.log(querySnapshot.docs); // 확인용

      setTrainingData(data);
    };

    fetchData();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/train/${id}`);
  };

  return (
    <div className="back-container">
      <div className="list-header">
        <div className="title-group">
          <img src={paw} alt="개 발바닥" className="paw-icon" />
          <div className="training-title">전체훈련 목록</div>
        </div>
        <SearchBar />
      </div>

      <div className="train-list">
        {/* map 함수를 사용하여 카드 자동 생성 */}
        {trainingData.map((item) => (
          <TrainCard
            key={item.id}
            item={item}
            onClick={() => handleCardClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Train;
