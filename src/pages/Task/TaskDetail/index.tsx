import { getTaskInfo } from '@/services/updater-server/task';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './index.less';
import NestedNav from './NestedNav';
import SubTaskTable from './SubTaskTable';
import TaskExecutionRecordTable from './TaskRecordTable';

type TaskContentInfo = {
  taskId: string;
  sequence: number;
  taskRecordId: string;
};

type TaskContent = {
  type: string;
  content: TaskContentInfo[];
};

type CurrentTaskInfo = {
  id: string;
  type: string;
  viewType: string;
  recordIds: string[];
  taskIds: string[];
};

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const [navItems, setNavItems] = useState<string[]>([taskId]);
  const [task, setTask] = useState(null);
  const [taskIds, setTaskIds] = useState([]);
  const [viewType, setViewType] = useState('subTask');
  const [recordIds, setRecordIds] = useState([]);

  const [currentTaskMap, setCurrentTaskMap] = useState<Map<string, CurrentTaskInfo>>(
    new Map<string, CurrentTaskInfo>(),
  );

  const setCurrentTaskInfo = (currentTaskInfo: CurrentTaskInfo) => {
    setCurrentTaskMap((prevMap) => {
      const newMap = new Map<string, CurrentTaskInfo>(prevMap);
      newMap.set(currentTaskInfo.id, currentTaskInfo);
      return newMap;
    });
  };

  const addNavItem = (navItem: string) => {
    setNavItems([...navItems, navItem]);
  };

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const response = await getTaskInfo(taskId);
        if (response.code === 200) {
          let ids = [];
          let taskContent = JSON.parse(response.data.content);
          taskContent.content.forEach((item) => {
            ids.push(item.taskId);
          });

          if (taskContent.type == 'record') {
            ids = [];
            taskContent.content.forEach((item) => {
              ids.push(item.taskRecordId);
            });
            setViewType('taskRecord');
            setRecordIds(ids);
            let currentTaskInfo = {
              id: taskId,
              type: 'record',
              viewType: 'taskRecord',
              recordIds: ids,
            };
            setCurrentTaskInfo(currentTaskInfo);
          } else {
            console.log('ids:', ids);
            setViewType('subTask');
            setTaskIds(ids);
            let currentTaskInfo = { id: taskId, type: 'task', viewType: 'subTask', taskIds: ids };
            setCurrentTaskInfo(currentTaskInfo);
          }
          setTask(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTaskDetail();
  }, []);
  const handleNavItemClick = (index: number) => {
    let id = navItems[index];
    let currentTaskInfo = currentTaskMap.get(id);
    setNavItems(navItems.slice(0, index + 1));
    setViewType(currentTaskInfo.viewType);
    setRecordIds(currentTaskInfo.recordIds);
    setTaskIds(currentTaskInfo.taskIds);
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  const viewContent = () => {
    if (viewType == 'subTask') {
      return (
        <SubTaskTable
          taskIds={taskIds}
          setViewType={setViewType}
          setRecordIds={setRecordIds}
          addNavItem={addNavItem}
          setCurrentTaskInfo={setCurrentTaskInfo}
        />
      );
    }
    if (viewType == 'taskRecord') {
      return (
        <TaskExecutionRecordTable
          recordIds={recordIds}
          setRecordIds={setRecordIds}
          addNavItem={addNavItem}
          setViewType={setViewType}
          setCurrentTaskInfo={setCurrentTaskInfo}
        />
      );
    }
  };

  return (
    <Card className="task-detail-card">
      {' '}
      {/* 使用自定义的 CSS 类名 */}
      <h1 className="task-detail-title">任务详细信息</h1>
      <p>
        <strong>Task ID:</strong> {task.taskId}
      </p>
      <p>
        <strong>任务名称:</strong> {task.taskName}
      </p>
      <p>
        <strong>任务类型:</strong> {task.taskType}
      </p>
      <p>
        <strong>任务状态:</strong> {task.taskStatus}
      </p>
      <p>
        <strong>描述:</strong> {task.description}
      </p>
      <p>
        <strong>创建人:</strong> {task.creater}
      </p>
      <p>
        <strong>创建时间:</strong> {task.created}
      </p>
      <p>
        <strong>更新时间:</strong> {task.updated}
      </p>
      <p>
        <strong>Content:</strong> {task.ext}
      </p>
      <h2 className="task-detail-subtitle">任务详情</h2>
      <NestedNav navItems={navItems} onNavItemClick={handleNavItemClick} />
      {viewContent()}
    </Card>
  );
};

export default TaskDetailPage;
