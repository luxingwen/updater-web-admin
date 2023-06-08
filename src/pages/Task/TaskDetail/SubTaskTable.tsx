import { getAllTasks } from '@/services/updater-server/task';
import { Button, Table } from 'antd';
import React, { useEffect, useState } from 'react';

interface SubTaskTableProps {
  taskIds: string[];
  setViewType: (viewType: string) => void;
  setRecordIds: (recordIds: string[]) => void;
  addNavItem: (navItem: string) => void;
  setCurrentTaskInfo: (currentTaskInfo: any) => void;
}

const SubTaskTable: React.FC<SubTaskTableProps> = ({
  taskIds,
  setViewType,
  setRecordIds,
  addNavItem,
  setCurrentTaskInfo,
}) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const getTasks = async (params) => {
    setLoading(true);
    try {
      const response = await getAllTasks({}, params);
      setDataSource(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.total, // Update total count for pagination
      });
      setLoading(false);
      console.log('loading:', loading);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlerViewRecordDetail = (record) => {
    let ids = [];
    let taskContent = JSON.parse(record.content);
    taskContent.content.forEach((item) => {
      ids.push(item.taskRecordId);
    });

    console.log('ids:', ids);
    console.log('record:', record);

    setRecordIds(ids);
    setViewType('taskRecord');
    addNavItem(record.taskId);
    console.log('addNavItem:', record.taskId);
    let currentTaskInfo = {
      id: record.taskId,
      type: 'record',
      viewType: 'taskRecord',
      recordIds: ids,
    };
    console.log('currentTaskInfo 11:', currentTaskInfo);
    setCurrentTaskInfo(currentTaskInfo);
  };

  useEffect(() => {
    getTasks({ ...pagination, taskIds });
  }, [taskIds]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    getTasks({ ...pagination, taskIds });
  };

  const columnsTask = [
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
      title: 'Created At',
      dataIndex: 'created',
      key: 'created',
      search: false,
    },
    {
      title: 'Updated At',
      dataIndex: 'updated',
      key: 'updated',
      search: false,
    },
    {
      title: 'Actions',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="primary"
          onClick={() => {
            handlerViewRecordDetail(record);
          }}
          key="detail"
        >
          详情
        </Button>,
      ],
    },
  ];

  return (
    <Table
      columns={columnsTask}
      dataSource={dataSource}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
      scroll={{ x: 'max-content' }} // 设置水平滚动条，使表格可以水平滚动
      bordered // 添加边框
      size="small" // 设置表格大小为小号
      rowKey="taskId" // 设置行键，确保每行有唯一的键值
      style={{ whiteSpace: 'nowrap' }} // 设置表格样式，禁止文本换行
    />
  );
};

export default SubTaskTable;
