// src/pages/CharacterSelectionPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacter } from '../contexts/CharacterContext';

const CHARACTERS = [
  {
    id: 'baek',
    name: '빽AI',
    intro: '"쉽고 맛있게! 현실 요리 마스터"',
    img: '/images/baek.png',
  },
  {
    id: 'seung',
    name: '3스타AI',
    intro: '"미슐랭 감성 그대로, 정확하게, 치밀하게"',
    img: '/images/seung.png',
  },
  {
    id: 'jang',
    name: '장금이',
    intro: '"정갈한 한식의 고수예요"',
    img: '/images/jang.png',
  },
];


export default function CharacterSelectionPage() {
  const { setCharacter } = useCharacter();
  const navigate = useNavigate();

  const handleClick = (id) => {
    setCharacter(id);
    navigate('/select-role');
  };

  return (
    <div className="relative min-h-screen bg-black px-4">
      <h1 style={{marginTop: '6rem', fontSize: '2rem', color: '#28a745', textAlign: 'center'}}>
        나만의 요리 선생님을 선택해보세요
      </h1>

      <div className="profile-container">
        {CHARACTERS.map((c) => (
          <div key={c.id} className="profile-card">
            <button
              onClick={() => handleClick(c.id)}
              className="avatar-button"
            >
              <img
                src={c.img}
                alt={c.name}
                className="avatar-small"
              />
            </button>
            <span className="profile-name">{c.name}</span>
            <p className="profile-intro">{c.intro}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
