import { starString } from '../utils';

const History = ({ history, setHistory }) => {
  const sorted = [...history].sort(
    (a, b) => b.score - a.score || b.correctCount - a.correctCount
  );

  const count = history.length;
  const totalScore = history.reduce((sum, h) => sum + h.score, 0);
  const totalCorrect = history.reduce((sum, h) => sum + h.correctCount, 0);
  const avg = count ? Math.round(totalScore / count) : 0;
  const rate = count ? Math.round((totalCorrect / (15 * count)) * 100) : 0;

  const handleDelete = (id) => setHistory((prev) => prev.filter((h) => h.id !== id));

  return (
    <div>
      <h2>Lịch sử các lượt chơi</h2>
      {count === 0 ? (
        <p>Chưa có lượt chơi nào.</p>
      ) : (
        <>
          <p>{`Số lượt chơi: ${count}`}</p>
          <p>{`Điểm trung bình: ${avg}`}</p>
          <p>{`Tỉ lệ trả lời đúng: ${rate}%`}</p>
          <table className="table">
            <thead>
              <tr>
                <th>Người chơi</th><th>Số câu đúng</th><th>Xếp loại</th>
                <th>Điểm</th><th>Thời gian</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((h) => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.correctCount}</td>
                  <td className="stars">{starString(h.stars)}</td>
                  <td>{h.score}</td>
                  <td>{h.playedAt}</td>
                  <td><button onClick={() => handleDelete(h.id)}>Xóa</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setHistory([])}>Xóa lịch sử</button>
        </>
      )}
    </div>
  );
};

export default History;