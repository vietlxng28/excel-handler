import React, { useState } from 'react';
import { Button, Card, message, Typography, Space, Input, Row } from 'antd';
import { DownloadOutlined, ClearOutlined, FormatPainterOutlined } from '@ant-design/icons';
import { callAPI } from '../api/apiService';
import { ENDPOINT } from '../api/apiConfig';

const { Text } = Typography;
const { TextArea } = Input;

const Json2Excel: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFormatJson = () => {
    try {
      if (!jsonInput.trim()) return;
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      message.success('Đã format JSON!');
    } catch (error) {
      message.error('JSON không hợp lệ!');
    }
  };

  const handleClear = () => {
    setJsonInput('');
  };

  const handleDownload = async () => {
    if (!jsonInput.trim()) {
      message.warning('Vui lòng nhập JSON!');
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData)) {
        message.warning('JSON phải là một mảng các đối tượng (Array of Objects)!');
        return;
      }
    } catch (error) {
      message.error('JSON không đúng định dạng!');
      return;
    }

    setLoading(true);
    try {

      const response = await callAPI(
        { ...ENDPOINT.JSON_TO_EXCEL, responseType: 'blob' } as any,
        parsedData
      );

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success('Download thành công!');
    } catch (error: any) {
      console.error(error);
      message.error(error.message || 'Có lỗi xảy ra khi download!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card title="Json To Excel Converter" bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Nhập JSON (Array of Objects) vào bên dưới:</Text>
            <Space>
              <Button icon={<FormatPainterOutlined />} onClick={handleFormatJson}>Format JSON</Button>
              <Button icon={<ClearOutlined />} onClick={handleClear} danger>Xóa</Button>
            </Space>
          </div>

          <TextArea
            rows={15}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[ {"name": "A", "age": 20}, {"name": "B", "age": 25} ]'
            style={{ fontFamily: 'Consolas, monospace', fontSize: '14px', backgroundColor: '#f9f9f9' }}
          />

          <Row justify="end">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              onClick={handleDownload}
              loading={loading}
              disabled={!jsonInput.trim()}
            >
              Chuyển đổi & Download Excel
            </Button>
          </Row>

        </Space>
      </Card>
    </div>
  );
};

export default Json2Excel;
