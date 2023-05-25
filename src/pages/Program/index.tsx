import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Input, Card } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getAllPrograms, createProgram, updateProgram, deleteProgram } from '@/services/updater-server/api'; // Import your API methods




const ProgramManagementPage = () => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const getPrograms = async (params) => {
        setLoading(true);
        try {
            const response = await getAllPrograms(params);
            return response.data;
        } catch (error) {
            console.error('Error fetching programs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values) => {
        try {
            await createProgram(values);
            setVisible(false);
            actionRef.current?.reload();
        } catch (error) {
            console.error('Error creating program:', error);
        }
    };

    const handleUpdate = async (values) => {
        try {
            await updateProgram(values);
            setVisible(false);
            actionRef.current?.reload();
        } catch (error) {
            console.error('Error updating program:', error);
        }
    };

    const handleDelete = async (uuid) => {
        try {
            await deleteProgram(uuid);
            actionRef.current?.reload();
        } catch (error) {
            console.error('Error deleting program:', error);
        }
    };

    const handleDetails = (uuid) => {
        // Navigate to the program details page using the program's UUID
        navigate(`/program/details/${uuid}`);
    };



    const columns = [
        {
            title: 'UUID',
            dataIndex: 'uuid',
            key: 'uuid',
        },
        {
            title: 'Execution User',
            dataIndex: 'execUser',
            key: 'execUser',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Team ID',
            dataIndex: 'teamID',
            key: 'teamID',
        },
        {
            title: 'Install Path',
            dataIndex: 'installPath',
            key: 'installPath',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
        },
        {
            title: 'Actions',
            valueType: 'option',
            render: (_, record) => [
                <Button type="primary" onClick={() => showModal(record)} key="edit">
                    Update
                </Button>,
                <Button onClick={() => handleDetails(record.uuid)} key="details">
                    Details
                </Button>,
                <Button type="danger" onClick={() => handleDelete(record.uuid)} key="delete">
                    Delete
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
        <Card
            title="Program Management"
            bodyStyle={{ padding: 0 }}
            style={{ width: '100%', overflow: 'auto' }}
        >
            <ProTable
                columns={columns}
                request={getPrograms}
                rowKey="uuid"
                loading={loading}
                search={true}
                options={false}
                pagination={{
                    pageSize: 10,
                }}
                dateFormatter="string"
                style={{ whiteSpace: 'nowrap' }}
            />

            <Modal
                title="Update Program"
                visible={visible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleUpdate} initialValues={form.getFieldsValue()}>
                    <Form.Item name="uuid" label="UUID" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="execUser" label="Execution User" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Name" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="teamID" label="Team ID" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="installPath" label="Install Path" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }}>
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 4, span: 8 }}>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>

            <Button type="primary" onClick={() => setVisible(true)}>
                Create Program
            </Button>
        </Card>
    );
};

export default ProgramManagementPage;
