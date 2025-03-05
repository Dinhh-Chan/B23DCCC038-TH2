import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  message,
  Popconfirm,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const MonHoc = () => {
  const [monHocList, setMonHocList] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  // Lấy dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const savedData = localStorage.getItem('monHocList');
    if (savedData) {
      setMonHocList(JSON.parse(savedData));
    } else {
      // Dữ liệu mẫu nếu chưa có trong localStorage
      const data = [
        {
          id: 1,
          maMon: 'CS101',
          tenMon: 'Lập trình cơ bản',
          soTinChi: 3,
          khoiKienThuc: 'Cơ sở ngành',
        },
      ];
      setMonHocList(data);
      localStorage.setItem('monHocList', JSON.stringify(data));
    }
  }, []);

  // Lưu vào localStorage mỗi khi monHocList thay đổi
  useEffect(() => {
    localStorage.setItem('monHocList', JSON.stringify(monHocList));
  }, [monHocList]);

  const columns = [
    {
      title: 'Mã môn',
      dataIndex: 'maMon',
      key: 'maMon',
    },
    {
      title: 'Tên môn',
      dataIndex: 'tenMon',
      key: 'tenMon',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      key: 'soTinChi',
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'khoiKienThuc',
      key: 'khoiKienThuc',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    addForm.resetFields();
    setIsAddModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    editForm.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleDelete = (id) => {
    setMonHocList(monHocList.filter(item => item.id !== id));
    message.success('Xóa môn học thành công');
  };

  const handleAddModalOk = () => {
    addForm.validateFields().then(values => {
      const newId = Math.max(...monHocList.map(item => item.id), 0) + 1;
      setMonHocList([...monHocList, { ...values, id: newId }]);
      message.success('Thêm môn học thành công');
      setIsAddModalVisible(false);
      addForm.resetFields();
    });
  };

  const handleEditModalOk = () => {
    editForm.validateFields().then(values => {
      setMonHocList(monHocList.map(item =>
        item.id === editingId ? { ...values, id: editingId } : item
      ));
      message.success('Cập nhật môn học thành công');
      setIsEditModalVisible(false);
      editForm.resetFields();
      setEditingId(null);
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm môn học
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={monHocList}
        rowKey="id"
      />

      {/* Modal Thêm môn học */}
      <Modal
        title="Thêm môn học"
        open={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
        }}
      >
        <Form
          form={addForm}
          layout="vertical"
        >
          <Form.Item
            name="maMon"
            label="Mã môn"
            rules={[{ required: true, message: 'Vui lòng nhập mã môn' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tenMon"
            label="Tên môn"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="soTinChi"
            label="Số tín chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>

          <Form.Item
            name="khoiKienThuc"
            label="Khối kiến thức"
            rules={[{ required: true, message: 'Vui lòng nhập khối kiến thức' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Sửa môn học */}
      <Modal
        title="Sửa môn học"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields();
          setEditingId(null);
        }}
      >
        <Form
          form={editForm}
          layout="vertical"
        >
          <Form.Item
            name="maMon"
            label="Mã môn"
            rules={[{ required: true, message: 'Vui lòng nhập mã môn' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tenMon"
            label="Tên môn"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="soTinChi"
            label="Số tín chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>

          <Form.Item
            name="khoiKienThuc"
            label="Khối kiến thức"
            rules={[{ required: true, message: 'Vui lòng nhập khối kiến thức' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MonHoc;
