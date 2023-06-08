import { Button, message, Table } from 'antd';
import { useEffect, useState } from 'react';

import { getAllTaskExecutionRecords } from '@/services/updater-server/task';

interface TaskExecutionRecordTableProps {
  recordIds: string[];
  addNavItem: (navItem: string) => void;
  setViewType: (viewType: string) => void;
  setRecordIds: (recordIds: string[]) => void;
  setCurrentTaskInfo: (currentTaskInfo: any) => void;
}

const TaskExecutionRecordTable: React.FC<TaskExecutionRecordTableProps> = ({
  recordIds,
  addNavItem,
  setViewType,
  setRecordIds,
  setCurrentTaskInfo,
}) => {
  const [dataSource, setDataSource] = useState<API.TaskExecutionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const getAllTaskExecutionRecordLists = async (params) => {
    setLoading(true);
    try {
      const response = await getAllTaskExecutionRecords(params);
      setDataSource(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.total, // Update total count for pagination
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching task execution records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    // 根据当前的 pagination 和 recordIds 获取任务执行记录数据
    await getAllTaskExecutionRecordLists({
      current: pagination.current,
      pageSize: pagination.pageSize,
      recordIds,
    });
  };

  useEffect(() => {
    fetchData();
  }, [recordIds]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchData();
  };

  const handlerViewRecordDetail = (record) => {
    console.log('record 11', record);

    if (record.category == 'sub') {
      message.info('已经是最后一个,还没实现详情');
      return;
    }

    let ids = [];
    let taskContent = JSON.parse(record.content);
    taskContent.content.forEach((item) => {
      ids.push(item.taskRecordId);
    });
    addNavItem(record.recordId);
    setRecordIds(ids);

    setCurrentTaskInfo({
      id: record.recordId,
      type: 'record',
      viewType: 'taskRecord',
      recordIds: ids,
    });
  };

  const columns = [
    {
      title: 'Record ID',
      dataIndex: 'recordId',
      key: 'recordId',
    },
    {
      title: 'Task ID',
      dataIndex: 'taskId',
      key: 'taskId',
    },
    {
      title: 'Client UUID',
      dataIndex: 'clientUuid',
      key: 'clientUuid',
    },
    {
      title: 'Task Type',
      dataIndex: 'taskType',
      key: 'taskType',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Stdout',
      dataIndex: 'stdout',
      key: 'stdout',
    },
    {
      title: 'Stderr',
      dataIndex: 'stderr',
      key: 'stderr',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Script Exit Code',
      dataIndex: 'scriptExitCode',
      key: 'scriptExitCode',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Timeout',
      dataIndex: 'timeout',
      key: 'timeout',
    },
    {
      title: 'Parent Record ID',
      dataIndex: 'parentRecordId',
      key: 'parentRecordId',
    },
    {
      title: 'Next Record ID',
      dataIndex: 'nextRecordId',
      key: 'nextRecordId',
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
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
      scroll={{ x: 'max-content' }} // 设置水平滚动条，使表格可以水平滚动
      bordered // 添加边框
      size="small" // 设置表格大小为小号
      rowKey="recordId" // 设置行键，确保每行有唯一的键值
      style={{ whiteSpace: 'nowrap' }} // 设置表格样式，禁止文本换行
    />
  );
};

export default TaskExecutionRecordTable;
