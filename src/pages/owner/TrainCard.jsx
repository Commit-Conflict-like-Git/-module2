import React from "react";

function TrainCard({ item, onClick }) {
  return (
    <div className="train-card" onClick={() => onClick(item.trainID)}>
      <div className="tr-card-img">
        {item.trainImg && <img src={item.trainImg} alt={item.trainTitle} />}
      </div>

      <div className="tr-card-content">
        <span className="tr-card-title">{item.trainTitle}</span>
      </div>
    </div>
  );
}

export default TrainCard;
