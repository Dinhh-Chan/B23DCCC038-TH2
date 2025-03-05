// src/components/QuestionList.tsx
import React from 'react';
import { Question, DifficultyLevel } from '../../types/question.types';

interface QuestionListProps {
    questions: Question[];
    onEdit: (question: Question) => void;
    onDelete: (id: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
    questions,
    onEdit,
    onDelete
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Nội dung
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Môn học
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Độ khó
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Khối kiến thức
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {questions.map((question) => (
                        <tr key={question.id}>
                            <td className="px-6 py-4 whitespace-normal">{question.content}</td>
                            <td className="px-6 py-4">{question.subjectId}</td>
                            <td className="px-6 py-4">{question.difficulty}</td>
                            <td className="px-6 py-4">{question.knowledgeBlock}</td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onEdit(question)}
                                    className="text-blue-600 hover:text-blue-900 mr-2"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => onDelete(question.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};