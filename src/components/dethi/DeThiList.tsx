import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Table, 
  Space, 
  Card, 
  Typography, 
  Modal, 
  Tag
} from 'antd';
import { DeThiService } from '../../services/dethi/dethi.service';
import { DeThi } from '../../types/dethi.types';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export const DeThiList: React.FC = () => {
  const [danhSachDeThi, setDanhSachDeThi] = useState<DeThi[]>([]);
  const [loading, setLoading] = useState(true);
  const deThiService = new DeThiService();
  const navigate = useNavigate();

  useEffect(() => {
    loadDeThi();
  }, []);

  const loadDeThi = () => {
    setLoading(true);
    try {
      const danhSach = deThiService.getAllDeThi();
      setDanhSachDeThi(danhSach);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đề thi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeThi = () => {
    navigate('/dethi/create');
  };

  const handleViewDeThi = (id: string) => {
    navigate(`/dethi/${id}`);
  };

  const handleEditDeThi = (id: string) => {
    navigate(`/dethi/edit/${id}`);
  };

  const handleDeleteDeThi = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa đề thi này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        try {
          deThiService.deleteDeThi(id);
          loadDeThi();
        } catch (error) {
          console.error('Lỗi khi xóa đề thi:', error);
          Modal.error({
            title: 'Lỗi',
            content: 'Không thể xóa đề thi. Vui lòng thử lại sau.'
          });
        }
      }
    });
  };

  const columns = [
    {
      title: 'Tên đề thi',
      dataIndex: 'tenDeThi',
      key: 'tenDeThi',
    },
    {
      title: 'Môn học',
      dataIndex: 'monHocId',
      key: 'monHocId',
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'thoiGianLamBai',
      key: 'thoiGianLamBai',
    },
    {
      title: 'Số câu hỏi',
      key: 'soCauHoi',
      render: (text: any, record: DeThi) => record.danhSachCauHoi.length,
    },
    {
      title: 'Ngày tạo',
      key: 'ngayTao',
      render: (text: any, record: DeThi) => new Date(record.ngayTao).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: any, record: DeThi) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewDeThi(record.id)}>
            Xem
          </Button>
          <Button type="link" onClick={() => handleEditDeThi(record.id)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDeleteDeThi(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={4}>Quản lý đề thi</Title>
          <Button type="primary" onClick={handleCreateDeThi}>
            Tạo đề thi mới
          </Button>
        </div>
        <Table 
          columns={columns}
          dataSource={danhSachDeThi}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};