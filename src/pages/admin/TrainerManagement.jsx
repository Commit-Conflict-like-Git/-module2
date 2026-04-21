import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import List from '../../components/admin/List';
import SearchBar from '../../components/admin/Searchbar.jsx';
import "../../assets/css/adminSearchbar.css";
import "../../assets/css/button.css";

import { db } from '../../firebase/config.js';
import { collection, getDocs } from "firebase/firestore";

function TrainerManagement() {

    const navigate = useNavigate();

    const [trainerData, setTrainerData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const getStatusLabel = (status) => {
        if (status === "active") return "활성화";
        if (status === "inactive") return "비활성화";
        return "활성화";
    };

    const sortFieldMap = {
        name: "name",
        newest: "date",
        oldest: "date",
    };

    const [sort, setSort] = useState("newest");

    const sortData = (data, sort) => {
        const field = sortFieldMap[sort];
        if (!field) return data;

        return [...data].sort((a, b) => {

            if (sort === "name") {
                return (a[field] || "").localeCompare(b[field] || "");
            }

            const dateA = new Date(a[field]);
            const dateB = new Date(b[field]);

            if (sort === "newest") return dateB - dateA;
            if (sort === "oldest") return dateA - dateB;

            return 0;
        });
    };

    const handleSearchChange = ({ sort, keyword }) => {
        let result = [...trainerData];

        if (keyword) {
            result = result.filter((item) =>
                item.name?.includes(keyword)
            );
        }

        result = sortData(result, sort);
        setFilteredData(result);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const snapshot = await getDocs(collection(db, "users"));

            const results = snapshot.docs
                .map(doc => {
                    const data = doc.data();
                    if (data.role !== "trainer") return null;

                    return {
                        id: doc.id,
                        name: data.name,
                        phone: data.phoneNumber,
                        date: data.signDate
                            ? data.signDate
                            : null,
                        state: data.accountStatus,
                    };
                })
                .filter(Boolean);

            setTrainerData(results);

            const sorted = sortData(results, sort);
            setFilteredData(sorted);
        };

        fetchUsers();
    }, []);

    const trainerColumns = [
        { key: "index", label: "No." },
        { key: "name", label: "이름" },
        { key: "phone", label: "전화번호" },
        {
            key: "date",
            label: "가입일",
            render: (row) =>
                row.date ? new Date(row.date).toLocaleDateString() : "-"
        },
        {
            key: "state",
            label: "상태",
            render: (row) => getStatusLabel(row.state)
        },
    ];

    return (
        <>
            <SearchBar
                sortOptions={[
                    { value: "name", label: "이름순" },
                    { value: "newest", label: "최근 가입일 순" },
                    { value: "oldest", label: "가입일 순" }
                ]}
                onChange={handleSearchChange}
            />

            <List
                data={filteredData}
                columns={trainerColumns}
                onRowClick={(row) => navigate(`/trainer/${row.id}`)}
            />
        </>
    );
}

export default TrainerManagement;