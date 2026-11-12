import { TIME_PER_QUESTION } from '../data';

const TimeBar = ({ timeLeft, frozen }) => {
  const percent = (timeLeft / TIME_PER_QUESTION) * 100;
  const color = timeLeft <= 5 ? '#e53935' : '#43a047';
  return (
    <div className="timebar">
      <p>{`Còn ${timeLeft} giây${frozen ? ' (đã dừng)' : ''}`}</p>
      <div className="timebar-track">
        <div
          className="timebar-fill"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  );
};

export default TimeBar;