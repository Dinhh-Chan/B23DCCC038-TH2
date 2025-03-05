import { DeThi, CauTrucDeThi } from '../../types/dethi.types';
import { Question } from '../../types/question.types';
import { QuestionService } from '../question/question.service';

export class DeThiService {
    private danhSachDeThi: Map<string, DeThi>;
    private readonly DE_THI_STORAGE_KEY = 'dethi_list';
    private questionService: QuestionService;

    constructor() {
        this.danhSachDeThi = new Map<string, DeThi>();
        this.questionService = new QuestionService();
        this.loadFromLocalStorage();
    }

    private loadFromLocalStorage(): void {
        try {
            const deThiJson = localStorage.getItem(this.DE_THI_STORAGE_KEY);
            if (deThiJson) {
                const deThiArray: DeThi[] = JSON.parse(deThiJson);
                deThiArray.forEach(dt => {
                    dt.ngayTao = new Date(dt.ngayTao);
                    this.danhSachDeThi.set(dt.id, dt);
                });
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu đề thi từ localStorage:', error);
        }
    }

    private saveToLocalStorage(): void {
        try {
            const deThiArray = Array.from(this.danhSachDeThi.values());
            localStorage.setItem(this.DE_THI_STORAGE_KEY, JSON.stringify(deThiArray));
        } catch (error) {
            console.error('Lỗi khi lưu dữ liệu đề thi vào localStorage:', error);
        }
    }

    public getAllDeThi(): DeThi[] {
        return Array.from(this.danhSachDeThi.values());
    }

    public getDeThi(id: string): DeThi | undefined {
        return this.danhSachDeThi.get(id);
    }

    public createDeThi(deThiData: Omit<DeThi, 'id' | 'ngayTao' | 'danhSachCauHoi'>): DeThi {
        const danhSachCauHoi = this.taoDanhSachCauHoi(deThiData.monHocId, deThiData.cauTrucDeThi);
        
        const newDeThi: DeThi = {
            id: this.generateDeThiId(),
            ...deThiData,
            ngayTao: new Date(),
            danhSachCauHoi,
        };

        this.danhSachDeThi.set(newDeThi.id, newDeThi);
        this.saveToLocalStorage();
        return newDeThi;
    }

    public updateDeThi(id: string, updateData: Partial<Omit<DeThi, 'id' | 'ngayTao'>>): DeThi {
        const deThi = this.danhSachDeThi.get(id);
        if (!deThi) {
            throw new Error('Đề thi không tồn tại');
        }

        let danhSachCauHoi = deThi.danhSachCauHoi;
        if (updateData.cauTrucDeThi || updateData.monHocId) {
            danhSachCauHoi = this.taoDanhSachCauHoi(
                updateData.monHocId || deThi.monHocId,
                updateData.cauTrucDeThi || deThi.cauTrucDeThi
            );
        }

        const updatedDeThi: DeThi = {
            ...deThi,
            ...updateData,
            danhSachCauHoi,
        };

        this.danhSachDeThi.set(id, updatedDeThi);
        this.saveToLocalStorage();
        return updatedDeThi;
    }

    public deleteDeThi(id: string): boolean {
        const result = this.danhSachDeThi.delete(id);
        if (result) {
            this.saveToLocalStorage();
        }
        return result;
    }

    private taoDanhSachCauHoi(monHocId: string, cauTrucDeThi: CauTrucDeThi[]): Question[] {
        const danhSachCauHoi: Question[] = [];
        
        // Lấy tất cả câu hỏi của môn học
        const allQuestions = this.questionService.searchQuestions({ subjectId: monHocId });
        
        // Tạo danh sách câu hỏi theo cấu trúc đề thi
        cauTrucDeThi.forEach(cau => {
            // Lọc câu hỏi theo mức độ và khối kiến thức
            const filteredQuestions = allQuestions.filter(q => 
                q.difficulty === cau.mucDo && 
                q.knowledgeBlock === cau.khoiKienThuc
            );
            
            // Shuffle để lấy ngẫu nhiên
            const shuffled = this.shuffleArray([...filteredQuestions]);
            
            // Lấy số lượng câu hỏi theo yêu cầu
            const selectedQuestions = shuffled.slice(0, cau.soLuong);
            
            // Thêm vào danh sách
            danhSachCauHoi.push(...selectedQuestions);
        });
        
        return danhSachCauHoi;
    }

    private shuffleArray<T>(array: T[]): T[] {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    private generateDeThiId(): string {
        return `DT${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}