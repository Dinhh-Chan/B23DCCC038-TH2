import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Table, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Card, 
  Row, 
  Col, 
  Tag, 
  Typography, 
  Spin, 
  Empty 
} from 'antd';
import { Question, DifficultyLevel, MonHoc } from '../../types/question.types';
import { QuestionService } from '../../services/question/question.service';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const questionService = new QuestionService();

export const HomePage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    subjectId: '',
    difficulty: '' as DifficultyLevel | '',
    knowledgeBlock: ''
  });
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [knowledgeBlocks, setKnowledgeBlocks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();
  const [selectedSubject, setSelectedSubject] = useState<MonHoc | null>(null);

  useEffect(() => {
    loadQuestions();
    loadFilterOptions();
  }, []);

  // Theo dõi thay đổi của subjectId trong form
  useEffect(() => {
    const subjectId = form.getFieldValue('subjectId');
    
    if (subjectId) {
      const subject = monHocList.find(m => m.tenMon === subjectId);
      setSelectedSubject(subject || null);
      
      // Nếu đã chọn môn học, tự động cập nhật khối kiến thức
      if (subject) {
        form.setFieldsValue({ knowledgeBlock: subject.khoiKienThuc });
      } else {
        form.setFieldsValue({ knowledgeBlock: '' });
      }
    } else {
      setSelectedSubject(null);
      form.setFieldsValue({ knowledgeBlock: '' });
    }
  }, [form.getFieldValue('subjectId'), monHocList]);

  const loadQuestions = () => {
    setIsLoading(true);
    try {
      const filterParams = {
        ...(filters.subjectId ? { subjectId: filters.subjectId } : {}),
        ...(filters.difficulty ? { difficulty: filters.difficulty as DifficultyLevel } : {}),
        ...(filters.knowledgeBlock ? { knowledgeBlock: filters.knowledgeBlock } : {})
      };
      
      const allQuestions = questionService.searchQuestions(filterParams);
      setQuestions(allQuestions);
    } catch (error) {
      console.error('Lỗi khi tải câu hỏi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilterOptions = () => {
    try {
      // Lấy danh sách môn học từ localStorage
      const monHocData = localStorage.getItem('monHocList');
      if (monHocData) {
        const monHocArr: MonHoc[] = JSON.parse(monHocData);
        setMonHocList(monHocArr);
        
        // Lấy danh sách khối kiến thức từ dữ liệu môn học
        const uniqueKnowledgeBlocks = [...new Set(monHocArr.map(mh => mh.khoiKienThuc))].filter(Boolean);
        setKnowledgeBlocks(uniqueKnowledgeBlocks);
      } else {
        setMonHocList([]);
        setKnowledgeBlocks([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải tùy chọn lọc:', error);
    }
  };

  const handleAddNew = () => {
    console.log("Đang mở form thêm mới");
    setSelectedQuestion(null);
    form.resetFields();
    setIsFormOpen(true);
  };

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    
    // Tìm môn học tương ứng từ ID
    const subject = monHocList.find(m => m.tenMon === question.subjectId);
    setSelectedSubject(subject || null);
    
    form.setFieldsValue({
      content: question.content,
      subjectId: question.subjectId,
      difficulty: question.difficulty,
      knowledgeBlock: question.knowledgeBlock
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa câu hỏi này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        try {
          questionService.deleteQuestion(id);
          loadQuestions();
        } catch (error) {
          console.error('Lỗi khi xóa câu hỏi:', error);
          Modal.error({
            title: 'Lỗi',
            content: 'Không thể xóa câu hỏi. Vui lòng thử lại sau.'
          });
        }
      }
    });
  };

  const handleSubmit = (values: any) => {
    try {
      if (selectedQuestion) {
        questionService.updateQuestion(selectedQuestion.id, values);
      } else {
        questionService.createQuestion(values as Omit<Question, 'id' | 'createdAt' | 'updatedAt'>);
      }
      setIsFormOpen(false);
      loadQuestions();
    } catch (error) {
      console.error('Lỗi khi lưu câu hỏi:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể lưu câu hỏi. Vui lòng thử lại sau.'
      });
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      subjectId: '',
      difficulty: '',
      knowledgeBlock: ''
    });
  };

  const applyFilters = () => {
    loadQuestions();
  };

  const handleSubjectChange = (value: string) => {
    // Tìm môn học được chọn
    const subject = monHocList.find(m => m.tenMon === value);
    setSelectedSubject(subject || null);
    
    // Cập nhật form để sử dụng khối kiến thức của môn học
    if (subject) {
      form.setFieldsValue({ knowledgeBlock: subject.khoiKienThuc });
    } else {
      form.setFieldsValue({ knowledgeBlock: '' });
    }
  };

  const columns = [
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      width: '40%',
      render: (text: string) => (
        <div style={{ maxHeight: '100px', overflow: 'auto' }}>
          {text}
        </div>
      )
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      width: '15%'
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'knowledgeBlock',
      key: 'knowledgeBlock',
      width: '15%'
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: '10%',
      render: (difficulty: DifficultyLevel) => {
        let color = 'green';
        if (difficulty === DifficultyLevel.MEDIUM) {
          color = 'orange';
        } else if (difficulty === DifficultyLevel.HARD) {
          color = 'red';
        }
        return (
          <Tag color={color}>{difficulty}</Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '15%',
      render: (text: string, record: Question) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="question-bank-container" style={{ padding: '20px' }}>
      <Title level={2}>Ngân hàng câu hỏi</Title>

      <Row justify="end" style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddNew}>
          Thêm câu hỏi mới
        </Button>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="Môn học">
              <Select
                value={filters.subjectId}
                onChange={(value) => handleFilterChange('subjectId', value)}
                style={{ width: '100%' }}
                placeholder="Tất cả môn học"
                allowClear
              >
                {monHocList.map(monHoc => (
                  <Option key={monHoc.id} value={monHoc.tenMon}>{monHoc.tenMon}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Độ khó">
              <Select
                value={filters.difficulty}
                onChange={(value) => handleFilterChange('difficulty', value)}
                style={{ width: '100%' }}
                placeholder="Tất cả mức độ"
                allowClear
              >
                {Object.values(DifficultyLevel).map(level => (
                  <Option key={level} value={level}>{level}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Khối kiến thức">
              <Select
                value={filters.knowledgeBlock}
                onChange={(value) => handleFilterChange('knowledgeBlock', value)}
                style={{ width: '100%' }}
                placeholder="Tất cả khối kiến thức"
                allowClear
              >
                {knowledgeBlocks.map(block => (
                  <Option key={block} value={block}>{block}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end">
          <Space>
            <Button onClick={resetFilters}>Đặt lại</Button>
            <Button type="primary" onClick={applyFilters}>Áp dụng</Button>
          </Space>
        </Row>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Text>Tổng số câu hỏi: <Text strong>{questions.length}</Text></Text>
          {(filters.subjectId || filters.difficulty || filters.knowledgeBlock) && (
            <Text type="secondary">
              Đang lọc theo: {filters.subjectId && <span style={{ marginRight: 8 }}>Môn học: {filters.subjectId}</span>}
              {filters.difficulty && <span style={{ marginRight: 8 }}>Độ khó: {filters.difficulty}</span>}
              {filters.knowledgeBlock && <span>Khối kiến thức: {filters.knowledgeBlock}</span>}
            </Text>
          )}
        </Row>
      </Card>

      <Spin spinning={isLoading}>
        {questions.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={questions} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Card>
            <Empty
              description="Không tìm thấy câu hỏi nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={handleAddNew}>
                Thêm câu hỏi đầu tiên
              </Button>
            </Empty>
          </Card>
        )}
      </Spin>

      <Modal
        title={selectedQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
        visible={isFormOpen} 
        onCancel={() => setIsFormOpen(false)}
        footer={null}
        width={800}
        destroyOnClose={true}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            difficulty: DifficultyLevel.MEDIUM
          }}
        >
          <Form.Item
            name="content"
            label="Nội dung câu hỏi"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
          >
            <TextArea rows={4} placeholder="Nhập nội dung câu hỏi..." />
          </Form.Item>

          <Form.Item
            name="subjectId"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select 
              placeholder="Chọn môn học" 
              onChange={handleSubjectChange}
            >
              {monHocList.map(monHoc => (
                <Option key={monHoc.id} value={monHoc.tenMon}>{monHoc.tenMon}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="Mức độ khó"
            rules={[{ required: true, message: 'Vui lòng chọn mức độ khó' }]}
          >
            <Select placeholder="Chọn mức độ khó">
              {Object.values(DifficultyLevel).map(level => (
                <Option key={level} value={level}>{level}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="knowledgeBlock"
            label="Khối kiến thức"
            rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
          >
            <Select 
              placeholder="Chọn khối kiến thức"
              disabled={!selectedSubject}
            >
              {selectedSubject && (
                <Option value={selectedSubject.khoiKienThuc}>
                  {selectedSubject.khoiKienThuc}
                </Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item>
            <Row justify="end">
              <Space>
                <Button onClick={() => setIsFormOpen(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {selectedQuestion ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Space>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HomePage;