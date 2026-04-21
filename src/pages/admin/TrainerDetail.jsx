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

import "../../assets/css/trainerDetail.css";

import List from '../../components/admin/List';
import downloadIcon from '../../assets/img/download.svg';

import { getStorage, ref, getDownloadURL } from "firebase/storage";

import ModalOneBtn from '../../components/public/modalOneBtn';
import ModalTwoBtn from '../../components/public/modalTwoBtn';

function TrainerDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [trainer, setTrainer] = useState(null);
    const [trainings, setTrainings] = useState([]);

    const storage = getStorage();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);

    const getStatusLabel = (status) => {
        if (status === "active") return "활성화";
        if (status === "inactive") return "비활성화";
        return "-";
    };

    const handleDownload = async (fileName) => {
        try {
            const fileRef = ref(storage, `trainers/${fileName}`);
            const url = await getDownloadURL(fileRef);
            window.open(url, "_blank");
        } catch (error) {
            console.error("다운로드 실패:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {

            const userRef = doc(db, "users", id);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return;

            const user = userSnap.data();

            const infoRef = doc(db, "users", id, "trainer", "info_details");
            const infoSnap = await getDoc(infoRef);
            const info = infoSnap.exists() ? infoSnap.data() : {};

            setTrainer({ ...user, ...info });

            const trainingIds = info.trainings || [];

            if (trainingIds.length > 0) {
                const q = query(
                    collection(db, "trainings"),
                    where("__name__", "in", trainingIds.slice(0, 10))
                );

                const snap = await getDocs(q);

                setTrainings(
                    snap.docs.map(doc => ({
                        id: doc.id,
                        trainerName: doc.data().trainerName,
                        trainTitle: doc.data().trainTitle,
                        date: doc.data().createdAt
                    }))
                );
            }
        };

        fetchData();
    }, [id]);

    const handleStatusChange = async () => {
        try {
            const newStatus =
                trainer.accountStatus === "active" ? "inactive" : "active";

            await updateDoc(doc(db, "users", id), {
                accountStatus: newStatus
            });

            setTrainer(prev => ({
                ...prev,
                accountStatus: newStatus
            }));

            setIsConfirmOpen(false);
            setIsResultOpen(true);

        } catch (error) {
            console.error(error);
        }
    };

    if (!trainer) return <div>로딩중...</div>;

    const formatDate = (timestamp) => {
        if (!timestamp) return "-";

        if (timestamp?.toDate) {
            const d = timestamp.toDate();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }

        if (typeof timestamp === "string") {
            return timestamp.split("T")[0];
        }

        return "-";
    };

    const trainColumns = [
        { key: "index", label: "No." },
        { key: "trainTitle", label: "훈련명" },
        {
            key: "date",
            label: "등록일",
            render: (row) => formatDate(row.date)
        }
    ];

    return (
        <div className="trainer-container">

            <div className="trainer-header">

                <h2>{trainer.name}</h2>

                <div className="trainer-header-btns">
                    <button
                        className='btn2'
                        onClick={() => setIsConfirmOpen(true)}
                    >
                        상태변경
                    </button>

                    <button
                        className='btn1'
                        onClick={() => navigate(-1)}
                    >
                        목록으로
                    </button>
                </div>

            </div>

            <div className="trainer-info">

                <div>
                    <p>이름: {trainer.name}</p>
                    <p>성별: {trainer.gender}</p>
                    <p>생년월일: {trainer.birth}</p>
                    <p>전화번호: {trainer.phoneNumber}</p>
                    <p>이메일: {trainer.email}</p>
                </div>

                <div>
                    <p>등록일: {formatDate(trainer.signDate)}</p>

                    <p>
                        증빙서류:
                        {trainer.certificationFile}
                        <img
                            src={downloadIcon}
                            alt="download"
                            onClick={() => handleDownload(trainer.certificationFile)}
                        />
                    </p>

                    <p>
                        훈련사 승인:
                        {trainer.approvalStatus === "approved" ? "승인됨" : "대기중"}
                    </p>

                    <p>
                        회원상태: {getStatusLabel(trainer.accountStatus)}
                    </p>
                </div>

            </div>

            <div className="trainer-training">

                <div className="trainer-title">
                    <h3>등록된 훈련</h3>
                </div>

                <List
                    data={trainings}
                    columns={trainColumns}
                    onRowClick={(row) => navigate(`/train/${row.id}`)}
                />

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

export default TrainerDetail;