import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = useState(false);

  const q = questions.find((item) => item.id === Number(id));

  return (
    <div>
      <button onClick={() => navigate(-1)}>Quay lại</button>
      {!q ? (
        <p className="notice error">Không tìm thấy câu hỏi</p>
      ) : (
        <div className="detail">
          <h2>
            {`Câu hỏi số ${q.id} – ${LEVELS[q.level]} · ${q.reserve ? 'Dự bị' : 'Chính thức'}`}
          </h2>
          <p className="question-text">{q.question}</p>
          <ul className="option-list">
            {q.options.map((option, i) => {
              const isRight = showAnswer && i === q.answer;
              return (
                <li key={i} className={isRight ? 'option right' : 'option'}>
                  {`${LETTERS[i]}. `}{option}
                  {isRight && ' (Đáp án đúng)'}
                </li>
              );
            })}
          </ul>
          {showAnswer && <p>{`Giải thích: ${q.explain}`}</p>}
          <button onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;