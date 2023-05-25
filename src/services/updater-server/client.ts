import { request } from '@umijs/max';

export async function getAllClients(
  params: {
    // query
  },
  body?: API.Client, // 添加 body 参数
  options?: { [key: string]: any }
) {
  return request<API.Client[]>('/api/v1/client/list', {
    method: 'POST',
    params: {
      ...params,
    },
    data: body, // 使用 body
    ...(options || {}),
  });
}

export async function deleteClient(uuid: string, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/v1/client/delete/${uuid}`, {
    method: 'POST',
    ...(options || {}),
  });
}

export async function createClient(body: API.Client, options?: { [key: string]: any }) {
  return request<API.Client>('/api/v1/client/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateClient(body: API.Client, options?: { [key: string]: any }) {
  return request<API.Client>('/api/v1/client/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
