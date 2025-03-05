import React, { useState } from "react";
import { Card, Button, List, Typography, Modal } from "antd";
import { SmileOutlined, TrophyOutlined, FrownOutlined } from "@ant-design/icons";
import "./Bai1.css";

const choices = ["Kéo", "Búa", "Bao"];
const images = {
  Kéo: "https://cdn-icons-png.flaticon.com/128/3076/3076104.png",
  Búa: "https://cdn-icons-png.flaticon.com/128/3076/3076102.png",
  Bao: "https://cdn-icons-png.flaticon.com/128/3076/3076103.png",
};

const getResult = (player: string, computer: string) => {
  if (player === computer) return "Hòa!";
  if (
    (player === "Kéo" && computer === "Bao") ||
    (player === "Búa" && computer === "Kéo") ||
    (player === "Bao" && computer === "Búa")
  ) {
    return "Bạn thắng!";
  }
  return "Bạn thua!";
};

const App: React.FC = () => {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultModalType, setResultModalType] = useState<'win' | 'lose' | 'draw'>('draw');

  const handleClick = (choice: string) => {
    const computer = choices[Math.floor(Math.random() * choices.length)];
    const gameResult = getResult(choice, computer);

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(gameResult);

    // Determine modal type based on result
    if (gameResult === "Bạn thắng!") {
      setResultModalType('win');
    } else if (gameResult === "Bạn thua!") {
      setResultModalType('lose');
    } else {
      setResultModalType('draw');
    }

    // Show result modal
    setResultModalVisible(true);

    // Add to history
  };

  const renderModalContent = () => {
    switch (resultModalType) {
      case 'win':
        return (
          <div className="result-modal-content win">
            <TrophyOutlined style={{ fontSize: '64px', color: 'gold' }} />
            <Typography.Title level={3}>Chúc mừng bạn chiến thắng!</Typography.Title>
            <p>Bạn đã xuất sắc đánh bại máy tính</p>
          </div>
        );
      case 'lose':
        return (
          <div className="result-modal-content lose">
            <FrownOutlined style={{ fontSize: '64px', color: 'red' }} />
            <Typography.Title level={3}>Bạn đã thua!</Typography.Title>
            <p>Máy tính đã chiến thắng. Hãy thử lại!</p>
          </div>
        );
      default:
        return (
          <div className="result-modal-content draw">
            <SmileOutlined style={{ fontSize: '64px', color: 'blue' }} />
            <Typography.Title level={3}>Hòa!</Typography.Title>
            <p>Không phân thắng bại</p>
          </div>
        );
    }
  };

  return (
    <div className="container">
      <h1>Trò chơi Kéo - Búa - Bao</h1>
      <div className="choices">
        {choices.map((choice) => (
          <Card
            key={choice}
            hoverable
            className={`choice-card ${playerChoice === choice ? 'selected' : ''}`}
            onClick={() => handleClick(choice)}
          >
            <img 
              src={images[choice]} 
              alt={choice} 
              className={`choice-image ${playerChoice === choice ? 'pulse-animation' : ''}`} 
            />
            <p>{choice}</p>
          </Card>
        ))}
      </div>

      {/* Result Modal */}
      <Modal
        title="Kết quả"
        visible={resultModalVisible}
        onOk={() => setResultModalVisible(false)}
        onCancel={() => setResultModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setResultModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {renderModalContent()}
      </Modal>

      {playerChoice && computerChoice && (
        <div className="result">
          <Typography.Title level={3}>
            Bạn chọn: {playerChoice} | Máy chọn: {computerChoice}
          </Typography.Title>
          <Typography.Text strong>{result}</Typography.Text>
        </div>
      )}
    </div>
  );
};

export default App;