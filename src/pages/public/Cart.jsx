import { useEffect, useState } from "react";
import "../../assets/css/cart.css";
import { collection, deleteDoc, doc, getDocs, where } from "firebase/firestore";
import { db } from "../../firebase/config";

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

  // 로그인 한 유저 (예: auth.currentUser.uid)
  const userUid = "user_uid_1";

  // 1. Firebase에서 내 장바구니 데이터만 가져오기
  useEffect(() => {
    const fetchCart = async () => {
      const q = query(collection(db, "carts"), where("uid", "==", userUid));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    };
    fetchCart();
  }, [userUid]);

  // 2. 총 금액 계산 (데이터 구조의 price 기준)
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0,
  );

  // 3. 결제 페이지로 이동
  const handleToPayment = () => {
    if (cartItems.length === 0) {
      alert("결제할 항목이 없습니다.");
      return;
    }
    navigate("/payment", {
      state: {
        selectedItems: cartItems,
        totalAmount: totalAmount,
      },
    });
  };

  // 4. 삭제
  const removeItem = async (id) => {
    await deleteDoc(doc(db, "carts", id));
    setCartItems((prev) => prev.filter((item) => item.id !== id));
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
