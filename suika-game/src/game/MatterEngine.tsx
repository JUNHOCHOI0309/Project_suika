import { useEffect, useRef, useState } from 'react';
import React from 'react';
import Matter from 'matter-js';
import { fruitRadiusMap, getRandomFruitID } from './radiusMap';
import GameOverOverlay from './components/GameOverOverlay';
import dropSnd from '../assets/sounds/drop_sound.mp3';
import mergeSnd from '../assets/sounds/merged_sound.mp3';

//const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function MatterEngine() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const worldRef = useRef<Matter.World | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const dropPoolRef = useRef<HTMLAudioElement[]>([]);
  const mergePoolRef = useRef<HTMLAudioElement[]>([]);
  const [score, setScore] = useState(0);
  const [nextFruitID, setNextFruitID] = useState<number>(() => getRandomFruitID());
  const [isInputLocked, setIsInputLocked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const audioUnlokedRef = useRef(false);
  const sentRef = useRef(false);

  const fruitsRef = useRef<Set<Matter.Body>>(new Set()); // 과일을 저장할 Set
  const deathCheckTimeout = useRef<NodeJS.Timeout | null>(null);
  const fruitImages: Record<number, HTMLImageElement> = {};

  for( const [id, data] of Object.entries(fruitRadiusMap)){
    const img = new Image();
    img.src = data.image;
    fruitImages[parseInt(id)] = img;
  }

  useEffect(() => {
    //물리 엔진 생성
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const world = engine.world;
    worldRef.current = engine.world;
    dropPoolRef.current = createAudioPool(dropSnd, 4, 0.7);
    mergePoolRef.current = createAudioPool(mergeSnd,4, 0.8);

    //렌더링 설정
    const render = Matter.Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: 400,
        height: 600,
        wireframes: false,
        background: '#d2f8d2',
      },
    });

    //벽 좌우
    const wallLeft = Matter.Bodies.rectangle(-10, 300, 20, 600, {
      isStatic: true,
      render: {
        visible: false,
      },
    });
    const wallRight = Matter.Bodies.rectangle(410, 300, 20, 600, {
      isStatic: true,
      render: {
        visible: false,
      },
    });

    //바닥 생성
    const ground = Matter.Bodies.rectangle(200, 590, 400, 20, {
      isStatic: true,
      render: {
        fillStyle: '#222',
      },
    });

    //센서 생성
    const deadline = Matter.Bodies.rectangle(200, 20, 400, 2, {
      isStatic: true,
      isSensor: true, // 센서로 설정하여 충돌 감지
      render: {
        fillStyle: 'orange',
      },
    });

    Matter.World.add(world, [wallLeft, wallRight, ground, deadline]);

    //과일 랜더링 후처리
    Matter.Events.on(render, 'afterRender', () =>{
      const context = render.context;

      fruitsRef.current.forEach(fruit =>{
        const pos = fruit.position;
        const radius = fruit.circleRadius || 0;

        const idMatch = fruit.label.match(/^fruit-(\d+)$/);
        if(!idMatch) return;
        const fruitID = parseInt(idMatch[1], 10);
        const fruitData = fruitRadiusMap[fruitID];
        if(!fruitData) return;

        context.save();
        context.globalAlpha = 1;
        context.beginPath();
        context.arc(pos.x, pos.y, radius, 0, 2*Math.PI);
        context.fillStyle = fruitData.backgroundcolor;
        context.fill();
        context.restore();

        const img = fruitImages[fruitID];
        if(img.complete) {
          context.save();
          context.translate(pos.x,pos.y);
          context.rotate(fruit.angle);
          context.drawImage(img, -radius, -radius, radius*2 , radius*2);
          context.restore();
        }
        context.lineWidth = 1;
        context.strokeStyle = '#555';
        context.beginPath();
        context.arc(pos.x, pos.y, radius, 0, 2*Math.PI);
        context.stroke();
      });
    });

    //과일 병합 로직
    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;

      for (const pair of pairs) {
        const { bodyA, bodyB } = pair;

        const idA = parseFruitID(bodyA.label);
        const idB = parseFruitID(bodyB.label);

        if (idA && idB && idA === idB && idA < 11) {
          const nextID = idA + 1;
          const newRadius = fruitRadiusMap[nextID].radius;

          const newX = (bodyA.position.x + bodyB.position.x) / 2;
          const newY = (bodyA.position.y + bodyB.position.y) / 2;

          Matter.World.remove(world, bodyA);
          Matter.World.remove(world, bodyB);
          fruitsRef.current.delete(bodyA);
          fruitsRef.current.delete(bodyB);

          const mergedFruit = Matter.Bodies.circle(newX, newY, newRadius, {
            restitution: 0.1,
            density: 0.04,
            friction: 0.1,
            label: `fruit-${nextID}`,
          });

          Matter.World.add(world, mergedFruit);
          fruitsRef.current.add(mergedFruit);
          setScore((prev) => prev + fruitRadiusMap[nextID].score);

          playFromPool(mergePoolRef.current);
        }
      }
    });

    //과일 ID 파싱 함수
    function parseFruitID(label: string): number | null {
      const match = label.match(/^fruit-(\d+)$/);
      return match ? parseInt(match[1], 10) : null;
    }

    //엔진과 렌더러 실행
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      dropPoolRef.current.forEach(a => a.pause());
      mergePoolRef.current.forEach(a => a.pause());
      dropPoolRef.current = [];
      mergePoolRef.current = [];
      const canvas = render.canvas;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  //점수 저장 분리
  useEffect(() =>{
    if (!isGameOver || sentRef.current) return;
    sentRef.current = true;

    const payload = { 
      sessionId: getOrCreateSessionID(),
      score,
    };

    //score 전달
    (async () => {
      try{
        console.log('[client] POST /api/scores:', payload);
        await fetch(`/api/scores`,{
          method:'POST',
          headers: { 'Content-Type': 'application/json'},
          body : JSON.stringify(payload),
        });
        //const data = await res.json().catch(() => ({}));
        //console.log('[client] response status:', res.status, data)
      } catch(e){
        console.error('[client] send score failed:', e);
      }
    })();
  },[isGameOver]);

  //세션 ID 생성
  function getOrCreateSessionID(){
    let id = localStorage.getItem('suika-session-id');
    if(!id){
      id = crypto.randomUUID();
      localStorage.setItem('suika-session-id', id);
    }
    return id;
  }

   //풀 생성 함수
  function createAudioPool(src: string, size=4, volume = 0.7){
    const pool: HTMLAudioElement[] = [];
    for(let i=0; i< size; i++){
      const a = new Audio(src);
      a.preload = 'auto';
      a.volume = volume;
      pool.push(a);
    }
    return pool;
  }

  //풀에서 하나 재생
  function playFromPool(pool: HTMLAudioElement[]){
    const a = pool.find(x => x.paused || x.ended);
    if(!a) return;
    try{
      a.currentTime = 0;
      void a.play();
    } catch { /* empty */ }
  }

  //과일 생성
  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!engineRef.current || !worldRef.current || isInputLocked || isGameOver) return;

    if(!audioUnlokedRef.current){
      audioUnlokedRef.current = true;
      [...dropPoolRef.current, ...mergePoolRef.current].forEach(a=>{
        a.muted = true;
        a.play().then(() =>{
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        }).catch(() => { /*무시 */});
      });
    }

    setIsInputLocked(true);

    const rect = sceneRef.current?.getBoundingClientRect();
    const clickX = e.clientX - (rect?.left || 0);

    const id = nextFruitID; // 현재 과일 ID 사용
    const radius = fruitRadiusMap[id].radius;

    const fruit = Matter.Bodies.circle(
      clickX, // 클릭한 x 위치
      0, // y 위치는 항상 0
      radius, // 반지름
      {
        restitution: 0.1, // 튕김 효과
        density: 0.04, // 밀도
        friction: 0.1, // 마찰
        label: `fruit-${id}`, // 라벨 추가
      }
    );

    Matter.World.add(worldRef.current, fruit);
    fruitsRef.current.add(fruit);

    playFromPool(dropPoolRef.current);

    setNextFruitID(getRandomFruitID());

    if(deathCheckTimeout.current) clearTimeout(deathCheckTimeout.current);
    deathCheckTimeout.current = setTimeout(() => {
      checkGameOver();
    }, 3000); // 1초 후에 게임 오버 체크

    setTimeout(() => {
      setIsInputLocked(false);
    }, 750); // 0.75초 후에 입력 잠금 해제
  };

  const checkGameOver = () => {
    if(!worldRef.current || isGameOver) return;
    const topThreshold = 20; // 바닥에서의 임계값
    const bodies = worldRef.current.bodies;
    for (const body of bodies) {
      if (body.label.startsWith('fruit-') && body.position.y - (body.circleRadius || 0) <= topThreshold) {
        setIsGameOver(true);
        return;
      }
    }
  }

  const resetGame = () => {
    if(!worldRef.current) return;

    const toRemove = worldRef.current.bodies.filter(body => body.label.startsWith('fruit-'));
    toRemove.forEach(body => Matter.World.remove(worldRef.current!, body));
    fruitsRef.current.clear();

    setScore(0);
    setNextFruitID(getRandomFruitID());
    setIsGameOver(false);
    setIsInputLocked(false);
    sentRef.current = false;
  };    

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
      <div
        ref={sceneRef}
        className="border border-black w-[92vw] max-w-[400px] aspect-[2/3] overflow-hidden rounded-md"
        style={{ width: 400, height: 600 }}
        //onClick={handleClick}
        onPointerDown={handlePointerDown}
      />
      <div className="text-center mt-4">
        <h2 className="text-xl font-bold">점수: {score}</h2>
        <div style={{ fontWeight: 'bold' }}>Next:</div>
        <div
          style={{
            width: 150,
            height: 150,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={fruitRadiusMap[nextFruitID].image}
            alt={`Fruit ${nextFruitID}`}
            style={{
              width: fruitRadiusMap[nextFruitID].radius * 2,
              height: fruitRadiusMap[nextFruitID].radius * 2,
              borderRadius: '50%',
              backgroundColor:fruitRadiusMap[nextFruitID].backgroundcolor,
              backgroundSize:'cover',
              backgroundPosition:'center',
            }}/>
        </div>
      </div>
      {isGameOver && (
        <GameOverOverlay
          score={score}
          onRestart={resetGame}
        />
      )}
    </div>
  );
}
