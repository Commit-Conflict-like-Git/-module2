import React, { useEffect, useState } from 'react';
import List from '../../components/admin/List';
import SearchBar from '../../components/admin/Searchbar.jsx';
import "../../assets/css/adminSearchbar.css";

import { db } from '../../firebase/config.js';
import {
    collection,
    getDocs
} from "firebase/firestore";

function PaymentList() {

    const paymentColumns = [
        { key: "index", label: "No." },
        { key: "name", label: "이름" },
        { key: "price", label: "금액" },
        { key: "date", label: "결제일" },
        { key: "state", label: "결제상태" },
    ];

    const [paymentData, setPaymentData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const snapshot = await getDocs(collection(db, "payments"));

                const results = snapshot.docs.map((doc) => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        name: data.trainerName,
                        price: data.price,
                        date: data.date,
                        state: "완료",
                    };
                });

                setPaymentData(results);

                const sorted = [...results].sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                });

                setFilteredData(sorted);

            } catch (error) {
                console.error("결제 데이터 불러오기 실패:", error);
            }
        };

        fetchPayments();
    }, []);


    const handleFilter = ({ date, keyword }) => {
        let result = [...paymentData];

        if (date) {
            result = result.filter((item) => item.date === date);
        }

        if (keyword) {
            result = result.filter((item) =>
                item.name?.includes(keyword)
            );
        }

        setFilteredData(result);
    };

    return (
        <>
            <div>
                <SearchBar
                    showSearch={true}
                    showDate={true}
                    onChange={handleFilter}
                />
            </div>

            <div>
                <List
                    data={filteredData}
                    columns={paymentColumns}
                />
            </div>
        </>
    );
}

export default PaymentList;