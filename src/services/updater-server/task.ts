import { request } from '@umijs/max';

export async function getAllTasks(
  params: {
    // query
  },
  body?: API.Task, // add body parameter
  options?: { [key: string]: any },
) {
  return request<API.Task[]>('/api/v1/task/list', {
    method: 'POST',
    params: {
      ...params,
    },
    data: body, // use body
    ...(options || {}),
  });
}

export async function getTaskInfo(taskId: string, options?: { [key: string]: any }) {
  return request<API.Task>(`/api/v1/task/detail`, {
    method: 'POST',
    data: {
      taskId: taskId,
    },
    ...(options || {}),
  });
}

export async function deleteTask(taskId: string, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/v1/task/delete/${taskId}`, {
    method: 'POST',
    ...(options || {}),
  });
}

export async function createTask(body: API.Task, options?: { [key: string]: any }) {
  return request<API.Task>('/api/v1/task/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateTask(body: API.Task, options?: { [key: string]: any }) {
  return request<API.Task>('/api/v1/task/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getAllTaskExecutionRecords(
  params: {
    // query
  },
  options?: { [key: string]: any },
) {
  return request<API.TaskExecutionRecord[]>('/api/v1/task/record/list', {
    method: 'POST',
    data: params, // use body
    ...(options || {}),
  });
}

export async function deleteTaskExecutionRecord(
  recordId: string,
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>(`/api/v1/task-execution-record/delete/${recordId}`, {
    method: 'POST',
    ...(options || {}),
  });
}

export async function createTaskExecutionRecord(
  body: API.TaskExecutionRecord,
  options?: { [key: string]: any },
) {
  return request<API.TaskExecutionRecord>('/api/v1/task-execution-record/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateTaskExecutionRecord(
  body: API.TaskExecutionRecord,
  options?: { [key: string]: any },
) {
  return request<API.TaskExecutionRecord>('/api/v1/task-execution-record/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function createProgramActionTask(
  body: API.ReqTaskProgramAction,
  options?: { [key: string]: any },
) {
  return request<API.Task>('/api/v1/program/action/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
