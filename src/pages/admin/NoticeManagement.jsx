import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import List from '../../components/admin/List';
import SearchBar from '../../components/admin/Searchbar.jsx';
import "../../assets/css/adminSearchbar.css";

import { db } from '../../firebase/config.js';
import { collection, getDocs } from "firebase/firestore";

function NoticeManagement() {

    const navigate = useNavigate();

    const [noticeData, setNoticeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const sortFieldMap = {
        latest: "date",
        oldest: "date",
    };

    const [sort, setSort] = useState("latest");

    const sortData = (data, sort) => {
        const field = sortFieldMap[sort];
        if (!field) return data;

        return [...data].sort((a, b) => {
            const dateA = new Date(a[field]);
            const dateB = new Date(b[field]);

            if (sort === "latest") return dateB - dateA;
            if (sort === "oldest") return dateA - dateB;

            return 0;
        });
    };

    const handleSearchChange = ({ sort, keyword }) => {
        let result = [...noticeData];

        if (keyword) {
            result = result.filter((item) =>
                item.title?.includes(keyword)
            );
        }

        result = sortData(result, sort);

        setFilteredData(result);
    };

    useEffect(() => {
        const fetchNotices = async () => {
            const snapshot = await getDocs(collection(db, "notices"));

            const results = snapshot.docs.map((doc) => {
                const data = doc.data();

                return {
                    id: doc.id,
                    title: data.noticeTitle,
                    content: data.noticeContent,
                    uid: data.uid,
                    date: data.uploadDate
                        ? formatDate(data.uploadDate)
                        : null,
                };
            });

            setNoticeData(results);

            const sorted = sortData(results, sort);
            setFilteredData(sorted);
        };

        fetchNotices();
    }, []);

    const formatDate = (timestamp) => {
        if (timestamp?.toDate) {
            const date = timestamp.toDate();
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        }
        return timestamp;
    };

    const noticeColumns = [
        { key: "index", label: "No." },
        { key: "title", label: "제목" },
        { key: "date", label: "작성일" }
    ];

    return (
        <>
            <div className="notice-toolbar">

                <SearchBar
                    sortOptions={[
                        { value: "latest", label: "최신순" },
                        { value: "oldest", label: "오래된순" }
                    ]}
                    onChange={handleSearchChange}
                />

                <button className="btn1" onClick={() => navigate("/admin/notice/upload")}>
                    작성하기
                </button>

            </div>

            <List
                data={filteredData}
                columns={noticeColumns}
                onRowClick={(row) => navigate(`/admin/notice/${row.id}`)}
            />
        </>
    );
}

export default NoticeManagement;