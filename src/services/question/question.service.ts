// services/question.service.ts
import { Question, Subject, DifficultyLevel } from '../../types/question.types';

export class QuestionService {
    private questions: Map<string, Question>;
    private subjects: Map<string, Subject>;
    private readonly QUESTIONS_STORAGE_KEY = 'question_bank_questions';
    private readonly SUBJECTS_STORAGE_KEY = 'question_bank_subjects';

    constructor() {
        this.questions = new Map<string, Question>();
        this.subjects = new Map<string, Subject>();
        this.loadFromLocalStorage();
    }

    // Tải dữ liệu từ localStorage
    private loadFromLocalStorage(): void {
        try {
            // Tải câu hỏi
            const questionsJson = localStorage.getItem(this.QUESTIONS_STORAGE_KEY);
            if (questionsJson) {
                const questionsArray: Question[] = JSON.parse(questionsJson);
                questionsArray.forEach(q => {
                    // Chuyển đổi string dates thành Date objects
                    q.createdAt = new Date(q.createdAt);
                    q.updatedAt = new Date(q.updatedAt);
                    this.questions.set(q.id, q);
                });
            }

            // Tải môn học
            const subjectsJson = localStorage.getItem(this.SUBJECTS_STORAGE_KEY);
            if (subjectsJson) {
                const subjectsArray: Subject[] = JSON.parse(subjectsJson);
                subjectsArray.forEach(s => {
                    this.subjects.set(s.id, s);
                });
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu từ localStorage:', error);
        }
    }

    // Lưu dữ liệu vào localStorage
    private saveToLocalStorage(): void {
        try {
            // Lưu câu hỏi
            const questionsArray = Array.from(this.questions.values());
            localStorage.setItem(this.QUESTIONS_STORAGE_KEY, JSON.stringify(questionsArray));

            // Lưu môn học
            const subjectsArray = Array.from(this.subjects.values());
            localStorage.setItem(this.SUBJECTS_STORAGE_KEY, JSON.stringify(subjectsArray));
        } catch (error) {
            console.error('Lỗi khi lưu dữ liệu vào localStorage:', error);
        }
    }

    // Thêm môn học
    public addSubject(subject: Subject): Subject {
        this.subjects.set(subject.id, subject);
        this.saveToLocalStorage();
        return subject;
    }

    // Lấy tất cả môn học
    public getAllSubjects(): Subject[] {
        return Array.from(this.subjects.values());
    }

    // Lấy môn học theo ID
    public getSubjectById(id: string): Subject | undefined {
        return this.subjects.get(id);
    }

    // Thêm câu hỏi mới
    public createQuestion(questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Question {
        // Kiểm tra môn học có tồn tại
        if (!this.subjects.has(questionData.subjectId)) {
            // Nếu môn học chưa tồn tại, tự động tạo môn học mới
            this.addSubject({
                id: questionData.subjectId,
                name: `Môn học ${questionData.subjectId}`,
                credits: 3,
                knowledgeBlocks: [questionData.knowledgeBlock]
            });
        } else {
            // Nếu môn học đã tồn tại, kiểm tra và thêm khối kiến thức nếu cần
            const subject = this.subjects.get(questionData.subjectId)!;
            if (!subject.knowledgeBlocks.includes(questionData.knowledgeBlock)) {
                subject.knowledgeBlocks.push(questionData.knowledgeBlock);
                this.subjects.set(subject.id, subject);
            }
        }

        const newQuestion: Question = {
            ...questionData,
            id: this.generateQuestionId(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.questions.set(newQuestion.id, newQuestion);
        this.saveToLocalStorage();
        return newQuestion;
    }

    // Cập nhật câu hỏi
    public updateQuestion(
        id: string, 
        updateData: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>>
    ): Question {
        const question = this.questions.get(id);
        if (!question) {
            throw new Error('Câu hỏi không tồn tại');
        }

        // Nếu thay đổi môn học hoặc khối kiến thức, cần cập nhật thông tin môn học
        if (updateData.subjectId && updateData.subjectId !== question.subjectId) {
            if (!this.subjects.has(updateData.subjectId)) {
                this.addSubject({
                    id: updateData.subjectId,
                    name: `Môn học ${updateData.subjectId}`,
                    credits: 3,
                    knowledgeBlocks: [updateData.knowledgeBlock || question.knowledgeBlock]
                });
            }
        }

        if (updateData.knowledgeBlock && updateData.knowledgeBlock !== question.knowledgeBlock) {
            const subjectId = updateData.subjectId || question.subjectId;
            const subject = this.subjects.get(subjectId);
            if (subject && !subject.knowledgeBlocks.includes(updateData.knowledgeBlock)) {
                subject.knowledgeBlocks.push(updateData.knowledgeBlock);
                this.subjects.set(subject.id, subject);
            }
        }

        const updatedQuestion: Question = {
            ...question,
            ...updateData,
            updatedAt: new Date()
        };

        this.questions.set(id, updatedQuestion);
        this.saveToLocalStorage();
        return updatedQuestion;
    }

    // Xóa câu hỏi
    public deleteQuestion(id: string): boolean {
        const result = this.questions.delete(id);
        if (result) {
            this.saveToLocalStorage();
        }
        return result;
    }

    // Tìm kiếm câu hỏi
    public searchQuestions(filters: {
        subjectId?: string;
        difficulty?: DifficultyLevel;
        knowledgeBlock?: string;
    }): Question[] {
        return Array.from(this.questions.values()).filter(question => {
            const subjectMatch = !filters.subjectId || question.subjectId === filters.subjectId;
            const difficultyMatch = !filters.difficulty || question.difficulty === filters.difficulty;
            const knowledgeMatch = !filters.knowledgeBlock || 
                                 question.knowledgeBlock === filters.knowledgeBlock;

            return subjectMatch && difficultyMatch && knowledgeMatch;
        });
    }

    // Lấy câu hỏi theo ID
    public getQuestionById(id: string): Question | undefined {
        return this.questions.get(id);
    }

    // Lấy tất cả câu hỏi của một môn học
    public getQuestionsBySubject(subjectId: string): Question[] {
        return Array.from(this.questions.values())
            .filter(question => question.subjectId === subjectId);
    }

    // Tạo ID cho câu hỏi mới
    private generateQuestionId(): string {
        return `Q${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}