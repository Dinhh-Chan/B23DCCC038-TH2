import React from "react";
import { Modal } from "antd";

interface DeleteMonHocModalProps {
  visible: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteMonHocModal = ({ visible, onDelete, onCancel }: DeleteMonHocModalProps) => {
  return (
    <Modal
      title="Xóa môn học"
      visible={visible}
      onOk={onDelete}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <p>Bạn có chắc chắn muốn xóa môn học này?</p>
    </Modal>
  );
};

export default DeleteMonHocModal;
