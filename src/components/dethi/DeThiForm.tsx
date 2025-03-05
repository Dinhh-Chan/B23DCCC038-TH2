import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Card, 
  Typography, 
  Divider, 
  InputNumber, 
  Space, 
  Table,
  Row,
  Col,
  message
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DeThiService } from '../../services/dethi/dethi.service';
import { CauTrucDeThi, DeThi } from '../../types/dethi.types';
import { MonHoc, DifficultyLevel } from '../../types/question.types';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

interface DeThiFormProps {
  isEdit?: boolean;
}

export const DeThiForm: React.FC<DeThiFormProps> = ({ isEdit = false }) => {
  const [form] = Form.useForm();
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [knowledgeBlocks, setKnowledgeBlocks] = useState<string[]>([]);
  const [selectedMonHoc, setSelectedMonHoc] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [deThi, setDeThi] = useState<DeThi | null>(null);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const deThiService = new DeThiService();

  useEffect(() => {
    loadMonHoc();
    if (isEdit && id) {
      loadDeThi(id);
    }
  }, [isEdit, id]);

  const loadMonHoc = () => {
    try {
      const monHocData = localStorage.getItem('monHocList');
      if (monHocData) {
        const monHocArr: MonHoc[] = JSON.parse(monHocData);
        setMonHocList(monHocArr);
      } else {
        setMonHocList([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách môn học:', error);
    }
  };

  const loadDeThi = (deThiId: string) => {
    setLoading(true);
    try {
      const deThi = deThiService.getDeThi(deThiId);
      if (deThi) {
        setDeThi(deThi);
        setSelectedMonHoc(deThi.monHocId);
        loadKnowledgeBlocks(deThi.monHocId);
        
        form.setFieldsValue({
          tenDeThi: deThi.tenDeThi,
          monHocId: deThi.monHocId,
          thoiGianLamBai: deThi.thoiGianLamBai,
          cauTrucDeThi: deThi.cauTrucDeThi
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải đề thi:', error);
      message.error('Không thể tải thông tin đề thi');
    } finally {
      setLoading(false);
    }
  };

  const loadKnowledgeBlocks = (monHocId: string) => {
    try {
      const monHoc = monHocList.find(mh => mh.tenMon === monHocId);
      if (monHoc) {
        setKnowledgeBlocks([monHoc.khoiKienThuc]);
      } else {
        setKnowledgeBlocks([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải khối kiến thức:', error);
    }
  };

  const handleMonHocChange = (value: string) => {
    setSelectedMonHoc(value);
    loadKnowledgeBlocks(value);
    form.setFieldsValue({ cauTrucDeThi: [] });
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    try {
      const deThiData = {
        tenDeThi: values.tenDeThi,
        monHocId: values.monHocId,
        thoiGianLamBai: values.thoiGianLamBai,
        cauTrucDeThi: values.cauTrucDeThi as CauTrucDeThi[]
      };

      if (isEdit && id) {
        deThiService.updateDeThi(id, deThiData);
        message.success('Cập nhật đề thi thành công');
      } else {
        deThiService.createDeThi(deThiData as Omit<DeThi, 'id' | 'ngayTao' | 'danhSachCauHoi'>);
        message.success('Tạo đề thi thành công');
      }
      navigate('/dethi');
    } catch (error) {
      console.error('Lỗi khi lưu đề thi:', error);
      message.error('Có lỗi xảy ra khi lưu đề thi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={4}>{isEdit ? 'Cập nhật đề thi' : 'Tạo đề thi mới'}</Title>
        <Divider />
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            thoiGianLamBai: 60,
            cauTrucDeThi: [{}]
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tenDeThi"
                label="Tên đề thi"
                rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
              >
                <Input placeholder="Nhập tên đề thi" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="monHocId"
                label="Môn học"
                rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
              >
                <Select 
                  placeholder="Chọn môn học"
                  onChange={handleMonHocChange}
                  disabled={loading}
                >
                  {monHocList.map(monHoc => (
                    <Option key={monHoc.id} value={monHoc.tenMon}>{monHoc.tenMon}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="thoiGianLamBai"
                label="Thời gian làm bài (phút)"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian làm bài' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Cấu trúc đề thi</Divider>
          
          <Form.List name="cauTrucDeThi">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={16} key={key} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'mucDo']}
                        rules={[{ required: true, message: 'Chọn mức độ khó' }]}
                      >
                        <Select placeholder="Mức độ khó">
                          {Object.values(DifficultyLevel).map(level => (
                            <Option key={level} value={level}>{level}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'khoiKienThuc']}
                        rules={[{ required: true, message: 'Chọn khối kiến thức' }]}
                      >
                        <Select placeholder="Khối kiến thức" disabled={!selectedMonHoc}>
                          {knowledgeBlocks.map(block => (
                            <Option key={block} value={block}>{block}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'soLuong']}
                        rules={[{ required: true, message: 'Nhập số lượng' }]}
                      >
                        <InputNumber 
                          placeholder="Số lượng câu hỏi" 
                          min={1} 
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <MinusCircleOutlined 
                        onClick={() => remove(name)} 
                        style={{ marginTop: 8 }}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                    disabled={!selectedMonHoc}
                  >
                    Thêm nhóm câu hỏi
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Space>
              <Button onClick={() => navigate('/dethi')}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEdit ? 'Cập nhật' : 'Tạo đề thi'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};