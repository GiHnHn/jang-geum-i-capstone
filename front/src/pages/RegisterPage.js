// pages/RegisterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";

const styles = {
  container: {
    textAlign: "center",
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  backButton: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#888",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    flex: "1",
    marginRight: "5px",
  },
  submitButton: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    flex: "1",
    marginLeft: "5px",
  },
  message: {
    marginTop: "10px",
    color: "red",
  },
};

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await registerUser(formData);

      if (response.status === 201) {
        alert("✅ 회원가입이 완료되었습니다!");
        navigate("/");
      } else {
        setMessage(response.data.error || "❌ 회원가입 실패");
      }
    } catch (error) {
      console.error("🚨 회원가입 요청 실패:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "❌ 서버 오류로 회원가입 실패");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>회원가입</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="사용자명"
          value={formData.username}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <div style={styles.buttonContainer}>
          <button type="button" onClick={() => navigate("/")} style={styles.backButton}>
            뒤로 가기
          </button>
          <button type="submit" style={styles.submitButton}>
            회원가입 완료
          </button>
        </div>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

export default RegisterPage;