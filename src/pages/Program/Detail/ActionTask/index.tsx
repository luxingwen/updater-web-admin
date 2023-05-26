import React, { useState } from 'react';
import { Steps, Radio, InputNumber, Button, Form, Card, Input, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { useParams } from 'react-router-dom';
import { getAllClients } from '@/services/updater-server/client'; // 假设有一个名为 getAllClients 的接口函数
import { createProgramActionTask } from '@/services/updater-server/task';


const { Step } = Steps;

const ClientType = {
    ALL: '所有主机',
    PARTIAL: '部分主机',
};

const BatchType = {
    PER_BATCH: '每批多少个',
    AVERAGE: '平均分成多少批',
};

const ActionTaskPage = () => {

    const { programUuid, programActionUuid } = useParams();
    const [loading, setLoading] = useState(false);

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedClientType, setSelectedClientType] = useState(ClientType.ALL);
    const [selectedBatchType, setSelectedBatchType] = useState(null);
    const [batchSize, setBatchSize] = useState(0);
    const [batchType, setBatchType] = useState(null);
    const [executionType, setExecutionType] = useState(null);
    const [selectedClientKeys, setSelectedClientKeys] = useState([]);

    const [form] = Form.useForm();


    // 在组件中定义表单项的名称
    const formItemName = 'executionForm';

    // 在组件外部定义表单布局
    const formLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };


    const convertToReqTaskProgramAction = () => {
        // ...

        const formValues = form.getFieldsValue(); // 获取表单字段的值
        const { name, description, executionType, batchType, batchSize } = formValues;


        //  const { programUuid, programActionUuid } = useParams();

        const task = {
            name,
            creater: 'admin',
            description,
            hostInfo: {
                all: executionType === 'all',
                clients: selectedClientType === ClientType.PARTIAL ? selectedClientKeys : [],
            },
            batchTask: {
                style: executionType == 'all' ? 'all' : batchType == BatchType.PER_BATCH ? 'normal' : 'average',
                number: executionType == 'all' ? 0 : batchSize, // 从某处获取number
            },
        };

        const reqTaskProgramAction = {
            content: {
                programUuid,
                programActionUuid,
            },
            ...task,
        };

        return reqTaskProgramAction;
    };



    const handleExecute = async () => {

        if (executionType === undefined || executionType === null) {
            message.error('请选择执行类型');
            return;
        }

        if ((executionType == 'batch') && (selectedBatchType === undefined || selectedBatchType === null)) {
            message.error('请选择批量类型');
            return;
        }

        const reqTaskProgramAction = convertToReqTaskProgramAction();

        await createProgramActionTask(reqTaskProgramAction).then((res) => {
           if(res && res.code == 200){
            console.log("res:", res)
            message.success('创建任务成功');
           }else {
            let s = res && res.message ? res.message : '';
            message.error('创建任务失败:'+s);
           }
          
            
        }
        ).catch((err) => {
            message.error('创建任务失败');
        }
        );

        // 执行发送请求或其他操作
        console.log("reqTaskProgramAction:", reqTaskProgramAction);
    };

    const handleSavePreset = () => {
        const reqTaskProgramAction = convertToReqTaskProgramAction();
        // 执行发送请求或其他操作
        console.log("reqTaskProgramAction:", reqTaskProgramAction);
    };


    const handleExecutionTypeChange = (e) => {
        setExecutionType(e.target.value);
        form.resetFields(['batchType', 'batchSize']);
    };

    const handleBatchTypeChange = (e) => {
        setSelectedBatchType(e.target.value);
        form.resetFields(['batchSize']);
    };

    const handleClientSelectionChange = (selectedRowKeys) => {
        setSelectedClientKeys(selectedRowKeys);
        console.log("selectedRowKeys:", selectedRowKeys);
    };

    const getClients = async (params, sort, filter) => {
        setLoading(true);
        try {
            console.log("params:", params);
            const response = await getAllClients({}, params);
            return {
                data: response.data.data,
            };
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'UUID',
            dataIndex: 'uuid',
            key: 'uuid',

        },
        {
            title: 'VMUUID',
            dataIndex: 'vmuuid',
            key: 'vmuuid',
        },
        {
            title: 'SN',
            dataIndex: 'sn',
            key: 'sn',
        },
        {
            title: 'Hostname',
            dataIndex: 'hostname',
            key: 'hostname',
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            search: false,
        },
        {
            title: 'OS',
            dataIndex: 'os',
            key: 'os',
            search: false,
        },
        {
            title: 'Arch',
            dataIndex: 'arch',
            key: 'arch',
            search: false,
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
        },];


    const handleNext = () => {

        if (selectedClientType == ClientType.PARTIAL && selectedClientKeys.length == 0) {
            message.error("请选择主机");
            return;
        }

        setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleClientTypeChange = (e) => {
        setSelectedClientType(e.target.value);
    };


    const handleBatchSizeChange = (value) => {
        setBatchSize(value);
    };

    const renderClientStepContent = () => {
        return (
            <div style={{ marginTop: '20px' }}>
                <Radio.Group value={selectedClientType} onChange={handleClientTypeChange}>
                    <Radio value={ClientType.ALL}>选择所有主机</Radio>
                    <Radio value={ClientType.PARTIAL}>选择部分主机</Radio>
                </Radio.Group>
                {selectedClientType === ClientType.PARTIAL && (

                    <Card style={{ marginTop: '20px', width: '100%', overflow: 'auto' }}>

                        <ProTable
                            request={getClients}
                            rowKey="uuid"
                            style={{ whiteSpace: 'nowrap' }}
                            columns={columns}
                            rowSelection={{
                                onChange: handleClientSelectionChange,
                                selectedRowKeys: selectedClientKeys,
                                getCheckboxProps: (record) => ({
                                    disabled: record.status === 'disabled', // 根据需要设置禁用条件
                                }),
                            }}
                        />

                    </Card>
                )}
            </div>
        );
    };

    const renderExecutionStepContent = () => {
        return (
            <div style={{ marginTop: "20px" }}>
                <Form {...formLayout} form={form} name={formItemName}>

                    <Form.Item label="任务名称" name="name" rules={[{ required: true, message: "请输入任务名称" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="任务描述" name="description" rules={[{ required: true, message: "请输入任务描述" }]}>
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item label="执行方式" name="executionType">
                        <Radio.Group value={executionType} onChange={handleExecutionTypeChange}>
                            <Radio value="all">全部执行</Radio>
                            <Radio value="batch">分批执行</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {executionType === 'batch' && (
                        <div>
                            <Form.Item label="分批执行类型" name="batchType">
                                <Radio.Group value={selectedBatchType} onChange={handleBatchTypeChange} rules={[{ required: true, message: "请选择分批类型" }]} >
                                    <Radio value={BatchType.PER_BATCH}>每批多少个</Radio>
                                    <Radio value={BatchType.AVERAGE}>平均分成多少批</Radio>
                                </Radio.Group>
                            </Form.Item>

                            {selectedBatchType && (
                                <Form.Item label="输入数量" name="batchSize" rules={[{ required: true, message: "请输入数量" }]}>
                                    <InputNumber min={1} defaultValue={0} style={{ marginLeft: 16 }} />
                                </Form.Item>
                            )}
                        </div>
                    )}
                </Form>
            </div>
        );
    };

    return (
        <div>
            <Steps current={currentStep}>
                <Step title="选择主机" />
                <Step title="填写任务信息" />
            </Steps>
            <div>{currentStep === 0 ? renderClientStepContent() : renderExecutionStepContent()}</div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                {currentStep > 0 && <Button onClick={handlePrevious}>上一步</Button>}
                {currentStep < 1 ? (
                    <Button type="primary" onClick={handleNext}>
                        下一步
                    </Button>
                ) : (
                    <>
                        <Button type="primary" style={{ marginLeft: 8 }} onClick={handleExecute}>立即执行</Button>
                        <Button style={{ marginLeft: 8 }} onClick={handleSavePreset}>另存预设</Button>
                    </>
                )}
            </div>
        </div>
    );

};

export default ActionTaskPage;
