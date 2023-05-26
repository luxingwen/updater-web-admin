declare namespace API {
    /**
     * Program represents a program.
     */
    type Program = {
        uuid: string;
        execUser: string;
        name: string;
        description: string;
        teamID: string;
        installPath: string;
        createdAt: string;
        updatedAt: string;
    };

    type Version = {
        uuid: string;
        programUuid: string;
        version: string;
        releaseNote: string;
        createdAt: string;
        updatedAt: string;
    };

    type Package = {
        uuid: string;
        versionUuid: string;
        os: string;
        arch: string;
        storagePath: string;
        downloadPath: string;
        md5: string;
        createdAt: string;
        updatedAt: string;
    };



    type ProgramAction = {
        uuid: string;
        programUUID: string;
        name: string;
        actionType: ActionType;
        content: string;
        status: string;
        description: string;
        createdAt: string;
        updatedAt: string;
    };

    type ActionType =
        | "Download"
        | "Install"
        | "Start"
        | "Stop"
        | "Uninstall"
        | "Backup"
        | "Status"
        | "Version"
        | "Single"
        | "Composite";


    type Client = {
        uuid: string;
        vmuuid: string;
        sn: string;
        hostname: string;
        ip: string;
        proxyID: string;
        status: string;
        os: string;
        arch: string;
        created: string;
        updated: string;
    }


    type Task = {
        taskId: string;
        taskName: string;
        taskType: string;
        taskStatus: string;
        content: string;
        description: string;
        creater: string;
        teamId: string;
        created: string;
        updated: string;
    };

    type TaskExecutionRecord = {
        recordId: string;
        taskId: string;
        clientUuid: string;
        taskType: string;
        status: string;
        startTime: string;
        endTime: string;
        stdout: string;
        stderr: string;
        message: string;
        scriptExitCode: number;
        code: string;
        content: string;
        timeout: string;
        parentRecordId: string;
        nextRecordId: string;
    };


    interface ProgramActionTask {
        programUuid: string;
        programActionUuid: string;
    }

    interface ReqTask {
        name: string;
        creater: string;
        teamID: string;
        description: string;
        hostInfo: HostInfo;
        batchTask: BatchTask;
    }

    interface ReqTaskProgramAction extends ReqTask {
        content: ProgramActionTask;
    }

    interface HostInfo {
        all: boolean;
        clients: string[];
    }

    interface BatchTask {
        count: number;
        style: string;
        number: number;
    }


}
