import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Descriptions, 
  Divider, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal 
} from 'antd';
import { DeThiService } from '../../services/dethi/dethi.service';
import { DeThi } from '../../types/dethi.types';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

export const DeThiDetail: React.FC = () => {
  const [deThi, setDeThi] = useState<DeThi | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deThiService = new DeThiService();

  useEffect(() => {
    if (id) {
      loadDeThi(id);
    }
  }, [id]);

  const loadDeThi = (deThiId: string) => {
    setLoading(true);
    try {
      const deThi = deThiService.getDeThi(deThiId);
      if (deThi) {
        setDeThi(deThi);
      } else {
        Modal.error({
          title: 'Không tìm thấy',
          content: 'Không tìm thấy đề thi yêu cầu',
          onOk: () => navigate('/dethi')
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải đề thi:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Dễ':
        return 'green';
      case 'Trung bình':
        return 'blue';
      case 'Khó':
        return 'orange';
      case 'Rất khó':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (text: any, record: any, index: number) => index + 1,
      width: 60
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (text: string) => (
        <Tag color={getDifficultyColor(text)}>{text}</Tag>
      ),
      width: 120
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'knowledgeBlock',
      key: 'knowledgeBlock',
      width: 150
    }
  ];

  if (!deThi) {
    return <div>Đang tải...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={4}>{deThi.tenDeThi}</Title>
          <Space>
            <Button onClick={() => navigate('/dethi')}>
              Quay lại
            </Button>
            <Button type="primary" onClick={() => navigate(`/dethi/edit/${id}`)}>
              Chỉnh sửa
            </Button>
          </Space>
        </div>

        <Descriptions bordered column={2}>
          <Descriptions.Item label="Môn học">{deThi.monHocId}</Descriptions.Item>
          <Descriptions.Item label="Thời gian làm bài">{deThi.thoiGianLamBai} phút</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(deThi.ngayTao).toLocaleDateString('vi-VN')}</Descriptions.Item>
          <Descriptions.Item label="Tổng số câu hỏi">{deThi.danhSachCauHoi.length} câu</Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Cấu trúc đề thi</Divider>
        
        <Table 
          columns={[
            { title: 'Mức độ', dataIndex: 'mucDo', key: 'mucDo' },
            { title: 'Khối kiến thức', dataIndex: 'khoiKienThuc', key: 'khoiKienThuc' },
            { title: 'Số lượng', dataIndex: 'soLuong', key: 'soLuong' },
          ]} 
          dataSource={deThi.cauTrucDeThi}
          pagination={false}
          rowKey={(record) => `${record.mucDo}-${record.khoiKienThuc}`}
          size="small"
          style={{ marginBottom: 24 }}
        />
        
        <Divider orientation="left">Danh sách câu hỏi</Divider>
        
        <Table 
          columns={columns}
          dataSource={deThi.danhSachCauHoi}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};