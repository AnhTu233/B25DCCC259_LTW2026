import React, { useState, useMemo } from 'react';
import './App.css'; // Bạn có thể tạo file CSS để style thêm cho đẹp


const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, className } = student;

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{score}</td>
      <td>{className}</td>
      <td>
        {/* Nút Xóa sinh viên khỏi danh sách[cite: 1] */}
        <button 
          onClick={() => onDelete(id)}
          style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

const StudentList = ({ students, onDelete }) => {
  return (
    <table border="1" style={{ width: '100%', marginTop: '20px', textAlign: 'center', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Điểm số</th>
          <th>Lớp</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {/* Sử dụng phương thức xử lý mảng .map() của ES6 */}
        {students.length > 0 ? (
          students.map((student) => (
            <StudentItem key={student.id} student={student} onDelete={onDelete} />
          ))
        ) : (
          <tr>
            <td colSpan="5">Không có sinh viên nào.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const App = () => {
  const initialStudents = [
    { id: 1, name: "Nguyễn Văn A", score: 8.5, className: "D25CQCN01-B" },
    { id: 2, name: "Trần Thị B", score: 4.5, className: "D25CQCN02-B" },
    { id: 3, name: "Lê Văn C", score: 9.0, className: "D25CQCN01-B" },
    { id: 4, name: "Phạm Thị D", score: 6.0, className: "D25CQCN03-B" }
  ];

  const [students, setStudents] = useState(initialStudents);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'GOOD', 'FAILED'
  
  const [formData, setFormData] = useState({ name: '', score: '', className: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const { name, score, className } = formData;
    const numScore = parseFloat(score);

    if (!name || !score || !className) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      setErrorMsg('Điểm số không hợp lệ. Vui lòng nhập từ 0 đến 10!');
      return;
    }

    setErrorMsg('');
    
    const newStudent = {
      id: Date.now(),
      name,
      score: numScore,
      className
    };

    setStudents([...students, newStudent]);
    setFormData({ name: '', score: '', className: '' });
  };

  const handleDeleteStudent = (id) => {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
  };

  const filteredStudents = useMemo(() => {
    if (filterType === 'GOOD') {
      return students.filter(student => student.score >= 8);
    }
    if (filterType === 'FAILED') {
      return students.filter(student => student.score < 5);
    }
    return students;
  }, [students, filterType]);

  const totalStudents = students.length;
  
  const averageScore = totalStudents > 0 
    ? (students.reduce((sum, student) => sum + student.score, 0) / totalStudents).toFixed(2)
    : 0;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Ứng dụng Quản lý Điểm Sinh viên</h2>

      {/* Form nhập liệu[cite: 1] */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Thêm sinh viên mới</h3>
        <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="text" name="name" placeholder="Họ tên" value={formData.name} onChange={handleInputChange} />
          <input type="number" step="0.1" name="score" placeholder="Điểm số" value={formData.score} onChange={handleInputChange} />
          <input type="text" name="className" placeholder="Lớp" value={formData.className} onChange={handleInputChange} />
          <button type="submit" style={{ backgroundColor: 'green', color: 'white', padding: '5px 15px', border: 'none', cursor: 'pointer' }}>Thêm</button>
        </form>
        {/* Hiển thị thông báo lỗi[cite: 1] */}
        {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</p>}
      </div>

      {/* Thống kê cơ bản[cite: 1] */}
      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        {/* Dùng Template Literals để nối chuỗi hiển thị[cite: 2] */}
        <p><strong>Tổng số sinh viên cả lớp:</strong> {`${totalStudents} sinh viên`}</p>
        <p><strong>Điểm trung bình toàn lớp:</strong> {`${averageScore} điểm`}</p>
      </div>

      {/* Tính năng lọc (Filter)[cite: 1] */}
      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setFilterType('ALL')} style={{ marginRight: '10px', fontWeight: filterType === 'ALL' ? 'bold' : 'normal' }}>Tất cả</button>
        <button onClick={() => setFilterType('GOOD')} style={{ marginRight: '10px', fontWeight: filterType === 'GOOD' ? 'bold' : 'normal' }}>Sinh viên Giỏi (Điểm &gt;= 8)</button>
        <button onClick={() => setFilterType('FAILED')} style={{ fontWeight: filterType === 'FAILED' ? 'bold' : 'normal' }}>Sinh viên Trượt (Điểm &lt; 5)</button>
      </div>

      {/* Truyền danh sách đã được lọc xuống Component con qua Props[cite: 2] */}
      <StudentList students={filteredStudents} onDelete={handleDeleteStudent} />
    </div>
  );
};

export default App;