// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Question, DifficultyLevel } from '../../types/question.types';
import { QuestionForm } from '../../components/question/QuestionForm';
import { QuestionList } from '../../components/question/QuestionList';
import { QuestionService } from '../../services/question/question.service';

const questionService = new QuestionService();

export const HomePage: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [filters, setFilters] = useState({
        subjectId: '',
        difficulty: '' as DifficultyLevel | '',
        knowledgeBlock: ''
    });
    const [subjects, setSubjects] = useState<string[]>([]);
    const [knowledgeBlocks, setKnowledgeBlocks] = useState<string[]>([]);

    useEffect(() => {
        loadQuestions();
        loadFilterOptions();
    }, []);

    const loadQuestions = () => {
        const filterParams = {
            ...(filters.subjectId ? { subjectId: filters.subjectId } : {}),
            ...(filters.difficulty ? { difficulty: filters.difficulty as DifficultyLevel } : {}),
            ...(filters.knowledgeBlock ? { knowledgeBlock: filters.knowledgeBlock } : {})
        };
        
        const allQuestions = questionService.searchQuestions(filterParams);
        setQuestions(allQuestions);
    };

    const loadFilterOptions = () => {
        const allQuestions = questionService.searchQuestions({});
        
        // Lấy danh sách môn học
        const uniqueSubjects = [...new Set(allQuestions.map(q => q.subjectId))];
        setSubjects(uniqueSubjects);
        
        // Lấy danh sách khối kiến thức
        const uniqueKnowledgeBlocks = [...new Set(allQuestions.map(q => q.knowledgeBlock))];
        setKnowledgeBlocks(uniqueKnowledgeBlocks);
    };

    const handleAddNew = () => {
        setSelectedQuestion(null);
        setIsFormOpen(true);
    };

    const handleEdit = (question: Question) => {
        setSelectedQuestion(question);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
            questionService.deleteQuestion(id);
            loadQuestions();
            loadFilterOptions();
        }
    };

    const handleSubmit = (data: Partial<Question>) => {
        if (selectedQuestion) {
            questionService.updateQuestion(selectedQuestion.id, data);
        } else {
            questionService.createQuestion(data as Omit<Question, 'id' | 'createdAt' | 'updatedAt'>);
        }
        setIsFormOpen(false);
        loadQuestions();
        loadFilterOptions();
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        loadQuestions();
    };

    const resetFilters = () => {
        setFilters({
            subjectId: '',
            difficulty: '',
            knowledgeBlock: ''
        });
        loadQuestions();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý câu hỏi</h1>
                <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Thêm câu hỏi mới
                </button>
            </div>

            {/* Bộ lọc */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold mb-3">Tìm kiếm và lọc</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Môn học
                        </label>
                        <select
                            name="subjectId"
                            value={filters.subjectId}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="">Tất cả môn học</option>
                            {subjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mức độ khó
                        </label>
                        <select
                            name="difficulty"
                            value={filters.difficulty}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="">Tất cả mức độ</option>
                            {Object.values(DifficultyLevel).map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Khối kiến thức
                        </label>
                        <select
                            name="knowledgeBlock"
                            value={filters.knowledgeBlock}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="">Tất cả khối kiến thức</option>
                            {knowledgeBlocks.map(block => (
                                <option key={block} value={block}>{block}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        Đặt lại
                    </button>
                    <button
                        onClick={applyFilters}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Áp dụng
                    </button>
                </div>
            </div>

            {/* Thông tin số lượng */}
            <div className="mb-4">
                <p className="text-gray-600">Tổng số câu hỏi: {questions.length}</p>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
                        </h2>
                        <QuestionForm
                            initialData={selectedQuestion || undefined}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </div>
            )}

            {questions.length > 0 ? (
                <QuestionList
                    questions={questions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ) : (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <p className="text-gray-500 text-lg">Không tìm thấy câu hỏi nào</p>
                    <button
                        onClick={handleAddNew}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Thêm câu hỏi đầu tiên
                    </button>
                </div>
            )}
        </div>
    );
};