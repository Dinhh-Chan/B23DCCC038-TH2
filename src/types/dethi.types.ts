import { Question } from './question.types';

export interface CauTrucDeThi {
    mucDo: string;
    khoiKienThuc: string;
    soLuong: number;
}

export interface DeThi {
    id: string;
    tenDeThi: string;
    monHocId: string;
    thoiGianLamBai: number; // phút
    ngayTao: Date;
    cauTrucDeThi: CauTrucDeThi[];
    danhSachCauHoi: Question[];
}