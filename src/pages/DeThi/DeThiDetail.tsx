import React from 'react';
import { Modal, Descriptions, Table, Button, Space, Typography } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { DeThi, MonHoc, CauHoi, MucDoKho } from './types';
import { ColumnType } from 'antd/lib/table';

const { Title } = Typography;

interface DeThiDetailProps {
  visible: boolean;
  deThi: DeThi | null;
  subjects: MonHoc[];
  onClose: () => void;
  onExport: (deThi: DeThi) => void;
}

const DeThiDetail: React.FC<DeThiDetailProps> = ({
  visible,
  deThi,
  subjects,
  onClose,
  onExport
}) => {
  if (!deThi) return null;

  // Tìm môn học đúng cách
  const subject = subjects.find(s => s.id.toString() === deThi.monHocId.toString());
  console.log("Đề thi được xem:", deThi);
  console.log("Danh sách môn học:", subjects);
  console.log("Môn học của đề thi:", subject);

  const detailColumns: ColumnType<CauHoi>[] = [
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: { showTitle: false },
      render: (text: string) => text,
    },
    {
      title: 'Mức độ',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 120,
      filters: [
        { text: 'Dễ', value: 'Dễ' },
        { text: 'Trung bình', value: 'Trung bình' },
        { text: 'Khó', value: 'Khó' },
        { text: 'Rất khó', value: 'Rất khó' },
      ],
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'knowledgeBlock',
      key: 'knowledgeBlock',
      width: 150,
    },
  ];

  return (
    <Modal
      title={<Title level={4}>Chi tiết đề thi</Title>}
      visible={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button 
          key="export" 
          type="primary" 
          icon={<ExportOutlined />} 
          onClick={() => onExport(deThi)}
        >
          Xuất đề thi
        </Button>
      ]}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Tên đề thi" span={2}>{deThi.tenDeThi}</Descriptions.Item>
        <Descriptions.Item label="Môn học">{subject?.tenMon || 'Không xác định'}</Descriptions.Item>
        <Descriptions.Item label="Thời gian làm bài">{deThi.thoiGianLamBai} phút</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo" span={2}>
          {deThi.ngayTao instanceof Date 
            ? deThi.ngayTao.toLocaleString() 
            : new Date(deThi.ngayTao).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Số lượng câu hỏi" span={2}>
          {deThi.danhSachCauHoi.length} câu
        </Descriptions.Item>
      </Descriptions>

      <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
        <Title level={5}>Danh sách câu hỏi</Title>
        <Table 
          columns={detailColumns}
          dataSource={deThi.danhSachCauHoi}
          rowKey={(record) => record.id || `question-${Math.random()}`}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 300 }}
        />
      </Space>
    </Modal>
  );
};

export default DeThiDetail;