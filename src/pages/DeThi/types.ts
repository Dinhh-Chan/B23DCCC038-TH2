// Định nghĩa các interface và enum

export interface MonHoc {
    id: string | number;
    maMon: string;
    tenMon: string;
    soTinChi: number;
    khoiKienThuc: string | string[];
  }
  
  export interface CauHoi {
    id: string;
    subjectId: string;  // ID của môn học
    content: string;    // Nội dung câu hỏi
    difficulty: string; // Mức độ khó
    knowledgeBlock: string; // Khối kiến thức
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface CauTrucDeThi {
    mucDo: string;
    khoiKienThuc: string;
    soCau: number;
  }
  
  export interface DeThi {
    id: string;
    tenDeThi: string;
    monHocId: string;
    thoiGianLamBai: number;
    danhSachCauHoi: CauHoi[];
    cauTrucDeThi?: CauTrucDeThi[];
    ngayTao: Date;
  }
  
  export enum MucDoKho {
    DE = "Dễ",
    TRUNG_BINH = "Trung bình", 
    KHO = "Khó",
    RAT_KHO = "Rất khó"
  }
  
  export interface QuestionFilter {
    difficulty: string | null; // Mức độ khó
    knowledgeBlock: string | null; // Khối kiến thức
  }