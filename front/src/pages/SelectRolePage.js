import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCharacter } from "../contexts/CharacterContext";

const NAME_MAP = {
  baek: "빽AI",
  seung: "3스타AI",
  jang: "장금이",
};

const IMG_MAP = {
  baek: "/images/baek.png",
  seung: "/images/seung.png",
  jang: "/images/jang.png",
};

export default function SelectRolePage() {
  const navigate = useNavigate();
  const { character } = useCharacter();

  // ✅ 캐릭터 없을 경우 리디렉션
  useEffect(() => {
    if (!character) {
      navigate("/", { replace: true });
    }
  }, [character, navigate]);

  const displayName = NAME_MAP[character] || "AI";
  const avatarSrc = IMG_MAP[character] || "/character.png";

  const handleStartChat = () => {
    const sessionId = crypto.randomUUID(); // ✅ 세션 ID 생성
    navigate("/chat", { state: { sessionId } }); // ✅ 상태 전달
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <img
        src={avatarSrc}
        alt={displayName}
        style={{ width: "200px", borderRadius: "20px" }}
      />
      <h1 style={{ marginTop: "1rem", color: "#4CAF50" }}>
        {displayName}와 함께 무엇을 할까요?
      </h1>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={handleStartChat}
          style={{
            padding: "12px 24px",
            marginRight: "1rem",
            backgroundColor: "#fef08a",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          🗨️ 대화하기
        </button>

        <button
          onClick={() => navigate("/recipe-search")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#a7f3d0",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          🍳 요리하기
        </button>
      </div>
    </div>
  );
}
