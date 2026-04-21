import React, { useState } from 'react';
import '../../assets/css/adminSearchbar.css';
import searchIcon from '../../assets/img/reading-glasses.svg';

function SearchBar({
    showSearch = true,
    showDate = false,
    sortOptions = [],
    onChange
}) {
    const [sort, setSort] = useState(sortOptions[0]?.value || '');
    const [keyword, setKeyword] = useState('');
    const [date, setDate] = useState('');

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSort(value);
        onChange?.({ sort: value, keyword, date });
    };

    const handleSearch = () => {
        onChange?.({ sort, keyword, date });
    };

    const handleDateChange = (e) => {
        const value = e.target.value;
        setDate(value);
        onChange?.({ sort, keyword, date: value });
    };

    return (
        <div className="search-group">

            {/* 정렬 */}
            {sortOptions.length > 0 && (
                <select
                    className="filter-select"
                    value={sort}
                    onChange={handleSortChange}
                >
                    {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}

            {/* 날짜 필터*/}
            {showDate && (
                <input
                    type="date"
                    className="filter-select"
                    value={date}
                    onChange={handleDateChange}
                />
            )}

            {/* 검색 */}
            {showSearch && (
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="검색어 입력"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <div className="search-btn" onClick={handleSearch}>
                        <img
                            src={searchIcon}
                            alt="돋보기"
                        />
                    </div>
                </div>
            )}

        </div>
    );
}

export default SearchBar;