import React, { useState } from 'react';
import { Upload, Button, Card, message, Typography, Space, Tooltip, Spin, Input, Row, Col } from 'antd';
import { CopyOutlined, FileExcelOutlined, InboxOutlined, SettingOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { callAPI } from '../api/apiService';
import { ENDPOINT } from '../api/apiConfig';

const { Text } = Typography;
const { Dragger } = Upload;

const Excel2Json: React.FC = () => {
  const [jsonData, setJsonData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [colIndexesStr, setColIndexesStr] = useState<string>('');
  const [customKeysStr, setCustomKeysStr] = useState<string>('');

  const handleUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    if (colIndexesStr.trim()) {
      const indexes = colIndexesStr.split(/[,;\s]+/).filter(Boolean);
      indexes.forEach(idx => formData.append('columnIndexes', idx.trim()));
    }

    if (customKeysStr.trim()) {
      const keys = customKeysStr.split(/[,;]+/).filter(Boolean);
      keys.forEach(key => formData.append('customKeys', key.trim()));
    }

    try {
      const data = await callAPI(ENDPOINT.UPLOAD_EXCEL, formData);
      setJsonData(data);
      message.success('Đã xử lý dữ liệu thành công!');
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data || error.message || 'Có lỗi xảy ra khi upload!');
      setJsonData(null);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleReload = () => {
    if (fileList.length === 0) {
      message.warning('Chưa có file nào được upload!');
      return;
    }
    const currentFile = fileList[0] as unknown as File;
    const actualFile = (fileList[0].originFileObj || currentFile) as File;

    if (actualFile) {
      handleUpload(actualFile);
    }
  };

  const handleRemoveFile = () => {
    setFileList([]);
    setJsonData(null);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    disabled: loading,
    showUploadList: false,
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isExcel) {
        message.error('Bạn chỉ có thể upload file Excel (.xlsx)!');
        return Upload.LIST_IGNORE;
      }

      setJsonData(null);
      setFileList([file]);
      handleUpload(file);
      return false;
    },
  };

  const handleCopy = () => {
    if (!jsonData) return;
    const jsonString = JSON.stringify(jsonData);
    navigator.clipboard.writeText(jsonString);
    message.success('Đã copy JSON vào clipboard!');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <Card title="Excel Parser" bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>

          <Card
            size="small"
            type="inner"
            title={<Space><SettingOutlined /> <Text strong>Cấu hình Mapping</Text></Space>}
            extra={
              <Tooltip title="Áp dụng cấu hình mới cho file hiện tại">
                <Button
                  type="primary"
                  ghost
                  icon={<ReloadOutlined />}
                  onClick={handleReload}
                  disabled={fileList.length === 0 || loading}
                >
                  Áp dụng & Parse lại
                </Button>
              </Tooltip>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Text strong>1. Chỉ lấy các cột (Index từ 0):</Text>
                  <Input
                    style={{ marginTop: '8px' }}
                    placeholder="VD: 0, 1, 4 (để trống lấy tất cả)"
                    value={colIndexesStr}
                    onChange={e => setColIndexesStr(e.target.value)}
                    onPressEnter={handleReload}
                    allowClear
                    disabled={loading}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Text strong>2. Đặt tên key JSON (tương ứng thứ tự):</Text>
                  <Input
                    style={{ marginTop: '8px' }}
                    placeholder="VD: fullName, age, email"
                    value={customKeysStr}
                    onChange={e => setCustomKeysStr(e.target.value)}
                    onPressEnter={handleReload}
                    allowClear
                    disabled={loading}
                  />
                </Col>
              </Row>
            </Space>
          </Card>

          <Spin spinning={loading} tip="Đang xử lý file...">

            {fileList.length === 0 ? (
              <Dragger {...uploadProps} style={{ padding: '32px', background: '#fafafa', border: '2px dashed #d9d9d9' }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: '#1890ff', fontSize: '48px' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: 500 }}>
                  Kéo thả hoặc click để upload file Excel
                </p>
                <p className="ant-upload-hint" style={{ color: '#8c8c8c' }}>
                  Hỗ trợ định dạng .xlsx. File sẽ được parse sang JSON tự động.
                </p>
              </Dragger>
            ) : (

              <Card type="inner" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
                <Row align="middle" justify="space-between">
                  <Col>
                    <Space size="large">
                      <FileExcelOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                      <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: '16px' }}>{fileList[0].name}</Text>
                        <Text type="secondary">Đã upload thành công</Text>
                      </Space>
                    </Space>
                  </Col>
                  <Col>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleRemoveFile}
                    >
                      Xóa & Chọn file khác
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}

          </Spin>

          {jsonData && (
            <Card
              type="inner"
              title={
                <Space>
                  <FileExcelOutlined style={{ color: '#52c41a' }} />
                  <Text strong>Kết quả JSON</Text>
                  <Text type="secondary">({jsonData.length} records)</Text>
                </Space>
              }
              extra={
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                >
                  Copy JSON
                </Button>
              }
            >
              <div style={{
                maxHeight: '400px',
                overflow: 'auto',
                backgroundColor: '#282c34',
                color: '#abb2bf',
                padding: '16px',
                borderRadius: '6px',
                fontFamily: 'Consolas, "Courier New", monospace',
                fontSize: '13px',
                lineHeight: '1.5'
              }}>
                <pre style={{ margin: 0 }}>{JSON.stringify(jsonData, null, 2)}</pre>
              </div>
            </Card>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default Excel2Json;