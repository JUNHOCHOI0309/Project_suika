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
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(0,0,0,0.35)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',        
      }}
    >
      <div style={{
        backgroundColor: '#d2f8d2',
        borderRadius: '1.5rem',
        boxShadow : '0 5px 15px rgba(0,0,0,0.2)',
        width: '92vw',
        maxWidth: '640px',
        maxHeight: '80vh',
        overflow: 'hidden',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem',
      }}>
        
        {showLeaderboard ? (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <Leaderboard />
            <button
              onClick={() => setShowLeaderboard(false)}
              style={{
                marginTop: '1rem',
                backgroundColor: '#cccccc',
                border: 'none',
                borderRadius: '0.875rem',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>게임 오버</h2>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>점수</h2>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{score}</div>
            <button
              onClick={onRestart}
              style={{
                backgroundColor: '#e0e0e0',
                border: 'none',
                borderRadius: '1.25rem',
                padding: '0.75rem 1rem',
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
    </div>
  );
}
