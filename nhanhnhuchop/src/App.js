const BUILD_TAG = "nc-7438";
/* eslint-disable import/first */
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const HISTORY_KEY = 'ltw_chop_history';

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(loadHistory);

  // Mounting: gọi API, cleanup: hủy request
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        // dev server trả index.html (200) khi sai tên file -> không phải mảng
        if (!Array.isArray(res.data)) throw new Error('Dữ liệu không hợp lệ');
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  // Updating: lưu lịch sử mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addHistory = ({ name, score, correctCount, stars }) => {
    const record = {
      id: Date.now(),
      name,
      score,
      correctCount,
      stars,
      playedAt: new Date().toLocaleString('vi-VN'),
    };
    setHistory((prev) => [...prev, record]);
  };

  // Các trang cần dữ liệu câu hỏi thì qua "cổng" này
  const gate = (element) => {
    if (loading) return <p className="notice">Đang tải câu hỏi...</p>;
    if (error) return <p className="notice error">Không tải được câu hỏi</p>;
    return element;
  };

  return (
    <div className="app" data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Home
                playerName={playerName}
                setPlayerName={setPlayerName}
                history={history}
              />
            }
          />
          <Route
            path="play"
            element={gate(
              <Play
                questions={questions}
                playerName={playerName}
                onFinish={addHistory}
              />
            )}
          />
          <Route path="result" element={<Result />} />
          <Route
            path="history"
            element={<History history={history} setHistory={setHistory} />}
          />
          <Route
            path="questions"
            element={gate(<QuestionBank questions={questions} />)}
          />
          <Route
            path="questions/:id"
            element={gate(<QuestionDetail questions={questions} />)}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;