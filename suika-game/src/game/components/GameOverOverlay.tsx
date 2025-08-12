import { useState } from 'react';
import tropy from '../../assets/trophy.png';
import Leaderboard from './Leaderboard';

type GameOverOverlayProps = {
  score: number;
  onRestart: () => void;
};

export default function GameOverOverlay({ score, onRestart }: GameOverOverlayProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#d2f8d2',
        borderRadius: '2rem',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        padding: '2rem',
        width: '50vw',
        maxWidth: '640px',
        height: 'auto',
        minHeight: '400px',
        textAlign: 'center',
        zIndex: 1000,
      }}
    >
      {showLeaderboard ? (
        <div style={{ maxWidth: '600px', maxHeight: '400px', overflowY: 'auto' }}>
          <Leaderboard />
          <button
            onClick={() => setShowLeaderboard(false)}
            style={{
              marginTop: '1.5rem',
              backgroundColor: '#ccc',
              border: 'none',
              borderRadius: '1rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            닫기
          </button>
        </div>
      ) : (
        <>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>게임 오버</h2>

          <h2 style={{ fontSize: '2rem', marginBottom: '4rem' }}>점수</h2>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '6rem' }}>{score}</div>
          <button
            onClick={onRestart}
            style={{
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '2rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '1rem',
              boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            다시 시작
          </button>
          <div
            style={{ position: 'absolute', bottom: '3rem', right: '3rem', cursor: 'pointer' }}
            onClick={() => setShowLeaderboard(true)}
            title="랭킹으로 이동"
          >
            <img src={tropy} alt="trophy" width={40} />
          </div>
        </>
      )}
    </div>
  );
}
