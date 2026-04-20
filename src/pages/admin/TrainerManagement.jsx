import React, { useEffect, useState } from 'react';
import List from '../../components/admin/List';
import { db } from '../../firebase/config.js';
import {
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";
import SearchBar from '../../components/admin/Searchbar.jsx';
import "../../assets/css/adminSearchbar.css";

function TrainerManagement() {

    const [trainerData, setTrainerData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const sortFieldMap = {
        name: "name",
        newest: "date",
        oldest: "date",
    };

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
            try {
                const q = query(
                    collection(db, "users"),
                    where("role", "==", "trainer")
                );

                const snapshot = await getDocs(q);

                const results = snapshot.docs.map((doc) => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        name: data.name,
                        phone: data.phoneNumber,
                        date: data.createdAt
                            ? data.createdAt.toDate().toISOString()
                            : null,
                        state: data.accountStatus,
                    };
                });

                setTrainerData(results);
                setFilteredData(results);

            } catch (error) {
                console.error("trainer 불러오기 실패:", error);
            }
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
        { key: "state", label: "상태" },
    ];

    return (
        <>
            <div>
                <SearchBar
                    sortOptions={[
                        { value: "name", label: "이름순" },
                        { value: "newest", label: "최근 가입일 순" },
                        { value: "oldest", label: "가입일 순" }
                    ]}
                    onChange={handleSearchChange}
                />
            </div>

            <div>
                <List
                    data={filteredData}
                    columns={trainerColumns}
                />
            </div>
        </>
    );
}

export default TrainerManagement;