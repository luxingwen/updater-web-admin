import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, Form, Input, Card } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getAllTasks, updateTask } from '@/services/updater-server/task'; // Import your API methods

const TaskManagementPage = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const actionRef = useRef();

  const getTasks = async (params, sort, filter) => {
    setLoading(true);
    try {
      console.log("params:", params);
      const response = await getAllTasks({}, params);
      return {
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateTask(values);
      setVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const columns = [
    {
      title: 'Task ID',
      dataIndex: 'taskId',
      key: 'taskId',
    },
    {
      title: 'Task Name',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: 'Task Type',
      dataIndex: 'taskType',
      key: 'taskType',
    },
    {
      title: 'Task Status',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Creater',
      dataIndex: 'creater',
      key: 'creater',
    },
    {
      title: 'Team ID',
      dataIndex: 'teamId',
      key: 'teamId',
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
    <Card
      title="Task Management"
      bodyStyle={{ padding: 0 }}
      style={{ width: '100%', overflow: 'auto' }}
    >
      <ProTable
        columns={columns}
        request={getTasks}
        rowKey="taskId"
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
            taskId: '',
            taskName: '',
            taskType: '',
            taskStatus: '',
            content: '',
            description: '',
            creater: '',
            teamId: '',
          },
          form: form,
        }}
      />

      <Modal
        title="Update Task"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} initialValues={form.getFieldsValue()}>
          <Form.Item
            name="taskId"
            label="Task ID"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="taskName"
            label="Task Name"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="taskType"
            label="Task Type"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="taskStatus"
            label="Task Status"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="creater"
            label="Creater"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="teamId"
            label="Team ID"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TaskManagementPage;
