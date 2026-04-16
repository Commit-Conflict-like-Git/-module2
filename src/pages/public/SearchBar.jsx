import React from "react";

function SearchBar() {
  return (
    <div className="search-group">
      <select className="filter-select">
        <option value="latest">최신순</option>
        <option value="popular">인기순</option>
      </select>

      <div className="search-box">
        <input type="text" placeholder="검색어를 입력하세요" />
        <div className="search-btn">
          <img src="src/assets/img/reading-glasses.svg" alt="돋보기" />
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
