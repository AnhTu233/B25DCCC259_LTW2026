import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [filter, setFilter] = useState('all'); // all | official | reserve
  const [sort, setSort] = useState('id'); // id | asc | desc
  const [keyword, setKeyword] = useState('');

  const handleKeywordShift = (e) => setKeyword(e.target.value);

  const officialCount = questions.filter((q) => !q.reserve).length;
  const reserveCount = questions.filter((q) => q.reserve).length;

  const filters = [
    { key: 'all', label: `Tất cả (${questions.length})` },
    { key: 'official', label: `Chính thức (${officialCount})` },
    { key: 'reserve', label: `Dự bị (${reserveCount})` },
  ];

  const kw = keyword.trim().toLowerCase();
  const filtered = questions
    .filter((q) => (filter === 'all' ? true : filter === 'reserve' ? q.reserve : !q.reserve))
    .filter((q) => q.question.toLowerCase().includes(kw));

  // sắp xếp trên bản sao, cùng mức độ giữ thứ tự id tăng dần
  const shown = [...filtered].sort((a, b) => {
    if (sort === 'asc') return a.level - b.level || a.id - b.id;
    if (sort === 'desc') return b.level - a.level || a.id - b.id;
    return a.id - b.id;
  });

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div className="toolbar">
        {filters.map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? 'btn-filter selected' : 'btn-filter'}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="id">Theo số thứ tự</option>
          <option value="asc">Mức độ: Dễ → Khó</option>
          <option value="desc">Mức độ: Khó → Dễ</option>
        </select>
        <input
          type="text"
          placeholder="Tìm theo nội dung câu hỏi"
          value={keyword}
          onChange={handleKeywordShift}
        />
      </div>
      <p>Có {shown.length} câu hỏi</p>
      <table className="table">
        <thead>
          <tr><th>STT</th><th>Mức độ</th><th>Loại</th><th>Câu hỏi</th></tr>
        </thead>
        <tbody>
          {shown.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{LEVELS[q.level]}</td>
              <td>{q.reserve ? 'Dự bị' : 'Chính thức'}</td>
              <td><Link to={`/questions/${q.id}`}>{q.question}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;