import { useEffect, useState } from "react";
import "../../assets/css/cart.css";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import ModalOneBtn from "../../components/public/modalOneBtn";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [user, setUser] = useState(null);

  // 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const navigate = useNavigate();

  // 로그인 상태
  useEffect(() => {
    const loginUser = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => loginUser();
  }, []);

  // 장바구니 가져오기
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      const querySnapshot = await getDocs(
        query(collection(db, "carts"), where("uid", "==", user.uid)),
      );

      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCartItems(items);
    };

    fetchCart();
  }, [user]);

  // 단일 선택
  const handleSingleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  // 전체 선택
  const handleAllSelect = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((item) => item.id));
    }
  };

  // 단일 삭제
  const removeItem = async (id) => {
    try {
      await deleteDoc(doc(db, "carts", id));

      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));

      setModalMsg("훈련이 삭제되었습니다.");
      setIsModalOpen(true);
    } catch (error) {
      setModalMsg("삭제 실패");
      setIsModalOpen(true);
    }
  };

  // 전체 삭제
  const handleClearCart = async () => {
    await Promise.all(
      cartItems.map((item) => deleteDoc(doc(db, "carts", item.id))),
    );
    setCartItems([]);
    setSelectedIds([]);
  };

  // 선택된 항목
  const selectedItems = cartItems.filter((item) =>
    selectedIds.includes(item.id),
  );

  // ✅ 합계 계산 (문자열 → 숫자 변환)
  const totalAmount = selectedItems.reduce((sum, item) => {
    const price = Number(String(item.price).replace(/,/g, "")) || 0;
    return sum + price;
  }, 0);

  // 결제 이동
  const handleToPayment = () => {
    if (selectedItems.length === 0) {
      setModalMsg("선택된 항목이 없습니다.");
      setIsModalOpen(true);
      return;
    }

    navigate("/payment", {
      state: {
        selectedItems,
        // 👉 totalAmount는 넘겨도 되고 안 넘겨도 됨 (Payment에서 다시 계산함)
        // totalAmount,
      },
    });
  };

  // 로그인 안 했을 때
  if (!user) {
    return <div className="cart-container">로그인이 필요합니다.</div>;
  }

  return (
    <div className="cart-container">
      {/* 왼쪽 */}
      <div className="cart-left">
        <div className="cart-title">장바구니</div>

        <div className="cart-controls">
          <button className="btn1" onClick={handleAllSelect}>
            {selectedIds.length === cartItems.length && cartItems.length > 0
              ? "전체 해제"
              : "전체 선택"}
          </button>

          <button
            className="btn2"
            onClick={handleClearCart}
            disabled={cartItems.length === 0}
          >
            전체 삭제
          </button>
        </div>

        <div className="cart-list">
          {cartItems.map((item) => {
            const price = Number(String(item.price).replace(/,/g, "")) || 0;

            return (
              <div key={item.id} className="cart-item-card">
                <div className="item-info-group">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSingleSelect(item.id)}
                  />

                  <div className="item-details">
                    <p className="item-name">{item.trainTitle}</p>
                    <p className="item-trainer">{item.trainerName} 훈련사</p>
                    <p className="item-price">{price.toLocaleString()}원</p>
                  </div>
                </div>

                <div>
                  <button
                    className="btn-detail-view"
                    onClick={() => navigate(`/train/${item.trainId}`)}
                  >
                    상세보기
                  </button>

                  <button className="btn2" onClick={() => removeItem(item.id)}>
                    삭제
                  </button>
                </div>
              </div>
            );
          })}

          {cartItems.length === 0 && (
            <div className="empty-msg">담은 훈련이 없습니다.</div>
          )}
        </div>
      </div>

      {/* 오른쪽 */}
      <div className="cart-right">
        <div className="select-header">
          <span>선택한 훈련 수: {selectedIds.length}개</span>
        </div>

        <div className="select-list">
          {selectedItems.map((item) => {
            const price = Number(String(item.price).replace(/,/g, "")) || 0;

            return (
              <div key={item.id} className="select-item">
                <div>
                  <p className="select-item-name">{item.trainTitle}</p>
                  <p className="select-item-trainer">
                    {item.trainerName} 훈련사
                  </p>
                </div>

                <div>
                  <p className="select-item-price">
                    {price.toLocaleString()}원
                  </p>

                  <button
                    className="btn2"
                    onClick={() => handleSingleSelect(item.id)}
                  >
                    선택 해제
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="total-box">
          <span className="total-label">총 금액:</span>
          <span className="total-amount">{totalAmount.toLocaleString()}원</span>
        </div>

        <button className="btn1" onClick={handleToPayment}>
          결제 하기
        </button>
      </div>

      {/* 모달 */}
      <ModalOneBtn
        isOpen={isModalOpen}
        modalText={modalMsg}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Cart;
