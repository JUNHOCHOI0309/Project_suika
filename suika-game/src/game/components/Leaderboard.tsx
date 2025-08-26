import { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

interface ScoreEntry {
  _id?: string;
  sessionId: string;
  score: number;
  createdAt: string;
}

const adjectives = [
  '노래하는',
  '춤추는',
  '행복한',
  '용감한',
  '귀여운',
  '재빠른',
  '차분한',
  '반짝이는',
];
const verbs = [
  '웃는',
  '달리는',
  '날아가는',
  '응원하는',
  '도전하는',
  '빛나는',
  '모험하는',
  '집중하는',
];
const nouns = ['라이언', '무지', '어피치', '콘', '춘식이', '제이지', '튜브', '프로도'];

export function NicknameFrom(sessionId: string) {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = (hash << 5) - hash + sessionId.charCodeAt(i);
    hash |= 0;
  }

  const adj = adjectives[Math.abs(hash) % adjectives.length];
  const verb = verbs[Math.abs(Math.floor(hash / 97)) % verbs.length];
  const noun = nouns[Math.abs(Math.floor(hash / 997)) % nouns.length];

  return `${adj} ${verb} ${noun}`;
}

function medalFor(rank: number) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

export default function Leaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/scores/leaderboard`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ScoreEntry[] = await res.json();
        setScores(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('리더보드 불러오기 실패');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const decorated = useMemo(
    () =>
      scores.map((s, i) => ({
        ...s,
        __rank: i + 1,
        __nick: NicknameFrom(s.sessionId),
        __date: new Date(s.createdAt),
      })),
    [scores]
  );

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center bg-white rounded-2xl shadow">
        불러오는 중…
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center bg-white rounded-2xl shadow text-red-600">
        에러: {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-5">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">🏆</span>
          <h2 className="text-2xl font-extrabold text-gray-800">랭킹</h2>
        </div>

        {decorated.length === 0 ? (
          <div className="py-8 text-center text-gray-500">아직 점수가 없어요.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {decorated.map((row) => (
              <li key={row._id ?? row.sessionId + row.createdAt + row.score} className="py-3">
                <div className="flex items-center gap-3">
                  {/* 순위 배지 */}
                  <div
                    className={`shrink-0 w-10 h-10 grid place-items-center rounded-full text-sm font-bold
                    ${
                      row.__rank === 1
                        ? 'bg-yellow-100 text-yellow-700'
                        : row.__rank === 2
                        ? 'bg-gray-100 text-gray-700'
                        : row.__rank === 3
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {medalFor(row.__rank)}
                  </div>

                  {/* 닉네임 & 날짜 */}
                  <div className="flex-1 min-w-0 mt-4 mb-4">
                    <div className="text-base font-semibold text-gray-800 truncate">
                      {row.__nick}
                    </div>
                  </div>

                  {/* 점수 */}
                  <div className="shrink-0">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold">
                      {row.score.toLocaleString()}점
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 새로고침 버튼 (옵션) */}
      <div className="text-center mt-3">
        <button
          className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700"
          onClick={() => window.location.reload()}
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
