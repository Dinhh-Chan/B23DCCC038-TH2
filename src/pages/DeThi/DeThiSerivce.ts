import { DeThi, CauTrucDeThi, CauHoi } from './types';

export class DeThiService {
  private danhSachDeThi: Map<string, DeThi>;
  private readonly DE_THI_STORAGE_KEY = 'dethi_list';

  constructor() {
    this.danhSachDeThi = new Map<string, DeThi>();
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
      console.error('Lỗi khi tải dữ liệu từ localStorage:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      const deThiArray = Array.from(this.danhSachDeThi.values());
      localStorage.setItem(this.DE_THI_STORAGE_KEY, JSON.stringify(deThiArray));
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu vào localStorage:', error);
    }
  }

  getAll(): DeThi[] {
    return Array.from(this.danhSachDeThi.values())
      .sort((a, b) => b.ngayTao.getTime() - a.ngayTao.getTime());
  }

  getById(id: string): DeThi | undefined {
    return this.danhSachDeThi.get(id);
  }

  createDeThi(deThi: Omit<DeThi, 'id' | 'ngayTao'>): DeThi {
    const id = this.generateDeThiId();
    const newDeThi: DeThi = {
      ...deThi,
      id,
      ngayTao: new Date()
    };

    this.danhSachDeThi.set(id, newDeThi);
    this.saveToLocalStorage();
    return newDeThi;
  }

  updateDeThi(id: string, deThi: Partial<DeThi>): DeThi | undefined {
    const existingDeThi = this.danhSachDeThi.get(id);
    if (!existingDeThi) return undefined;

    const updatedDeThi = {
      ...existingDeThi,
      ...deThi
    };

    this.danhSachDeThi.set(id, updatedDeThi);
    this.saveToLocalStorage();
    return updatedDeThi;
  }

  deleteDeThi(id: string): boolean {
    const result = this.danhSachDeThi.delete(id);
    if (result) {
      this.saveToLocalStorage();
    }
    return result;
  }

  createDeThiTheoCauTruc(tenDeThi: string, monHocId: string, thoiGianLamBai: number, cauTruc: CauTrucDeThi[], questionList: CauHoi[]): DeThi {
    // Lọc câu hỏi theo môn học
    const questionsOfSubject = questionList.filter(q => q.subjectId === monHocId);
    
    // Chọn câu hỏi theo cấu trúc
    const selectedQuestions = this.selectQuestionsBasedOnStructure(questionsOfSubject, cauTruc);
    
    // Tạo đề thi mới
    const deThi: Omit<DeThi, 'id' | 'ngayTao'> = {
      tenDeThi,
      monHocId,
      thoiGianLamBai,
      danhSachCauHoi: selectedQuestions,
      cauTrucDeThi: cauTruc
    };
    
    return this.createDeThi(deThi);
  }

  private selectQuestionsBasedOnStructure(questions: CauHoi[], cauTruc: CauTrucDeThi[]): CauHoi[] {
    const selectedQuestions: CauHoi[] = [];
    
    cauTruc.forEach(({ mucDo, khoiKienThuc, soCau }) => {
      // Lọc câu hỏi theo mức độ và khối kiến thức
      const matchingQuestions = questions.filter(q => 
        q.difficulty === mucDo && 
        q.knowledgeBlock === khoiKienThuc &&
        !selectedQuestions.includes(q)
      );
      
      // Trộn ngẫu nhiên và chọn số lượng cần thiết
      const shuffled = this.shuffleArray(matchingQuestions);
      const selected = shuffled.slice(0, soCau);
      
      selectedQuestions.push(...selected);
    });
    
    return selectedQuestions;
  }
  
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  private generateDeThiId(): string {
    return `DT${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default DeThiService;