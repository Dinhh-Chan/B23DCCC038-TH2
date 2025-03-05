// src/components/QuestionForm.tsx
import React, { useState, useEffect } from 'react';
import { Question, DifficultyLevel } from '../../types/question.types';
import { QuestionService } from '../../services/question/question.service';

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
    const questionService = new QuestionService();
    const [subjects, setSubjects] = useState<string[]>([]);
    const [knowledgeBlocks, setKnowledgeBlocks] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        content: initialData?.content || '',
        subjectId: initialData?.subjectId || '',
        difficulty: initialData?.difficulty || DifficultyLevel.MEDIUM,
        knowledgeBlock: initialData?.knowledgeBlock || ''
    });
    const [newSubject, setNewSubject] = useState('');
    const [newKnowledgeBlock, setNewKnowledgeBlock] = useState('');
    const [showNewSubjectField, setShowNewSubjectField] = useState(false);
    const [showNewKnowledgeBlockField, setShowNewKnowledgeBlockField] = useState(false);

    useEffect(() => {
        loadOptions();
    }, []);

    const loadOptions = () => {
        const allQuestions = questionService.searchQuestions({});
        
        // Lấy danh sách môn học
        const uniqueSubjects = [...new Set(allQuestions.map(q => q.subjectId))];
        setSubjects(uniqueSubjects);
        
        // Lấy danh sách khối kiến thức cho môn học đã chọn
        if (formData.subjectId) {
            const filteredQuestions = allQuestions.filter(q => q.subjectId === formData.subjectId);
            const uniqueKnowledgeBlocks = [...new Set(filteredQuestions.map(q => q.knowledgeBlock))];
            setKnowledgeBlocks(uniqueKnowledgeBlocks);
        }
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        
        if (value === 'new') {
            setShowNewSubjectField(true);
        } else {
            setFormData({...formData, subjectId: value});
            
            // Cập nhật danh sách khối kiến thức khi thay đổi môn học
            const allQuestions = questionService.searchQuestions({});
            const filteredQuestions = allQuestions.filter(q => q.subjectId === value);
            const uniqueKnowledgeBlocks = [...new Set(filteredQuestions.map(q => q.knowledgeBlock))];
            setKnowledgeBlocks(uniqueKnowledgeBlocks);
        }
    };

    const handleKnowledgeBlockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        
        if (value === 'new') {
            setShowNewKnowledgeBlockField(true);
        } else {
            setFormData({...formData, knowledgeBlock: value});
        }
    };

    const handleAddNewSubject = () => {
        if (newSubject.trim()) {
            setFormData({...formData, subjectId: newSubject.trim()});
            setShowNewSubjectField(false);
            setNewSubject('');
        }
    };

    const handleAddNewKnowledgeBlock = () => {
        if (newKnowledgeBlock.trim()) {
            setFormData({...formData, knowledgeBlock: newKnowledgeBlock.trim()});
            setShowNewKnowledgeBlockField(false);
            setNewKnowledgeBlock('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Nội dung câu hỏi
                </label>
                <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Môn học
                </label>
                {showNewSubjectField ? (
                    <div className="flex mt-1">
                        <input
                            type="text"
                            className="block w-full rounded-l-md border-gray-300 shadow-sm"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="Nhập mã môn học mới"
                            required
                        />
                        <button
                            type="button"
                            onClick={handleAddNewSubject}
                            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                        >
                            Thêm
                        </button>
                    </div>
                ) : (
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={formData.subjectId}
                        onChange={handleSubjectChange}
                        required
                    >
                        <option value="">Chọn môn học</option>
                        {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                        <option value="new">+ Thêm môn học mới</option>
                    </select>
                )}
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
                    required
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
                {showNewKnowledgeBlockField ? (
                    <div className="flex mt-1">
                        <input
                            type="text"
                            className="block w-full rounded-l-md border-gray-300 shadow-sm"
                            value={newKnowledgeBlock}
                            onChange={(e) => setNewKnowledgeBlock(e.target.value)}
                            placeholder="Nhập khối kiến thức mới"
                            required
                        />
                        <button
                            type="button"
                            onClick={handleAddNewKnowledgeBlock}
                            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                        >
                            Thêm
                        </button>
                    </div>
                ) : (
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={formData.knowledgeBlock}
                        onChange={handleKnowledgeBlockChange}
                        required
                    >
                        <option value="">Chọn khối kiến thức</option>
                        {knowledgeBlocks.map(block => (
                            <option key={block} value={block}>{block}</option>
                        ))}
                        <option value="new">+ Thêm khối kiến thức mới</option>
                    </select>
                )}
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