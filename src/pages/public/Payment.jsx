import React from "react";
import "../../assets/css/payment.css";
import { useLocation, useNavigate } from "react-router-dom";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. 장바구니에서 보낸 데이터 받기 (없으면 null)
  const receivedItems = location.state?.selectedItems;
  const receivedAmount = location.state?.totalAmount;

  // 3. 최종적으로 화면에 그릴 데이터 결정
  // const selectedItems = receivedItems || defaultItems;
  // const totalAmount = receivedAmount || 0;

  // 방어 로직: 데이터가 완전히 비어있을 때
  if (!receivedItems && !selectedItems.length) {
    return (
      <div className="payment-container">
        <div
          className="payment-card-wrapper"
          style={{ justifyContent: "center" }}
        >
          <p>결제할 정보가 없습니다. 장바구니에서 항목을 선택해주세요.</p>
          <button className="btn1" onClick={() => navigate("/Cart")}>
            장바구니 가기
          </button>
        </div>
      </div>
    );
  }

  const selectedItems = [
    {
      id: 1,
      title: "사회성 길들이기 기초",
      trainer: "김지수 훈련사",
      day: "2026-05-26",
      location: "오늘의 훈련 내 훈련장",
      price: 150000,
    },
    {
      id: 2,
      title: "산책 매너 교육",
      trainer: "이민호 훈련사",
      day: "2026-05-25",
      location: "오늘의 훈련 내 훈련장",
      price: 120000,
    },
  ];

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="payment-container">
      <div className="payment-title">결제하기</div>

      <div className="payment-card-wrapper">
        {/* 왼쪽 */}
        <div className="left-container">
          {selectedItems.map((item) => (
            <div key={item.id} className="payment-item">
              <span className="info-label">훈련명</span>
              <span className="info-value">{item.title}</span>

              <span className="info-label">훈련사</span>
              <span className="info-value">{item.trainer}</span>

              <span className="info-label">일시</span>
              <span className="info-value">{item.day}</span>

              <span className="info-label">장소</span>
              <span className="info-value">{item.location}</span>

              <span className="info-label">예약 강아지</span>
              <select className="dog-select">
                <option>보리</option>
                <option>누리</option>
              </select>

              <div className="item-line"></div>
            </div>
          ))}
        </div>

        {/* 오른쪽 */}
        <div className="right-container">
          <div className="total-price-box">
            <p className="total-label">총 금액</p>
            <p className="total-price">{totalAmount.toLocaleString()}원</p>
          </div>
          <button className="btn1">결제 하기</button>
        </div>
      </div>
    </div>
  );
}

export default Payment;

// <select>
//   {dogs.map((dog) => (
//     <option key={dog}>{dog}</option>
//   ))}
// </select>
