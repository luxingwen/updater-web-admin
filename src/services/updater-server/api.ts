import { request } from '@umijs/max';

/** 获取所有程序列表 POST /api/v1/program/list */
export async function getAllPrograms(
    body: {
        // query
        /** 程序名称 */
        programName?: string;
        /** 团队ID */
        teamId?: string;
    },
    options?: { [key: string]: any },
) {
    return request<API.Program[]>(`/api/v1/program/list`, {
        method: 'POST',
        data: {
            ...body,
        },
        ...(options || {}),
    });
}

/** 删除程序 POST /api/v1/program/delete/:uuid */
export async function deleteProgram(body: API.Program, options?: { [key: string]: any }) {
    return request<Record<string, any>>(`/api/v1/program/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 创建程序 POST /api/v1/program/create */
export async function createProgram(body: API.Program, options?: { [key: string]: any }) {
    return request<API.Program>(`/api/v1/program/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 更新程序 POST /api/v1/program/update */
export async function updateProgram(body: API.Program, options?: { [key: string]: any }) {

    return request<API.Program>(`/api/v1/program/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}


export async function getProgramDetails(body: API.Program, options?: { [key: string]: any }) {
    console.log("getProgramDetails body:", body)
    return request<API.Program>(`/api/v1/program/detail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}


/** 获取版本列表 POST /api/v1/version/list */
export async function getVersionList(
    body: {
        // query
        /** 程序UUID */
        programUuid?: string;
    },
    options?: { [key: string]: any },
) {
    return request<API.Version[]>(`/api/v1/program/version/list`, {
        method: 'POST',
        data: {
            ...body,
        },
        ...(options || {}),
    });
}

/** 创建版本 POST /api/v1/version/create */
export async function createVersion(body: API.Version, options?: { [key: string]: any }) {
    return request<API.Version>(`/api/v1/program/version/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 更新版本 POST /api/v1/version/update */
export async function updateVersion(body: API.Version, options?: { [key: string]: any }) {
    return request<API.Version>(`/api/v1/program/version/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 删除版本 POST /api/v1/version/delete/:uuid */
export async function deleteVersion(body: API.Version, options?: { [key: string]: any }) {
    return request<Record<string, any>>(`/api/v1/program/version/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function getProgramVersionDetails(body: API.Version, options?: { [key: string]: any }) {
    return request<API.Version>(`/api/v1/program/version/detail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}


/** 获取包列表 POST /api/v1/package/list */
export async function getPackageList(
    body: {
        // query
        /** 版本UUID */
        versionUuid?: string;
    },
    options?: { [key: string]: any },
) {
    return request<API.Package[]>(`/api/v1/program/package/list`, {
        method: 'POST',
        data: {
            ...body,
        },
        ...(options || {}),
    });
}

/** 创建包 POST /api/v1/package/create */
export async function createPackage(body: API.Package, options?: { [key: string]: any }) {
    return request<API.Package>(`/api/v1/program/package/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 更新包 POST /api/v1/package/update */
export async function updatePackage(body: API.Package, options?: { [key: string]: any }) {
    return request<API.Package>(`/api/v1/program/package/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 删除包 POST /api/v1/package/delete/:uuid */
export async function deletePackage(uuid: string, options?: { [key: string]: any }) {
    return request<Record<string, any>>(`/api/v1/program/package/delete/${uuid}`, {
        method: 'POST',
        ...(options || {}),
    });
}

/** 获取程序动作列表 POST /api/v1/program/action/list */
export async function getProgramActionList(
    body: {
        // query
        /** 程序UUID */
        programUuid?: string;
    },
    options?: { [key: string]: any },
) {
    return request<API.ProgramAction[]>(`/api/v1/program/action/list`, {
        method: 'POST',
        data: {
            ...body,
        },
        ...(options || {}),
    });
}

/** 创建程序动作 POST /api/v1/program/action/create */
export async function createProgramAction(body: API.ProgramAction, options?: { [key: string]: any }) {
    return request<API.ProgramAction>(`/api/v1/program/action/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 更新程序动作 POST /api/v1/program/action/update */
export async function updateProgramAction(body: API.ProgramAction, options?: { [key: string]: any }) {
    return request<API.ProgramAction>(`/api/v1/program/action/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 删除程序动作 POST /api/v1/program/action/delete/:uuid */
export async function deleteProgramAction(uuid: string, options?: { [key: string]: any }) {
    return request<Record<string, any>>(`/api/v1/program/action/delete/${uuid}`, {
        method: 'POST',
        ...(options || {}),
    });
}
