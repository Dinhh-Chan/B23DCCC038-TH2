import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Table, 
  Button, 
  Space, 
  Popconfirm, 
  message 
} from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { DeThi, MonHoc, CauHoi, QuestionFilter } from './types';
import DeThiService from './DeThiSerivce';
import DeThiForm from './DeThiForm';
import DeThiDetail from './DeThiDetail';
import { ColumnType } from 'antd/lib/table';

const QuanLiDeThi: React.FC = () => {
  const [danhSachDeThi, setDanhSachDeThi] = useState<DeThi[]>([]);
  const [isDeThiFormOpen, setIsDeThiFormOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentDeThi, setCurrentDeThi] = useState<DeThi | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<MonHoc[]>([]);
  const [questionList, setQuestionList] = useState<CauHoi[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<CauHoi[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [filteredQuestions, setFilteredQuestions] = useState<CauHoi[]>([]);

  const deThiService = new DeThiService();

  useEffect(() => {
    console.log("===== DEBUG: Tất cả dữ liệu trong localStorage =====");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        console.log(`${key}:`, value);
      }
    }
    console.log("===== END DEBUG =====");
    
    loadDeThi();
    loadSubjects();
    loadQuestions();
  }, []);

  const loadDeThi = () => {
    try {
      // Đọc từ key lưu danh sách đề thi
      const deThiData = localStorage.getItem('dethi_list');
      
      if (deThiData) {
        const parsedDeThi = JSON.parse(deThiData);
        console.log('Đề thi từ localStorage:', parsedDeThi);
        
        // Chuyển đổi Date nếu cần
        const convertedDeThi = parsedDeThi.map((dt: any) => ({
          ...dt,
          ngayTao: new Date(dt.ngayTao)
        }));
        
        setDanhSachDeThi(convertedDeThi);
      } else {
        console.warn('Không tìm thấy dữ liệu đề thi trong localStorage');
        setDanhSachDeThi([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách đề thi:', error);
      setDanhSachDeThi([]);
    }
  };

  const loadSubjects = () => {
    try {
      // Đọc từ key question_bank_subjects
      const subjectsData = localStorage.getItem('question_bank_subjects');
      console.log('Dữ liệu môn học thô:', subjectsData);
      
      if (subjectsData) {
        const parsedSubjects = JSON.parse(subjectsData);
        console.log('Môn học từ localStorage:', parsedSubjects);
        
        // Chuyển đổi cấu trúc dữ liệu từ question_bank_subjects sang cấu trúc MonHoc
        const convertedSubjects: MonHoc[] = parsedSubjects.map((subject: any) => ({
          id: subject.id,            // Giữ nguyên id
          maMon: subject.id,         // Dùng id làm mã môn
          tenMon: subject.name,      // Thay name thành tenMon 
          soTinChi: subject.credits || 0,  // Thay credits thành soTinChi
          khoiKienThuc: subject.knowledgeBlocks || []  // Thay knowledgeBlocks thành khoiKienThuc
        }));
        
        console.log('Môn học đã chuyển đổi:', convertedSubjects);
        setSubjects(convertedSubjects);
      } else {
        console.warn('Không tìm thấy dữ liệu môn học trong localStorage');
        setSubjects([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách môn học:', error);
      setSubjects([]);
    }
  };

  const loadQuestions = () => {
    try {
      // Thay đổi key từ 'cauHoiList' thành 'question_bank_questions'
      const questionsData = localStorage.getItem('question_bank_questions');
      console.log('Dữ liệu câu hỏi thô:', questionsData);
      
      if (questionsData) {
        const parsedQuestions: CauHoi[] = JSON.parse(questionsData);
        console.log('Câu hỏi đã parse:', parsedQuestions);
        
        // Kiểm tra cấu trúc của mỗi câu hỏi
        if (parsedQuestions.length > 0) {
          console.log('Cấu trúc câu hỏi đầu tiên:', JSON.stringify(parsedQuestions[0], null, 2));
        }
        
        setQuestionList(parsedQuestions);
      } else {
        console.warn('Không tìm thấy dữ liệu câu hỏi trong localStorage');
        setQuestionList([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách câu hỏi:', error);
      setQuestionList([]);
    }
  };

  const handleOpenCreateForm = () => {
    setIsEditing(false);
    setCurrentDeThi(null);
    setIsDeThiFormOpen(true);
  };

  const handleOpenEditForm = (deThi: DeThi) => {
    setIsEditing(true);
    setCurrentDeThi(deThi);
    setIsDeThiFormOpen(true);
  };

  const handleViewDetail = (deThi: DeThi) => {
    setCurrentDeThi(deThi);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (id: string) => {
    try {
      const success = deThiService.deleteDeThi(id);
      if (success) {
        message.success('Xóa đề thi thành công');
        loadDeThi();
      } else {
        message.error('Không tìm thấy đề thi để xóa');
      }
    } catch (error) {
      console.error('Lỗi khi xóa đề thi:', error);
      message.error('Có lỗi xảy ra khi xóa đề thi');
    }
  };

  const handleExportDeThi = (deThi: DeThi) => {
    try {
      // Chuẩn bị dữ liệu để xuất
      const subject = subjects.find(s => s.id.toString() === deThi.monHocId.toString());
      
      const exportData = {
        tenDeThi: deThi.tenDeThi,
        monHoc: subject?.tenMon || 'Không xác định',
        thoiGianLamBai: `${deThi.thoiGianLamBai} phút`,
        ngayTao: deThi.ngayTao instanceof Date 
          ? deThi.ngayTao.toLocaleString() 
          : new Date(deThi.ngayTao).toLocaleString(),
        danhSachCauHoi: deThi.danhSachCauHoi.map((q, index) => ({
          stt: index + 1,
          noiDung: q.content,
          mucDo: q.difficulty,
          khoiKienThuc: q.knowledgeBlock
        }))
      };
      
      // Chuyển đổi đối tượng thành chuỗi JSON
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Tạo file để download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Tạo link tải xuống
      const a = document.createElement('a');
      a.href = url;
      a.download = `DeThi_${deThi.tenDeThi.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Dọn dẹp
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      message.success('Xuất đề thi thành công');
    } catch (error) {
      console.error('Lỗi khi xuất đề thi:', error);
      message.error('Có lỗi xảy ra khi xuất đề thi');
    }
  };

  const handleCreateTheoCauTruc = (values: any) => {
    setLoading(true);
    
    try {
      const { tenDeThi, monHocId, thoiGianLamBai, cauTruc } = values;
      
      const deThi = deThiService.createDeThiTheoCauTruc(
        tenDeThi,
        monHocId,
        thoiGianLamBai,
        cauTruc,
        questionList
      );
      
      message.success('Tạo đề thi thành công');
      setIsDeThiFormOpen(false);
      loadDeThi();
    } catch (error) {
      console.error('Lỗi khi tạo đề thi:', error);
      message.error('Có lỗi xảy ra khi tạo đề thi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManual = (values: any) => {
    setLoading(true);
    
    try {
      const { tenDeThi, monHocId, thoiGianLamBai } = values;
      const selectedQuestions = values.selectedQuestions;
      
      if (!selectedQuestions || selectedQuestions.length === 0) {
        message.error('Vui lòng chọn ít nhất một câu hỏi');
        setLoading(false);
        return;
      }
      
      // Tạo đề thi mới
      const newDeThi: Omit<DeThi, 'id' | 'ngayTao'> = {
        tenDeThi,
        monHocId,
        thoiGianLamBai,
        danhSachCauHoi: selectedQuestions
      };
      
      const deThi = deThiService.createDeThi(newDeThi);
      
      message.success('Tạo đề thi thành công');
      setIsDeThiFormOpen(false);
      loadDeThi();
    } catch (error) {
      console.error('Lỗi khi tạo đề thi:', error);
      message.error('Có lỗi xảy ra khi tạo đề thi');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnType<DeThi>[] = [
    {
      title: 'Tên đề thi',
      dataIndex: 'tenDeThi',
      key: 'tenDeThi',
    },
    {
      title: 'Môn học',
      dataIndex: 'monHocId',
      key: 'monHocId',
      render: (monHocId) => {
        const subject = subjects.find(s => s.id.toString() === monHocId.toString());
        return subject?.tenMon || 'Không xác định';
      }
    },
    {
      title: 'Thời gian',
      dataIndex: 'thoiGianLamBai',
      key: 'thoiGianLamBai',
      render: (thoiGian) => `${thoiGian} phút`
    },
    {
      title: 'Số câu hỏi',
      key: 'soCauHoi',
      render: (_, record) => record.danhSachCauHoi.length
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: (ngayTao) => {
        const date = ngayTao instanceof Date ? ngayTao : new Date(ngayTao);
        return date.toLocaleString();
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)}
            title="Xem chi tiết"
          />
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleOpenEditForm(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đề thi này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              title="Xóa đề thi"
            />
          </Popconfirm>
          <Button 
            icon={<ExportOutlined />}
            onClick={() => handleExportDeThi(record)}
            title="Xuất đề thi"
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Card
        title="Quản lý đề thi"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleOpenCreateForm}
          >
            Tạo đề thi mới
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={danhSachDeThi} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <DeThiForm
        visible={isDeThiFormOpen}
        currentDeThi={currentDeThi}
        isEditing={isEditing}
        subjects={subjects}
        questionList={questionList}
        onClose={() => setIsDeThiFormOpen(false)}
        onCreateTheoCauTruc={handleCreateTheoCauTruc}
        onCreateManual={handleCreateManual}
        loading={loading}
      />

      <DeThiDetail
        visible={isDetailModalOpen}
        deThi={currentDeThi}
        subjects={subjects}
        onClose={() => setIsDetailModalOpen(false)}
        onExport={handleExportDeThi}
      />
    </Layout>
  );
};

export default QuanLiDeThi;