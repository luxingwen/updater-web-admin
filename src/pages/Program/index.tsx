import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Input, Card, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getAllPrograms, createProgram, updateProgram, deleteProgram } from '@/services/updater-server/api'; // Import your API methods




const CreateProgramForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();

    const handleCreate = () => {
        form.validateFields()
            .then(values => {
                form.resetFields();
                onCreate(values);
            })
            .catch(errorInfo => {
                console.log('Form validation failed:', errorInfo);
            });
    };

    return (
        <Modal
            visible={visible}
            title="创建程序"
            okText="创建"
            cancelText="取消"
            onCancel={onCancel}
            onOk={handleCreate}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="execUser" label="执行用户">
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="名称">
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="描述">
                    <Input />
                </Form.Item>
                <Form.Item name="installPath" label="安装路径">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};


const ProgramManagementPage = () => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const [createVisible, setCreateVisible] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const actionRef = useRef();

    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [deleteProgramUuid, setDeleteProgramUuid] = useState(null);

    const handleDeleteButtonClick = (uuid) => {
        setDeleteProgramUuid(uuid);
        setDeleteConfirmVisible(true);
    };


    // Function to handle the confirm delete action
    const handleConfirmDelete = async () => {
        // Delete logic here
        console.log('Deleting program with UUID:', deleteProgramUuid);


        await deleteProgram({ uuid: deleteProgramUuid }).then((response) => {
            console.log('response:', response);
            if (response.code === 200) {
                message.success(`Successfully deleted program with UUID: ${deleteProgramUuid}`);
                setDeleteConfirmVisible(false);
                actionRef.current?.reload();
            } else {
                message.error(`Error deleting program with UUID: ${deleteProgramUuid}`);
            }

        }).catch((error) => {
            message.error(`Error deleting program: ${error}`);
            console.error('Error deleting program:', error);
        });
    }

    // Function to handle the cancel delete action
    const handleCancelDelete = () => {
        // Close the confirmation dialog
        setDeleteConfirmVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleCreate = async (values) => {
        // Create program logic here
        console.log('Creating program:', values);

        const programData = {
            execUser: values.execUser,
            name: values.name,
            description: values.description,
            installPath: values.installPath,
        };

        await createProgram(programData).then((response) => {
            console.log('response:', response);
            if (response.code === 200) {
                setCreateVisible(false);
                actionRef.current?.reload();
                message.success(`Successfully created program with UUID: ${response.data.uuid}`);
            } else {
                message.error(`Error creating program: ${response.message}`);
            }
        }).catch((error) => {
            message.error(`Error creating program: ${error}`);
            console.error('Error creating program:', error);
        });


    };

    const handleCteateCancel = () => {
        setCreateVisible(false);
    };



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
                <Button danger onClick={() => handleDeleteButtonClick(record.uuid)} key="delete">
                    Delete
                </Button>,
            ],
        },
    ];

    const showModal = (record) => {
        form.setFieldsValue(record);
        setVisible(true);
    };



    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Program Management</span>
                    <Button type="primary" onClick={() => setCreateVisible(true)}>
                        创建一个程序
                    </Button>
                </div>
            }
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
                actionRef={actionRef}
                pagination={{
                    pageSize: 10,
                }}
                dateFormatter="string"
                style={{ whiteSpace: 'nowrap' }}
            />

            <Modal
                title="Confirmation"
                visible={deleteConfirmVisible}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
            >
                <p>Are you sure you want to delete this program?</p>
            </Modal>

            <CreateProgramForm
                visible={createVisible}
                onCreate={handleCreate}
                onCancel={handleCteateCancel}
            />

            <Modal
                title="Update Program"
                visible={visible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleUpdate} initialValues={form.getFieldsValue()} layout="vertical">
                    <Form.Item name="uuid" label="UUID">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="execUser" label="Execution User">
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="teamID" label="Team ID">
                        <Input />
                    </Form.Item>
                    <Form.Item name="installPath" label="Install Path">
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 4, span: 8 }}>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>


            </Modal>


        </Card>
    );
};

export default ProgramManagementPage;
