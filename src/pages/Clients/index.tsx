import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, Form, Input, Card } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getAllClients, updateClient } from '@/services/updater-server/client'; // 导入您的 API 方法

const ClientManagementPage = () => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const actionRef = useRef();


    const getClients = async (params, sort, filter) => {
        setLoading(true);
        try {
            console.log("params:", params);
            const response = await getAllClients({}, params);
            return {
                data: response.data.data,
            };
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        try {
            await updateClient(values);
            setVisible(false);
            actionRef.current?.reload();
        } catch (error) {
            console.error('Error updating client:', error);
        }
    };

    const columns = [
        {
            title: 'UUID',
            dataIndex: 'uuid',
            key: 'uuid',

        },
        {
            title: 'VMUUID',
            dataIndex: 'vmuuid',
            key: 'vmuuid',
        },
        {
            title: 'SN',
            dataIndex: 'sn',
            key: 'sn',
        },
        {
            title: 'Hostname',
            dataIndex: 'hostname',
            key: 'hostname',
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            search: false,
        },
        {
            title: 'OS',
            dataIndex: 'os',
            key: 'os',
            search: false,
        },
        {
            title: 'Arch',
            dataIndex: 'arch',
            key: 'arch',
            search: false,
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
            search: false,
        },
        {
            title: 'Updated',
            dataIndex: 'updated',
            key: 'updated',
            search: false,
        },
        {
            title: 'Actions',
            valueType: 'option',
            render: (_, record) => [
                <Button type="primary" onClick={() => showModal(record)} key="edit">
                    Update
                </Button>,
            ],
        },
    ];

    const showModal = (record) => {
        form.setFieldsValue(record);
        setVisible(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    return (
        <Card title="Client Management"
            bodyStyle={{ padding: 0 }}
            style={{ width: '100%', overflow: 'auto' }}>
            <ProTable
                columns={columns}
                request={getClients}
                rowKey="uuid"
                loading={loading}
                search={{
                    labelWidth: 70,
                }}
                options={true}
                pagination={{
                    pageSize: 10,
                }}
                dateFormatter="string"
                style={{ whiteSpace: 'nowrap' }}
                form={{
                    // Filter options
                    initialValues: {
                        vmuuid: '',
                        sn: '',
                        hostname: '',
                        ip: '',
                        uuid: '',
                    },
                    form: form,
                }}
            />

            <Modal
                title="Update Client"
                visible={visible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleUpdate} initialValues={form.getFieldsValue()}>
                    <Form.Item
                        name="uuid"
                        label="UUID"
                        labelCol={{ span: 6 }} // Adjust the span value as per your preference
                        wrapperCol={{ span: 18 }} // Adjust the span value as per your preference
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="vmuuid"
                        label="VMUUID"
                        labelCol={{ span: 6 }} // Adjust the span value as per your preference
                        wrapperCol={{ span: 18 }} // Adjust the span value as per your preference
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="sn"
                        label="SN"
                        labelCol={{ span: 6 }} // Adjust the span value as per your preference
                        wrapperCol={{ span: 18 }} // Adjust the span value as per your preference
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="hostname"
                        label="Hostname"
                        labelCol={{ span: 6 }} // Adjust the span value as per your preference
                        wrapperCol={{ span: 18 }} // Adjust the span value as per your preference
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="ip"
                        label="IP"
                        labelCol={{ span: 6 }} // Adjust the span value as per your preference
                        wrapperCol={{ span: 18 }} // Adjust the span value as per your preference
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}> {/* Adjust the offset and span values as per your preference */}
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>
        </Card>
    );
};

export default ClientManagementPage;
