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
    getDoc
} from "firebase/firestore";

import { getStorage, ref, getDownloadURL } from "firebase/storage";
import SearchBar from '../../components/admin/Searchbar.jsx';
import "../../assets/css/adminSearchbar.css";

function ApproveManagement() {
    const [approveData, setApproveData] = useState([]);

    const storage = getStorage();

    // 파일 다운로드 함수
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
                <img
                    src={downloadIcon}
                    alt="download"
                    className="download-icon"
                    onClick={() => handleDownload(row.file)}
                />
            ),
        },
    ];

    return (
        <>
            <div>
                <SearchBar />
            </div>
            <div>
                <List data={approveData} columns={approveColumns} />
            </div>
        </>
    );
}

export default ApproveManagement;