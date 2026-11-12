import { POINTS, BONUS_PER_SECOND, STARS } from './data';

// Điểm của một câu trả lời ĐÚNG: điểm mức độ + thưởng tốc độ
export const calcPoints = (question, timeLeft) =>
  POINTS[question.level] + timeLeft * BONUS_PER_SECOND;

export const calcTotal = (answers) =>
  answers.reduce((sum, a) => sum + a.points, 0);

// Mục đầu tiên có số câu đúng >= min
export const getStars = (correctCount) =>
  STARS.find((s) => correctCount >= s.min);

export const starString = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);