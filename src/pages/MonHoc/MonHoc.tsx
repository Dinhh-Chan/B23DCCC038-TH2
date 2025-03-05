import React, { useState, useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import CreateMonHocModal from "./CreateMonHocModal";
import UpdateMonHocModal from "./UpdateMonHocModal";
import DeleteMonHocModal from "./DeleteMonHocModal";

interface MonHoc {
  id: number;
  maMon: string;
  tenMon: string;
  soTinChi: number;
  khoiKienThuc: string;
}

const MonHoc = () => {
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [selectedMonHoc, setSelectedMonHoc] = useState<MonHoc | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("monHocList");
    if (savedData) {
      setMonHocList(JSON.parse(savedData));
    } else {
      const data = [
        {
          id: 1,
          maMon: "CS101",
          tenMon: "Lập trình cơ bản",
          soTinChi: 3,
          khoiKienThuc: "Cơ sở ngành",
        },
        {
            id: 2,
            maMon: "CN011", 
            tenMon: "Lập trình hướng đối tượng", 
            soTinChi: 3, 
            khoiKienThuc: "Cơ sở ngành"
        },
        {
            id: 3,
            maMon: "CS201", 
            tenMon: "Cấu trúc dữ liệu và giải thuật", 
            soTinChi: 4, 
            khoiKienThuc: "Chuyên ngành"
        },
        {
            id: 4,
            maMon: "CS202", 
            tenMon: "Cơ sở dữ liệu", 
            soTinChi: 3, 
            khoiKienThuc: "Chuyên ngành"
        },
        {
            id: 5,
            maMon: "CN301", 
            tenMon: "Mạng máy tính", 
            soTinChi: 3, 
            khoiKienThuc: "Chuyên ngành"
        },
        {
            id: 6,
            maMon: "AI401", 
            tenMon: "Trí tuệ nhân tạo", 
            soTinChi: 4, 
            khoiKienThuc: "Chuyên sâu"
        },
        {
            id: 7,
            maMon: "WD501", 
            tenMon: "Phát triển ứng dụng web", 
            soTinChi: 3, 
            khoiKienThuc: "Chuyên ngành"
        },
        {
            id: 8,
            maMon: "AN601", 
            tenMon: "An ninh mạng", 
            soTinChi: 3, 
            khoiKienThuc: "Chuyên sâu"
        },
        {
            id: 9,
            maMon: "ML701", 
            tenMon: "Học máy", 
            soTinChi: 4, 
            khoiKienThuc: "Chuyên sâu"
        },
        {
            id: 10,
            maMon: "OS501", 
            tenMon: "Hệ điều hành", 
            soTinChi: 3, 
            khoiKienThuc: "Chuyên ngành"
        }
        ];
        setMonHocList(data);
        localStorage.setItem("monHocList", JSON.stringify(data));
      }
    }, []);

  useEffect(() => {
    localStorage.setItem("monHocList", JSON.stringify(monHocList));
  }, [monHocList]);

  const columns = [
    { title: "Mã môn", dataIndex: "maMon", key: "maMon" },
    { title: "Tên môn", dataIndex: "tenMon", key: "tenMon" },
    { title: "Số tín chỉ", dataIndex: "soTinChi", key: "soTinChi" },
    { title: "Khối kiến thức", dataIndex: "khoiKienThuc", key: "khoiKienThuc" },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: MonHoc) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = (newMonHoc: Omit<MonHoc, 'id'>) => {
    const newId = Math.max(...monHocList.map((item) => item.id), 0) + 1;
    setMonHocList([...monHocList, { ...newMonHoc, id: newId }]);
    message.success("Thêm môn học thành công");
    setIsAddModalVisible(false);
  };

  const handleEdit = (monHoc: MonHoc) => {
    setSelectedMonHoc(monHoc);
    setIsEditModalVisible(true);
  };

  const handleUpdate = (updatedMonHoc: Omit<MonHoc, 'id'>) => {
    setMonHocList(monHocList.map((item) => (item.id === selectedMonHoc?.id ? { ...updatedMonHoc, id: selectedMonHoc.id } : item)));
    message.success("Cập nhật môn học thành công");
    setIsEditModalVisible(false);
  };

  const handleDelete = (monHoc: MonHoc) => {
    setSelectedMonHoc(monHoc);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    setMonHocList(monHocList.filter((item) => item.id !== selectedMonHoc?.id));
    message.success("Xóa môn học thành công");
    setIsDeleteModalVisible(false);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)}>
        Thêm môn học
      </Button>
      <Table columns={columns} dataSource={monHocList} rowKey="id" />

      <CreateMonHocModal visible={isAddModalVisible} onCreate={handleAdd} onCancel={() => setIsAddModalVisible(false)} />
      <UpdateMonHocModal visible={isEditModalVisible} initialData={selectedMonHoc} onUpdate={handleUpdate} onCancel={() => setIsEditModalVisible(false)} />
      <DeleteMonHocModal visible={isDeleteModalVisible} onDelete={confirmDelete} onCancel={() => setIsDeleteModalVisible(false)} />
    </div>
  );
};

export default MonHoc;
