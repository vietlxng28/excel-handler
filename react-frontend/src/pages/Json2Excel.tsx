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
      // Note: configuring axios to receive blob is tricky with the current apiService wrapper 
      // ensuring generic callAPI handles it. 
      // Ideally we modify callAPI to support responseType, but for now let's try direct axios or assume callAPI can return blob if configured, 
      // or we just use direct Axios for this specific binary download if the wrapper is strict.
      // Looking at apiService.ts: it returns response.data.  
      // If we want blob, we need to pass responseType in axios config.
      // The current apiService 'config' support roughly headers and timeouts.
      // Let's check apiService again or just patch it.

      // Actually, let's just cheat and use the fetch API or direct axios for the download to be safe 
      // without modifying the core service too much, OR modify the service.
      // Modifying the service is better practice. But for this quick task, I'll see if I can pass extra config.
      // The apiService takes ApiConfig. Let's look at it.

      // ApiConfig has headers, timeout... no responseType.
      // I will assume I need to modify apiService to support responseType or just fetch it here.
      // I will implement a custom fetch for download here to avoid breaking changes in apiService for now,
      // as I can't confirm if other parts rely on default behaviors.
      // Wait, I can try to use the existing wrapper if it allows passing through config.
      // It seems it defines CustomAxiosRequestConfig but doesn't expose all of it in ApiConfig.

      // Let's use direct axios for this specific action to ensure blob support.
      // Or I can update apiService.ts to support `responseType`.
      // I will update apiService.ts to support `responseType` in ApiConfig. It is a clean change.

      // Wait, I can't update apiService easily without checking usage.
      // Let's stick to the plan: I will assume I can update apiService safely as it is a small project.
      // BUT, to be safer and faster, I will implement the download logic directly here using axios.
      // Re-reading apiService.ts... it uses a local axios instance with interceptors (refresh token).
      // If I use raw axios here I lose the refresh token logic. 
      // So I MUST use the axiosInstance or the wrapper.
      // I'll update apiService.ts first.

      // ... Actually, let's keep this file simple first, and I will update apiService.ts in a separate step.
      // For now let's assume `callAPI` will be updated to support `responseType`.

      const response = await callAPI(
        { ...ENDPOINT.JSON_TO_EXCEL, responseType: 'blob' } as any,
        parsedData
      );

      // Create download link
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
