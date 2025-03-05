import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Button, 
  Row, 
  Col, 
  Divider, 
  Table, 
  Space, 
  Checkbox, 
  Alert, 
  Tabs, 
  Typography,
  message
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { MonHoc, CauHoi, DeThi, MucDoKho, CauTrucDeThi, QuestionFilter } from './types';
import { ColumnType } from 'antd/lib/table';

const { TabPane } = Tabs;
const { Option } = Select;
const { Text } = Typography;

interface DeThiFormProps {
  visible: boolean;
  currentDeThi: DeThi | null;
  isEditing: boolean;
  subjects: MonHoc[];
  questionList: CauHoi[];
  onClose: () => void;
  onCreateTheoCauTruc: (values: any) => void;
  onCreateManual: (values: any) => void;
  loading: boolean;
}

const DeThiForm: React.FC<DeThiFormProps> = ({
  visible,
  currentDeThi,
  isEditing,
  subjects,
  questionList,
  onClose,
  onCreateTheoCauTruc,
  onCreateManual,
  loading
}) => {
  const [form] = Form.useForm();
  const [cauTrucForm] = Form.useForm();
  const [createMode, setCreateMode] = useState<'auto' | 'manual'>('auto');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [knowledgeBlocks, setKnowledgeBlocks] = useState<string[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<CauHoi[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<CauHoi[]>([]);
  const [questionFilters, setQuestionFilters] = useState<QuestionFilter>({ difficulty: null, knowledgeBlock: null });
  const [cauTrucErrors, setCauTrucErrors] = useState<{[key: string]: string}>({});
  const [availableCounts, setAvailableCounts] = useState<{[key: string]: number}>({});

  // Debug logs
  useEffect(() => {
    console.log("Danh sách môn học:", subjects);
    console.log("Danh sách câu hỏi:", questionList);
  }, [subjects, questionList]);

  useEffect(() => {
    if (visible) {
      if (isEditing && currentDeThi) {
        // Đặt giá trị form khi chỉnh sửa
        setSelectedSubject(currentDeThi.monHocId.toString());
        
        if (createMode === 'auto') {
          cauTrucForm.setFieldsValue({
            tenDeThi: currentDeThi.tenDeThi,
            monHocId: currentDeThi.monHocId.toString(),
            thoiGianLamBai: currentDeThi.thoiGianLamBai,
            cauTruc: currentDeThi.cauTrucDeThi,
          });
        } else {
          form.setFieldsValue({
            tenDeThi: currentDeThi.tenDeThi,
            monHocId: currentDeThi.monHocId.toString(),
            thoiGianLamBai: currentDeThi.thoiGianLamBai,
          });
          setSelectedQuestions(currentDeThi.danhSachCauHoi);
        }
      } else {
        // Reset form khi tạo mới
        cauTrucForm.resetFields();
        form.resetFields();
        setSelectedSubject('');
        setSelectedQuestions([]);
        setCauTrucErrors({});
      }
    }
  }, [visible, isEditing, currentDeThi, createMode, form, cauTrucForm]);

  useEffect(() => {
    if (selectedSubject) {
      const subject = subjects.find(s => s.id.toString() === selectedSubject);
      if (subject) {
        const blocks = Array.isArray(subject.khoiKienThuc) 
          ? subject.khoiKienThuc 
          : [subject.khoiKienThuc];
          
        setKnowledgeBlocks(blocks);
        
        // Lọc câu hỏi theo môn học đã chọn
        const filtered = questionList.filter(q => q.subjectId === selectedSubject);
        setFilteredQuestions(filtered);
        
        // Tính toán số lượng câu hỏi sẵn có cho mỗi combination
        calculateAvailableCounts(filtered);
      }
    }
  }, [selectedSubject, subjects, questionList]);

  const handleTabChange = (key: string) => {
    setCreateMode(key as 'auto' | 'manual');
  };

  const handleSubjectChange = (value: string) => {
    console.log("Môn học được chọn:", value);
    if (!value) return;
    
    setSelectedSubject(value);
    
    // Cập nhật giá trị trong cả hai form
    if (createMode === 'auto') {
      cauTrucForm.setFieldsValue({ monHocId: value });
    } else {
      form.setFieldsValue({ monHocId: value });
    }
    
    // Lấy thông tin môn học
    const subject = subjects.find(s => s.id.toString() === value);
    console.log("Thông tin môn học được chọn:", subject);
    
    if (subject) {
      // Xử lý trường hợp khoiKienThuc có thể là mảng hoặc chuỗi
      const blocks = Array.isArray(subject.khoiKienThuc) 
        ? subject.khoiKienThuc 
        : [subject.khoiKienThuc];
      
      console.log("Các khối kiến thức của môn học:", blocks);
      setKnowledgeBlocks(blocks);
    }
    
    // Lọc câu hỏi theo môn học đã chọn
    console.log("Lọc câu hỏi theo môn học:", value);
    console.log("Danh sách câu hỏi gốc:", questionList);
    
    const filtered = questionList.filter(q => {
      console.log(`Kiểm tra câu hỏi ${q.id}:`, q);
      console.log(`subjectId của câu hỏi: ${q.subjectId}, selectedSubject: ${value}`);
      return q.subjectId === value;
    });
    
    console.log("Kết quả lọc câu hỏi:", filtered.length, "câu hỏi phù hợp");
    setFilteredQuestions(filtered);
    
    // Tính toán số lượng câu hỏi sẵn có cho mỗi combination
    calculateAvailableCounts(filtered);
  };

  const handleFilterQuestions = (filters: QuestionFilter) => {
    console.log("Áp dụng bộ lọc:", filters);
    console.log("Môn học đã chọn:", selectedSubject);
    console.log("Danh sách câu hỏi gốc:", questionList);
    
    if (!selectedSubject) return;
    
    let filtered = questionList.filter(q => {
      console.log("Kiểm tra câu hỏi:", q);
      console.log("subjectId của câu hỏi:", q.subjectId);
      console.log("selectedSubject:", selectedSubject);
      return q.subjectId === selectedSubject;
    });
    
    console.log("Sau khi lọc theo môn học:", filtered);
    
    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
      console.log("Sau khi lọc theo mức độ:", filtered);
    }
    
    if (filters.knowledgeBlock) {
      filtered = filtered.filter(q => q.knowledgeBlock === filters.knowledgeBlock);
      console.log("Sau khi lọc theo khối kiến thức:", filtered);
    }
    
    setFilteredQuestions(filtered);
    setQuestionFilters(filters);
  };

  const handleQuestionSelect = (record: CauHoi, selected: boolean) => {
    if (selected) {
      setSelectedQuestions(prev => [...prev, record]);
    } else {
      setSelectedQuestions(prev => prev.filter(q => q.id !== record.id));
    }
  };

  const handleSelectAll = (selected: boolean, selectedRows: CauHoi[]) => {
    if (selected) {
      setSelectedQuestions(selectedRows);
    } else {
      setSelectedQuestions([]);
    }
  };

  const calculateAvailableCounts = (questions: CauHoi[]) => {
    const counts: {[key: string]: number} = {};
    
    Object.values(MucDoKho).forEach(level => {
      knowledgeBlocks.forEach(block => {
        const key = `${level}_${block}`;
        const count = questions.filter(q => 
          q.difficulty === level && 
          q.knowledgeBlock === block
        ).length;
        
        counts[key] = count;
      });
    });
    
    setAvailableCounts(counts);
    console.log("Số lượng câu hỏi có sẵn:", counts);
  };

  const validateCauTruc = (cauTruc: CauTrucDeThi[]) => {
    const errors: {[key: string]: string} = {};
    
    cauTruc.forEach((item, index) => {
      const key = `${item.mucDo}_${item.khoiKienThuc}`;
      const availableCount = availableCounts[key] || 0;
      
      if (item.soCau > availableCount) {
        errors[`cauTruc_${index}`] = `Không đủ câu hỏi! Chỉ có ${availableCount} câu ${item.mucDo} thuộc ${item.khoiKienThuc}`;
      }
    });
    
    setCauTrucErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const questionSelectionColumns: ColumnType<CauHoi>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: { showTitle: false },
    },
    {
      title: 'Mức độ',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      filters: Object.values(MucDoKho).map(level => ({ text: level, value: level })),
      onFilter: (value: any, record: CauHoi) => record.difficulty === value,
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'knowledgeBlock',
      key: 'knowledgeBlock',
      width: 150,
    },
  ];

  const handleCreateManual = (values: any) => {
    values.selectedQuestions = selectedQuestions;
    onCreateManual(values);
  };

  const handleCreateTheoCauTruc = (values: any) => {
    // Kiểm tra xem có đủ câu hỏi cho cấu trúc không
    if (!validateCauTruc(values.cauTruc)) {
      message.error('Không đủ câu hỏi để tạo đề thi theo cấu trúc đã chọn');
      return;
    }
    
    onCreateTheoCauTruc(values);
  };

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa đề thi" : "Tạo đề thi mới"}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Tabs defaultActiveKey="auto" onChange={handleTabChange}>
        <TabPane tab="Tạo theo cấu trúc" key="auto">
          <Form
            form={cauTrucForm}
            layout="vertical"
            onFinish={handleCreateTheoCauTruc}
          >
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="tenDeThi"
                  label="Tên đề thi"
                  rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
                >
                  <Input placeholder="Nhập tên đề thi" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="thoiGianLamBai"
                  label="Thời gian làm bài (phút)"
                  rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
                >
                  <InputNumber min={1} max={180} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="monHocId"
              label="Môn học"
              rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
            >
              <Select 
                placeholder="Chọn môn học" 
                onChange={handleSubjectChange}
                value={selectedSubject}
              >
                {subjects.map(subject => (
                  <Option 
                    key={subject.id?.toString() || `subject-${Math.random()}`} 
                    value={subject.id?.toString()}
                  >
                    {subject.tenMon}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Divider orientation="left">Cấu trúc đề thi</Divider>
            
            {selectedSubject ? (
              <Form.List name="cauTruc">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row gutter={16} key={key} style={{ marginBottom: 16 }}>
                        <Col span={7}>
                          <Form.Item
                            {...restField}
                            name={[name, 'mucDo']}
                            rules={[{ required: true, message: 'Chọn mức độ' }]}
                          >
                            <Select placeholder="Mức độ">
                              {Object.values(MucDoKho).map(level => (
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
                            <Select placeholder="Khối kiến thức">
                              {knowledgeBlocks.map(block => (
                                <Option key={block} value={block}>{block}</Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={5}>
                          <Form.Item
                            {...restField}
                            name={[name, 'soCau']}
                            rules={[{ required: true, message: 'Nhập số câu' }]}
                          >
                            <InputNumber 
                              placeholder="Số câu" 
                              min={1} 
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                          <MinusCircleOutlined 
                            onClick={() => remove(name)} 
                            style={{ marginRight: 8 }}
                          />
                          {cauTrucErrors[`cauTruc_${name}`] && (
                            <span style={{ color: 'red', fontSize: '12px' }}>
                              {cauTrucErrors[`cauTruc_${name}`]}
                            </span>
                          )}
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button 
                        type="dashed" 
                        onClick={() => add()} 
                        block 
                        icon={<PlusOutlined />}
                        disabled={!selectedSubject}
                      >
                        Thêm cấu trúc
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            ) : (
              <Alert
                message="Vui lòng chọn môn học trước khi tạo cấu trúc đề thi"
                type="info"
                showIcon
              />
            )}

            <Form.Item>
              <Space style={{ marginTop: 16 }}>
                <Button onClick={onClose}>
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  disabled={!selectedSubject}
                >
                  {isEditing ? 'Cập nhật' : 'Tạo đề thi'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </TabPane>
        
        <TabPane tab="Tạo thủ công" key="manual">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateManual}
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
              <Col span={8}>
                <Form.Item
                  name="monHocId"
                  label="Môn học"
                  rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
                >
                  <Select 
                    placeholder="Chọn môn học" 
                    onChange={handleSubjectChange}
                    value={selectedSubject}
                  >
                    {subjects.map(subject => (
                      <Option 
                        key={subject.id?.toString() || `subject-${Math.random()}`} 
                        value={subject.id?.toString()}
                      >
                        {subject.tenMon}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="thoiGianLamBai"
                  label="Thời gian làm bài (phút)"
                  rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
                >
                  <InputNumber min={1} max={180} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Chọn câu hỏi</Divider>

            <div style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Select
                    placeholder="Lọc theo mức độ"
                    style={{ width: '100%' }}
                    allowClear
                    onChange={(value) => handleFilterQuestions({ ...questionFilters, difficulty: value })}
                    disabled={!selectedSubject}
                  >
                    {Object.values(MucDoKho).map(level => (
                      <Option key={level} value={level}>{level}</Option>
                    ))}
                  </Select>
                </Col>
                <Col span={8}>
                  <Select
                    placeholder="Lọc theo khối kiến thức"
                    style={{ width: '100%' }}
                    allowClear
                    onChange={(value) => handleFilterQuestions({ ...questionFilters, knowledgeBlock: value })}
                    disabled={!selectedSubject}
                  >
                    {knowledgeBlocks.map(block => (
                      <Option key={block} value={block}>{block}</Option>
                    ))}
                  </Select>
                </Col>
                <Col span={8}>
                  <Text strong>Đã chọn: {selectedQuestions.length} câu hỏi</Text>
                </Col>
              </Row>
            </div>
            
            <Table
              columns={questionSelectionColumns}
              dataSource={filteredQuestions}
              rowKey={(record) => record.id || `question-${Math.random()}`}
              pagination={{ pageSize: 5 }}
              size="small"
              loading={loading && selectedSubject !== ''}
              locale={{ emptyText: selectedSubject ? 'Không có câu hỏi' : 'Vui lòng chọn môn học' }}
              rowSelection={{
                selectedRowKeys: selectedQuestions.map(q => q.id || ''),
                onSelect: handleQuestionSelect,
                onSelectAll: handleSelectAll
              }}
            />

            <Form.Item>
              <Space style={{ marginTop: 16 }}>
                <Button onClick={onClose}>
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  disabled={selectedQuestions.length === 0}
                >
                  {isEditing ? 'Cập nhật' : 'Tạo đề thi'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default DeThiForm;