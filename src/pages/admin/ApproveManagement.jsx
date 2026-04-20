import React, { useEffect, useState } from 'react';
import List from '../../components/admin/List';
import downloadIcon from '../../assets/img/download.svg';

import { db } from '../../firebase/config.js';
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "firebase/firestore";

import { getStorage, ref, getDownloadURL } from "firebase/storage";
import SearchBar from '../../components/admin/Searchbar.jsx';
import "../../assets/css/adminSearchbar.css";

import ModalThreeBtn from '../../components/public/ModalThreeBtn';
import ModalTwoBtn from '../../components/public/modalTwoBtn';
import ModalOneBtn from '../../components/public/modalOneBtn';

function ApproveManagement() {

    const [approveData, setApproveData] = useState([]);
    const storage = getStorage();

    const [isActionModalOpen, setIsActionModalOpen] = useState(false);

    const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
    const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);

    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [resultMessage, setResultMessage] = useState("");

    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleDownload = async (fileName) => {
        try {
            const fileRef = ref(storage, `trainers/${fileName}`);
            const url = await getDownloadURL(fileRef);
            window.open(url, "_blank");
        } catch (error) {
            console.error("다운로드 실패:", error);
        }
    };

    const handleApprove = async (userId) => {
        const refDoc = doc(db, "users", userId, "trainer", "info_details");

        await updateDoc(refDoc, {
            approvalStatus: "approved",
        });

        setApproveData(prev => prev.filter(item => item.id !== userId));
    };

    const handleReject = async (userId) => {
        await deleteDoc(doc(db, "users", userId));

        setApproveData(prev => prev.filter(item => item.id !== userId));
    };

    const handleRowClick = (userId) => {
        setSelectedUserId(userId);
        setIsActionModalOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {

            const q = query(
                collection(db, "users"),
                where("role", "==", "trainer")
            );

            const snapshot = await getDocs(q);

            const results = [];

            for (const userDoc of snapshot.docs) {

                const user = userDoc.data();

                const infoRef = doc(
                    db,
                    "users",
                    userDoc.id,
                    "trainer",
                    "info_details"
                );

                const infoSnap = await getDoc(infoRef);

                if (!infoSnap.exists()) continue;

                const info = infoSnap.data();

                if (info.approvalStatus === "pending") {
                    results.push({
                        id: userDoc.id,
                        name: user.name,
                        phone: user.phoneNumber,
                        approvalStatus: info.approvalStatus,
                        file: info.certificationFile,
                    });
                }
            }

            setApproveData(results);
        };

        fetchData();
    }, []);

    const approveColumns = [
        { key: "index", label: "No." },
        { key: "name", label: "이름" },
        { key: "phone", label: "전화번호" },
        { key: "approvalStatus", label: "상태" },
        {
            key: "file",
            label: "증빙서류",
            render: (row) => (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(row.file);
                    }}
                    style={{ cursor: "pointer" }}
                >
                    <img src={downloadIcon} alt="download" />
                </div>
            ),
        },
    ];

    return (
        <>
            <SearchBar />

            <List
                data={approveData}
                columns={approveColumns}
                onRowClick={(row) => handleRowClick(row.id)}
            />

            <ModalThreeBtn
                isOpen={isActionModalOpen}
                modalText="훈련사의 상태를 다음과 같이 변경합니다."

                onApprove={() => {
                    setIsActionModalOpen(false);
                    setIsApproveConfirmOpen(true);
                }}

                onReject={() => {
                    setIsActionModalOpen(false);
                    setIsRejectConfirmOpen(true);
                }}

                onClose={() => setIsActionModalOpen(false)}
            />

            <ModalTwoBtn
                isOpen={isApproveConfirmOpen}
                modalText="승인하시겠습니까?"

                onConfirm={async () => {
                    setIsApproveConfirmOpen(false);

                    await handleApprove(selectedUserId);

                    setResultMessage("승인되었습니다.");
                    setIsResultModalOpen(true);
                }}

                onClose={() => setIsApproveConfirmOpen(false)}
            />

            <ModalTwoBtn
                isOpen={isRejectConfirmOpen}
                modalText="거절하시겠습니까?"

                onConfirm={async () => {
                    setIsRejectConfirmOpen(false);

                    await handleReject(selectedUserId);

                    setResultMessage("삭제되었습니다.");
                    setIsResultModalOpen(true);
                }}

                onClose={() => setIsRejectConfirmOpen(false)}
            />

            <ModalOneBtn
                isOpen={isResultModalOpen}
                modalText={resultMessage}
                onClose={() => setIsResultModalOpen(false)}
            />
        </>
    );
}

export default ApproveManagement;