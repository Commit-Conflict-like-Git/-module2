import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import { db } from '../../firebase/config.js';
import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    updateDoc
} from "firebase/firestore";

import "../../assets/css/ownerDetail.css";

import ModalOneBtn from '../../components/public/modalOneBtn';
import ModalTwoBtn from '../../components/public/modalTwoBtn';

function OwnerDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [owner, setOwner] = useState(null);
    const [dogs, setDogs] = useState([]);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);

    const getStatusLabel = (status) => {
        if (status === "active") return "활성화";
        if (status === "inactive") return "비활성화";
        return "-";
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "-";

        if (timestamp?.toDate) {
            const d = timestamp.toDate();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }

        return "-";
    };

    useEffect(() => {
        const fetchData = async () => {

            const userRef = doc(db, "users", id);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return;

            const user = userSnap.data();

            const infoRef = doc(db, "users", id, "owner", "info-details");
            const infoSnap = await getDoc(infoRef);
            const info = infoSnap.exists() ? infoSnap.data() : {};

            setOwner({ ...user, ...info });

            const q = query(
                collection(db, "dogs"),
                where("userId", "==", id)
            );

            const snap = await getDocs(q);

            setDogs(snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            })));
        };

        fetchData();
    }, [id]);

    const handleStatusChange = async () => {
        if (!owner) return;

        const newStatus =
            owner.accountStatus === "active" ? "inactive" : "active";

        await updateDoc(doc(db, "users", id), {
            accountStatus: newStatus
        });

        setOwner(prev => ({
            ...prev,
            accountStatus: newStatus
        }));

        setIsConfirmOpen(false);
        setIsResultOpen(true);
    };

    if (!owner) return <div>로딩중...</div>;

    return (
        <div className="owner-container">

            <div className="owner-header">

                <h2>{owner.name}</h2>

                <div className="owner-header-btns">
                    <button
                        className="btn2"
                        onClick={() => setIsConfirmOpen(true)}
                    >
                        상태변경
                    </button>

                    <button
                        className="btn1"
                        onClick={() => navigate(-1)}
                    >
                        목록으로
                    </button>
                </div>

            </div>

            <div className="owner-info">

                <div>
                    <p>이름: {owner.name}</p>
                    <p>성별: {owner.gender === "male" ? "남성" : "여성"}</p>
                    <p>생년월일: {owner.birth}</p>
                </div>

                <div>
                    <p>전화번호: {owner.phoneNumber}</p>
                    <p>이메일: {owner.email}</p>
                    <p>등록일: {formatDate(owner.createdAt || owner.signDate)}</p>
                    <p>회원상태: {getStatusLabel(owner.accountStatus)}</p>
                </div>

            </div>

            <div className="dog-section">

                <div className="dog-title">

                    <h3>등록된 반려견</h3>

                    <span
                        className="dog-more"
                        onClick={() => navigate(`/owner/${id}/dogs`)}
                    >
                        더보기
                    </span>

                </div>

                <div className="dog-list">

                    {dogs.slice(0, 2).map(dog => (
                        <div className="owner-dog-card" key={dog.id}>

                            <img src={dog.photo} alt="dog" />

                            <div className="dog-info">
                                <p>이름: {dog.name}</p>
                                <p>생년월일: {dog.birth}</p>
                                <p>성별: {dog.gender === "male" ? "수컷" : "암컷"}</p>
                                <p>견종: {dog.breed}</p>
                                <p>몸무게: {dog.weight}kg</p>
                            </div>

                        </div>
                    ))}

                </div>

            </div>

            <ModalTwoBtn
                isOpen={isConfirmOpen}
                modalText="회원 상태를 변경하시겠습니까?"
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleStatusChange}
            />

            <ModalOneBtn
                isOpen={isResultOpen}
                modalText="회원 상태가 변경되었습니다."
                onClose={() => setIsResultOpen(false)}
            />

        </div>
    );
}

export default OwnerDetail;