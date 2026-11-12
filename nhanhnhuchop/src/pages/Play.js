import { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Countdown from '../components/Countdown';
import QuestionCard from '../components/QuestionCard';
import TimeBar from '../components/TimeBar';
import ScorePanel from '../components/ScorePanel';
import PowerUps from '../components/PowerUps';
import { TIME_PER_QUESTION } from '../data';
import { calcPoints, calcTotal, getStars } from '../utils';

const TOTAL = 15;
const DEFAULT_TITLE = 'Nhanh như chớp';

const Game = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  // 15 câu chính thức theo thứ tự id (filter tạo mảng mới nên sort không đụng mảng gốc)
  const [list] = useState(() =>
    questions.filter((q) => !q.reserve).sort((a, b) => a.id - b.id)
  );

  const [status, setStatus] = useState('countdown'); // countdown | answering | revealed
  const [count, setCount] = useState(3);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [cursor, setCursor] = useState(0);
  const [lastGain, setLastGain] = useState(null);
  const [replacements, setReplacements] = useState({}); // { index: câu dự bị }
  const [used, setUsed] = useState({ swap: false, double: false, freeze: false });
  const [doubling, setDoubling] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const lockRef = useRef(false); // chống chọn 2 lần trong cùng một câu

  const question = replacements[index] || list[index];
  const score = calcTotal(answers);
  const correctCount = answers.filter((a) => a.correct).length;

  const finishQuestion = (chosenIdx) => {
    if (lockRef.current) return;
    lockRef.current = true;
    const correct = chosenIdx === question.answer;
    let points = correct ? calcPoints(question, timeLeft) : 0;
    if (correct && doubling) points *= 2;
    const record = {
      id: question.id,
      no: index + 1,
      chosen: chosenIdx,
      correct,
      answer: question.answer,
      timeLeft,
      points,
      swapped: replacements[index] ? question.id : null,
    };
    setAnswers((prev) => [...prev, record]);
    setChosen(chosenIdx);
    setLastGain(correct ? points : null);
    setStatus('revealed');
  };

  const nextQuestion = () => {
    lockRef.current = false;
    setIndex((i) => i + 1);
    setTimeLeft(TIME_PER_QUESTION);
    setChosen(null);
    setCursor(0);
    setLastGain(null);
    setDoubling(false);
    setFrozen(false);
    setStatus('answering');
  };

  // 1) Đếm ngược 3, 2, 1
  useEffect(() => {
    if (status !== 'countdown') return;
    const id = setTimeout(() => {
      if (count > 1) setCount(count - 1);
      else setStatus('answering');
    }, 1000);
    return () => clearTimeout(id);
  }, [status, count]);

  // 2) Đồng hồ 15 giây (chỉ chạy khi đang trả lời và chưa bị dừng)
  useEffect(() => {
    if (status !== 'answering' || frozen) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status, index, frozen, replacements]);

  // Hết giờ
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) finishQuestion(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, timeLeft]);

  // 3) Chờ 1,5 giây rồi sang câu tiếp / kết thúc
  useEffect(() => {
    if (status !== 'revealed') return;
    const id = setTimeout(() => {
      if (index < TOTAL - 1) {
        nextQuestion();
        return;
      }
      const total = calcTotal(answers);
      const correctNum = answers.filter((a) => a.correct).length;
      onFinish({
        name: playerName,
        score: total,
        correctCount: correctNum,
        stars: getStars(correctNum).stars,
      });
      navigate('/result', {
        replace: true,
        state: { name: playerName, answers, score: total, correctCount: correctNum },
      });
    }, 1500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // 4) Phím tắt
  useEffect(() => {
    const handleKey = (e) => {
      if (status !== 'answering') return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCursor((c) => (c % 2 === 1 ? c - 1 : c));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCursor((c) => (c % 2 === 0 ? c + 1 : c));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCursor((c) => (c >= 2 ? c - 2 : c));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCursor((c) => (c < 2 ? c + 2 : c));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        finishQuestion(cursor);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, cursor, timeLeft, index, doubling, replacements]);

  // 5) Tiêu đề tab
  useEffect(() => {
    document.title = `Câu ${index + 1}/${TOTAL} – đúng ${correctCount} câu`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [index, correctCount]);

  // Quyền trợ giúp
  const handleSwap = () => {
    const reserve = questions.find((q) => q.reserve && q.level === question.level);
    if (!reserve) return;
    setReplacements({ ...replacements, [index]: reserve });
    setTimeLeft(TIME_PER_QUESTION);
    setUsed({ ...used, swap: true });
  };
  const handleDouble = () => {
    setDoubling(true);
    setUsed({ ...used, double: true });
  };
  const handleFreeze = () => {
    setFrozen(true);
    setUsed({ ...used, freeze: true });
  };

  if (status === 'countdown') return <Countdown count={count} />;

  return (
    <div className="play">
      <QuestionCard
        k={index + 1}
        total={TOTAL}
        question={question}
        status={status}
        chosen={chosen}
        cursor={cursor}
        onChoose={(i) => status === 'answering' && finishQuestion(i)}
      />
      <TimeBar timeLeft={timeLeft} frozen={frozen} />
      <ScorePanel score={score} correctCount={correctCount} gain={lastGain} />
      <PowerUps
        used={used}
        doubling={doubling}
        canUse={status === 'answering'}
        onSwap={handleSwap}
        onDouble={handleDouble}
        onFreeze={handleFreeze}
      />
    </div>
  );
};

const Play = ({ questions, playerName, onFinish }) =>
  playerName.trim() === '' ? (
    <Navigate to="/" replace />
  ) : (
    <Game questions={questions} playerName={playerName} onFinish={onFinish} />
  );

export default Play;