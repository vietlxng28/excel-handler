import React, { useState } from 'react';
import { Layout, Menu, theme, Button, Typography } from 'antd';
import { UploadOutlined, CalculatorOutlined, MenuUnfoldOutlined, MenuFoldOutlined, FileExcelOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <UploadOutlined />,
      label: 'Excel2Json',
    },
    {
      key: '/json2excel',
      icon: <FileExcelOutlined />,
      label: 'Json2Excel',
    },
    {
      key: '/ap2e',
      icon: <CalculatorOutlined />,
      label: 'DDL',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={250} style={{
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        zIndex: 10
      }}>
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          margin: 16,
          borderRadius: 8
        }}>
          {!collapsed ? (
            <Title level={4} style={{ color: 'white', margin: 0, letterSpacing: '1px' }}>BC_TC</Title>
          ) : (
            <Title level={4} style={{ color: 'white', margin: 0 }}>BC</Title>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ fontSize: '1rem', fontWeight: 500 }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>

          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
