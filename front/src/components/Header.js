// src/components/Header.js
import { useNavigate, Link } from 'react-router-dom';
import { useCharacter } from '../contexts/CharacterContext';
import  { useState } from 'react';
import axios from 'axios';
import '../styles.css';


const meta = {
  baek:  { name: '빽AI',   img: '/images/baek.png'   },
  seung: { name: '3스타AI', img: '/images/seung.png' },
  jang:  { name: '장금이',   img: '/images/jang.png'  },
};

const BACKEND_API_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:5000");

export default function Header({ user, setUser }) {
  const { character } = useCharacter();
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  if (!character) return null;

  const { name, img } = meta[character];

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_API_URL}/api/users/logout`, {}, { withCredentials: true });
      localStorage.removeItem("username");
      setUser?.(null);
      setIsSidebarOpen(false);
      alert("✅ 로그아웃 되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("🚨 로그아웃 실패:", error);
    }
  };
  const fetchSearchHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/api/recipes/search-history`, { withCredentials: true });
      if (response.data?.history) setSearchHistory(response.data.history);
    } catch (error) {
      console.error("🚨 검색 기록 불러오기 실패:", error);
    }
  };

  

  

   // ✅ 검색 기록 버튼 클릭 시 조회
   const handleShowSearchHistory = () => {
    fetchSearchHistory();
  };

  
  return (
    <header className="custom-header">
      <div className="header-inner">
      {/* 우측: 선택된 캐릭터 프로필 */}
        <div className="left">
          <img src={img} alt={name} className="avatar" />
          <span className="name">{name}</span>
        </div>

        {/* ✅ 사용자명이 있으면 우측 상단에 표시 */}
        <div className="right">
          {user ? (
            <>
              <span className="username" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {user}님
              </span>
              <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-btn">로그인</Link>
              <Link to="/register" className="auth-btn">회원가입</Link>
            </>
          )}
        </div>
      </div>

        {/* ✅ 사이드바 (우측에서 슬라이드) */}
        <div
          style={{
            position: "fixed",
            top: 0,
            right: isSidebarOpen ? "0px" : "-300px", // 🔥 열릴 때 0px, 닫힐 때 -300px
            width: "250px",
            height: "100vh",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "right 0.3s ease-in-out",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* ❌ 사이드바 닫기 버튼 */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              left: "15px",
              fontSize: "1.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888",
            }}
          >
            ❌
          </button>

          <h2 style={{ color: "#4CAF50" }}>👤 사용자 정보</h2>
          <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{user}</p>

          <button
            onClick={handleShowSearchHistory}
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            📜 이전 레시피 조회
          </button>

          {/* 🔥 🔥 🔥 검색 기록 리스트 (스크롤 추가됨) */}
          <div
            style={{
              flex: 1, 
              overflowY: "auto",  // ✅ 스크롤 가능하도록 설정
              overflowX: "hidden",
              maxHeight: "60vh",  // ✅ 검색 기록이 많으면 70% 높이까지만 표시
              width: "100%", 
              paddingRight: "5px", // ✅ 스크롤 바와 내용이 겹치지 않도록 여백 추가
              marginTop: "10px",
            }}
          >
            <ul style={{ width: "100%", padding: "10px", listStyle: "none" }}>
              {searchHistory.length > 0 ? (
                searchHistory.map((entry, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      cursor: "pointer",
                      color: "#333",
                      whiteSpace: "nowrap", // ✅ 한 줄로 유지
                      overflow: "hidden",
                      textOverflow: "ellipsis", // ✅ 너무 길면 ...으로 표시
                    }}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {entry.query} - {entry.recipe.dish}
                  </li>
                ))
              ) : (
                <p style={{ color: "#666", marginTop: "10px" }}>이전 검색 기록이 없습니다.</p>
              )}
            </ul>
          </div>

          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 15px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            로그아웃
          </button>
        </div>
    </header>
  );
}
