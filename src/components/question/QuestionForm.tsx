import React, { useState, useEffect } from 'react';
import { Question, DifficultyLevel, MonHoc } from '../../types/question.types';

interface QuestionFormProps {
  initialQuestion?: Question;
  subjects: MonHoc[]; // Sử dụng kiểu dữ liệu MonHoc
  onSubmit: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  initialQuestion,
  subjects,
  onSubmit,
  onCancel
}) => {
  const [content, setContent] = useState(initialQuestion?.content || '');
  const [subjectId, setSubjectId] = useState(initialQuestion?.subjectId || '');
  const [difficulty, setDifficulty] = useState(initialQuestion?.difficulty || DifficultyLevel.EASY);
  
  // State để lưu trữ môn học đã chọn
  const [selectedSubject, setSelectedSubject] = useState<MonHoc | null>(null);
  
  // Cập nhật môn học được chọn khi subjectId thay đổi
  useEffect(() => {
    if (subjectId) {
      const foundSubject = subjects.find(s => s.id.toString() === subjectId.toString());
      setSelectedSubject(foundSubject || null);
    } else {
      setSelectedSubject(null);
    }
  }, [subjectId, subjects]);
  
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSubjectId(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subjectId) {
      alert('Vui lòng chọn môn học!');
      return;
    }
    
    if (!selectedSubject) {
      alert('Không tìm thấy thông tin môn học!');
      return;
    }
    
    // Tự động lấy khối kiến thức từ môn học đã chọn
    onSubmit({
      content,
      subjectId,
      difficulty,
      knowledgeBlock: selectedSubject.khoiKienThuc
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nội dung câu hỏi
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows={4}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Môn học
        </label>
        <select
          value={subjectId}
          onChange={handleSubjectChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        >
          <option value="">-- Chọn môn học --</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.tenMon}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Độ khó
        </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        >
          {Object.values(DifficultyLevel).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={!subjectId}
        >
          {initialQuestion ? 'Cập nhật' : 'Tạo mới'}
        </button>
      </div>
    </form>
  );
};