import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";

interface MonHoc {
  id: number;
  maMon: string;
  tenMon: string;
  soTinChi: number;
  khoiKienThuc: string;
}

interface UpdateMonHocModalProps {
  visible: boolean;
  onUpdate: (values: Omit<MonHoc, 'id'>) => void;
  onCancel: () => void;
  initialData: MonHoc | null;
}

const UpdateMonHocModal = ({ visible, onUpdate, onCancel, initialData }: UpdateMonHocModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialData);
  }, [initialData, form]);

  return (
    <Modal
      title="Sửa môn học"
      visible={visible}
      onOk={() => {
        form.validateFields().then((values) => {
          form.resetFields();
          onUpdate(values);
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

export default UpdateMonHocModal;
