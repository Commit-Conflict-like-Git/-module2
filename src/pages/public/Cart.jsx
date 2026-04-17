import React, { useState } from "react";
import "../../assets/css/cart.css";
import { useNavigate } from "react-router-dom";

function Cart() {
  // 구조 파악을 위한 더미 데이터
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "도심 속 사회성 길들이기",
      trainer: "박건우",
      price: 120000,
    },
    {
      id: 2,
      title: "완벽한 배변 훈련의 정석",
      trainer: "김혜윤",
      price: 95000,
    },
    {
      id: 3,
      title: "줄 당김 없는 평화로운 산책",
      trainer: "강민호",
      price: 110000,
    },
  ]);

  const navigate = useNavigate();

  // 총 금액 계산
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = () => {
    if (cartItems.length === 0) {
      alert("결제할 항목이 없습니다.");
      return;
    }

    // 결제 페이지로 이동
    navigate("/payment", {
      state: {
        selectedItems: cartItems,
        totalAmount: totalPrice,
      },
    });
  };
  return (
    <div className="cart-container">
      {/* <div className="cart-wrapper"> */}
      {/* 왼쪽: 장바구니 리스트 */}
      <div className="cart-left">
        <div className="cart-title">장바구니</div>
        <div className="cart-controls">
          <button className="btn1">전체 선택</button>
          <button className="btn2">전체 삭제</button>
        </div>

        <div className="cart-list">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-card">
              <div className="item-info-group">
                <input type="checkbox" className="item-checkbox" />
                <div className="item-details">
                  <p className="item-name">{item.title}</p>
                  <p className="item-trainer">{item.trainer} 훈련사</p>
                  <p className="item-price">
                    가격: {item.price.toLocaleString()} 원
                  </p>
                </div>
              </div>
              <button className="btn-detail-view">상세보기</button>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽: 선택 정보 및 결제 */}
      <div className="cart-right">
        <div className="select-header">
          <span>선택한 훈련 수: {cartItems.length}개</span>
          <button className="btn2">전체 삭제</button>
        </div>

        <div className="select-list">
          {cartItems.slice(0, 2).map((item) => (
            <div key={item.id} className="select-item">
              <div className="select-item-info">
                <p className="select-item-name">{item.title}</p>
                <p className="select-item-trainer">{item.trainer} 훈련사</p>
              </div>
              <div className="select-item-side">
                <p className="select-item-price">
                  {item.price.toLocaleString()}원
                </p>
                <button className="btn2">삭제하기</button>
              </div>
            </div>
          ))}
        </div>

        <div className="total-box">
          <span className="total-label">총 금액:</span>
          <span className="total-amount">305,000원</span>
        </div>

        <button className="btn1" onClick={handlePayment}>
          결제 하기
        </button>
      </div>
    </div>
  );
}

export default Cart;
