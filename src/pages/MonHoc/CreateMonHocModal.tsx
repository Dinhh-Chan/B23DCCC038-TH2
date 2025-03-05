import React from "react";
import { Modal, Form, Input, InputNumber } from "antd";

interface MonHoc {
  id: number;
  maMon: string;
  tenMon: string;
  soTinChi: number;
  khoiKienThuc: string;
}

interface CreateMonHocModalProps {
  visible: boolean;
  onCreate: (values: Omit<MonHoc, 'id'>) => void;
  onCancel: () => void;
}

const CreateMonHocModal = ({ visible, onCreate, onCancel }: CreateMonHocModalProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Thêm môn học"
      visible={visible}
      onOk={() => {
        form.validateFields().then((values) => {
          form.resetFields();
          onCreate(values);
        });
      }}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="maMon"
          label="Mã môn"
          rules={[{ required: true, message: "Vui lòng nhập mã môn" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="tenMon"
          label="Tên môn"
          rules={[{ required: true, message: "Vui lòng nhập tên môn" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="soTinChi"
          label="Số tín chỉ"
          rules={[{ required: true, message: "Vui lòng nhập số tín chỉ" }]}
        >
          <InputNumber min={1} max={10} />
        </Form.Item>

        <Form.Item
          name="khoiKienThuc"
          label="Khối kiến thức"
          rules={[{ required: true, message: "Vui lòng nhập khối kiến thức" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMonHocModal;
