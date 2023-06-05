import { request } from '@umijs/max';

/** 登录接口 POST /api/login/account */
export async function login(body: API.UserLoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/v1/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/v1/user/info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/user/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}
