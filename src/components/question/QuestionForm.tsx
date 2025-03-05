// src/components/QuestionForm.tsx
import React, { useState } from 'react';
import { Question, DifficultyLevel } from '../../types/question.types';
import './QuestionForm.css';
interface QuestionFormProps {
    initialData?: Question;
    onSubmit: (data: Partial<Question>) => void;
    onCancel: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
    initialData,
    onSubmit,
    onCancel
}) => {
    const [formData, setFormData] = useState({
        content: initialData?.content || '',
        subjectId: initialData?.subjectId || '',
        difficulty: initialData?.difficulty || DifficultyLevel.MEDIUM,
        knowledgeBlock: initialData?.knowledgeBlock || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Nội dung câu hỏi
                </label>
                <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Mã môn học
                </label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={formData.subjectId}
                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Mức độ khó
                </label>
                <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({
                        ...formData, 
                        difficulty: e.target.value as DifficultyLevel
                    })}
                >
                    {Object.values(DifficultyLevel).map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Khối kiến thức
                </label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={formData.knowledgeBlock}
                    onChange={(e) => setFormData({...formData, knowledgeBlock: e.target.value})}
                    required
                />
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {initialData ? 'Cập nhật' : 'Thêm mới'}
                </button>
            </div>
        </form>
    );
};