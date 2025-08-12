import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MatterEngine from './game/MatterEngine';
import Leaderboard from './game/components/Leaderboard';

function Home() {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/game');
  };
    return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">🍉 수박 게임 시작!</h1>
      <p className="text-gray-700 mb-6">
        이곳은 수박 게임의 시작 화면입니다. 게임을 시작하려면 아래 버튼을 클릭하세요.
      </p>
      <button onClick={startGame} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
        게임 시작
      </button>
    </div>
  );
}


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<MatterEngine />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
