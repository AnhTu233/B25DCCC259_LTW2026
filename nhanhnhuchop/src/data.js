export const POINTS = { 1: 50, 2: 100, 3: 150 };
export const LEVELS = { 1: 'Dễ', 2: 'Trung bình', 3: 'Khó' };
export const LETTERS = ['A', 'B', 'C', 'D'];
export const TIME_PER_QUESTION = 15;
// Mỗi giây còn lại khi trả lời đúng được thưởng thêm
export const BONUS_PER_SECOND = 10;
// Xếp loại theo số câu đúng, xếp từ cao xuống thấp
export const STARS = [
  { min: 13, stars: 3, message: 'Xuất sắc! Bạn nhanh như chớp' },
  { min: 9, stars: 2, message: 'Làm tốt lắm!' },
  { min: 5, stars: 1, message: 'Khá ổn, cố thêm chút nữa!' },
  { min: 0, stars: 0, message: 'Cần luyện tập thêm' },
];