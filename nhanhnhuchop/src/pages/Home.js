import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();

  const best = history.reduce(
    (top, h) => (top === null || h.score > top.score ? h : top),
    null
  );

  return (
    <div>
      <h1>Nhanh như chớp</h1>
      <ul className="rules">
        <li>15 câu hỏi về HTML, CSS, JavaScript và React, mỗi câu 15 giây.</li>
        <li>Trả lời sai hoặc hết giờ không bị loại, chỉ được 0 điểm cho câu đó.</li>
        <li>Trả lời đúng: điểm theo mức độ (Dễ 50, Trung bình 100, Khó 150) + 10 điểm cho mỗi giây còn lại.</li>
        <li>Có 3 quyền trợ giúp, mỗi quyền dùng một lần: Đổi câu hỏi, Nhân đôi, Dừng giờ.</li>
        <li>Phím tắt: các phím mũi tên để di chuyển, Enter để chọn.</li>
      </ul>
      {best && <p className="record">{`Kỷ lục: ${best.score} điểm – ${best.name}`}</p>}
      <div className="start-form">
        <label>
          Tên người chơi:{' '}
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nhập tên của bạn"
          />
        </label>
        <button
          className="btn-primary"
          disabled={playerName.trim() === ''}
          onClick={() => navigate('/play')}
        >
          Bắt đầu
        </button>
      </div>
    </div>
  );
};

export default Home;