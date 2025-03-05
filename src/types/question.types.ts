// types/question.types.ts
export enum DifficultyLevel {
    EASY = "Dễ",
    MEDIUM = "Trung bình",
    HARD = "Khó",
    VERY_HARD = "Rất khó"
}

export interface Subject {
    id: string;
    name: string;
    credits: number;
    knowledgeBlocks: string[];
}

export interface Question {
    id: string;
    subjectId: string;
    content: string;
    difficulty: DifficultyLevel;
    knowledgeBlock: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface MonHoc {
    id: number;
    maMon: string;
    tenMon: string;
    soTinChi: number;
    khoiKienThuc: string;
}