import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import List from '../../components/admin/List';
import SearchBar from '../../components/admin/Searchbar.jsx';
import "../../assets/css/adminSearchbar.css";

import { db } from '../../firebase/config.js';
import { collection, getDocs } from "firebase/firestore";

function TrainManagement() {

    const navigate = useNavigate();

    const [trainData, setTrainData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const sortFieldMap = {
        name: "trainerName",
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
        let result = [...trainData];

        if (keyword) {
            result = result.filter((item) =>
                item.trainTitle?.includes(keyword)
            );
        }

        result = sortData(result, sort);

        setFilteredData(result);
    };

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                const snapshot = await getDocs(collection(db, "trainings"));

                const results = snapshot.docs.map((doc) => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        trainerName: data.trainerName,
                        trainTitle: data.trainTitle,
                        date: data.createdAt
                            ? data.createdAt.toDate?.().toISOString()
                            : null,
                    };
                });

                setTrainData(results);

                const sorted = sortData(results, sort);
                setFilteredData(sorted);

            } catch (error) {
                console.error("훈련 데이터 불러오기 실패:", error);
            }
        };

        fetchTrains();
    }, []);

    const trainColumns = [
        { key: "index", label: "No." },
        { key: "trainerName", label: "이름" },
        { key: "trainTitle", label: "훈련명" },
        {
            key: "date",
            label: "등록일",
            render: (row) =>
                row.date ? new Date(row.date).toLocaleDateString() : "-"
        },
    ];

    return (
        <>
            <div>
                <SearchBar
                    sortOptions={[
                        { value: "name", label: "이름순" },
                        { value: "newest", label: "최신순" },
                        { value: "oldest", label: "오래된순" }
                    ]}
                    onChange={handleSearchChange}
                />
            </div>

            <div>
                <List
                    data={filteredData}
                    columns={trainColumns}

                    onRowClick={(row) => navigate(`/train/${row.id}`)}
                />
            </div>
        </>
    );
}

export default TrainManagement;