import React, { useState } from 'react';
import { Card, Input, Button, Typography, Space, Alert, Divider, message, Row, Col } from 'antd';
import { SwapRightOutlined, CopyOutlined, CalculatorOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AddPrefixes2Expression: React.FC = () => {
  const [inputStr, setInputStr] = useState('');
  const [resultStr, setResultStr] = useState('');

  const [prefix, setPrefix] = useState('DDL');

  const handleTransform = () => {
    if (!inputStr) {
      setResultStr('');
      return;
    }

    if (!/^[\d\s+-]+$/.test(inputStr)) {
      message.error("Input contains invalid characters. Only numbers, +, and - are allowed.");
      setResultStr('');
      return;
    }

    const parts = inputStr.split(/([+-])/);

    const transformedParts = parts.map(part => {
      const trimmed = part.trim();
      if (!trimmed) return '';

      if (trimmed === '+' || trimmed === '-') {
        return ` ${trimmed} `;
      }

      if (/^\d+$/.test(trimmed)) {

        const currentPrefix = prefix.trim() ? `${prefix.trim()}_` : '';
        return `${currentPrefix}${trimmed}`;
      }

      return trimmed;
    });

    setResultStr(transformedParts.join('').trim());
  };

  const handleCopy = () => {
    if (resultStr) {
      navigator.clipboard.writeText(resultStr);
      message.success("Copied to clipboard!");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        <CalculatorOutlined /> Sequence Generator
      </Title>

      <Card
        bordered={false}
        style={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderRadius: 16,
          background: 'linear-gradient(to bottom right, #ffffff, #f9f9f9)'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>

          <Row gutter={16}>
            <Col span={8}>
              <Text strong><SettingOutlined /> Prefix (Tiền tố)</Text>
              <Input
                placeholder="e.g. DDL, ABC"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                style={{ marginTop: 8, borderRadius: 8 }}
              />
            </Col>
            <Col span={16}>
              <Text strong>Input Sequence</Text>
              <Input
                placeholder="e.g. 1+2-3"
                value={inputStr}
                onChange={(e) => setInputStr(e.target.value)}
                onPressEnter={handleTransform}
                style={{ marginTop: 8, borderRadius: 8 }}
              />
            </Col>
          </Row>

          <Button
            type="primary"
            size="large"
            block
            icon={<SwapRightOutlined />}
            onClick={handleTransform}
            style={{
              height: 50,
              fontSize: 18,
              borderRadius: 8,
              background: 'linear-gradient(90deg, #1677ff 0%, #0050b3 100%)',
              border: 'none',
              marginTop: 8
            }}
          >
            Generate
          </Button>

          {resultStr && (
            <>
              <Divider />
              <div style={{ position: 'relative' }}>
                <Text strong style={{ fontSize: 16 }}>Result</Text>
                <Alert
                  message={
                    <Text code style={{ fontSize: 18, display: 'block', padding: 8 }}>
                      {resultStr}
                    </Text>
                  }
                  type="success"
                  style={{
                    marginTop: 8,
                    borderRadius: 8,
                    border: '1px solid #b7eb8f'
                  }}
                />
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 38,
                    color: '#52c41a'
                  }}
                >
                  Copy
                </Button>
              </div>
            </>
          )}
        </Space>
      </Card>

      <div style={{ textAlign: 'center', marginTop: 24, color: '#888' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Tùy chỉnh tiền tố và tự động định dạng khoảng cách toán tử.
        </Text>
      </div>
    </div>
  );
};

export default AddPrefixes2Expression;