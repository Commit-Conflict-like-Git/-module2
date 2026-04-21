import "../../assets/css/train.css";
import paw from "../../assets/img/paw.svg";
import { useNavigate } from "react-router-dom";
import TrainCard from "../owner/TrainCard";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/config";

function Train() {
  const navigate = useNavigate();

  const [trainingData, setTrainingData] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setUserRole(null);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("유저 정보 가져오기 실패:", error);
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "trainings"));

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTrainingData(data);
      } catch (error) {
        console.error("데이터를 불러오는 중 에러 발생:", error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/train/${id}`);
  };

  const handleAddTrain = () => {
    navigate("/trainer/post");
  };

  return (
    <div className="back-container">
      <div className="list-header">
        {/* 왼쪽 */}
        <div className="title-group">
          <img src={paw} alt="개 발바닥" className="paw-icon" />
          <div className="training-title">전체훈련 목록</div>
        </div>

        {/* 오른쪽 */}
        <div className="right-area">
          {userRole === "trainer" && (
            <button className="btn1" onClick={handleAddTrain}>
              훈련 추가하기
            </button>
          )}

          <SearchBar />
        </div>
      </div>

      <div className="train-list">
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
