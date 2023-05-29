import { createProgramAction, getProgramActionList } from '@/services/updater-server/api';
import { Button, Form, Input, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const AddProgramActionPage = () => {
  const { programUuid } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [steps, setSteps] = useState([]); // 步骤列表

  const [actionList, setActionList] = useState([]); // 步骤列表

  useEffect(() => {
    // 模拟从网络获取选项数据

    getProgramActionList({ programUuid: programUuid })
      .then((response) => {
        console.log('response:', response);
        if (response.code === 200) {
          setActionList(response.data);
        }
      })
      .catch((error) => {
        console.log('error:', error);
      });
  }, []);

  const handleActionTypeChange = (value) => {
    // 更新表单值对象中的 actionType
    setValues((prevValues) => ({
      ...prevValues,
      actionType: value,
    }));
  };

  const addStep = () => {
    setSteps((prevSteps) => [...prevSteps, '']); // 添加一个空步骤
  };

  const removeStep = (index) => {
    setSteps((prevSteps) => prevSteps.filter((_, i) => i !== index)); // 移除指定索引的步骤
  };

  const handleStepChange = (value, index) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps[index] = value;
      return updatedSteps;
    });
  };

  const onFinish = async (values) => {
    console.log('Form values:', values);

    console.log('steps:', steps);
    let content = '';
    let actionShells = [
      {
        os: 'Windows',
        content: values.windowsContent,
      },
      {
        os: 'Linux',
        content: values.linuxContent,
      },
    ];
    console.log('action shells:', actionShells);

    if (values.actionType !== 'Download') {
      content = JSON.stringify(actionShells);
    }

    if (values.actionType === 'Composite') {
      if (steps.length === 0) {
        message.error('Please add steps');
        return;
      }

      let stepsContent = [];
      for (let i = 0; i < steps.length; i++) {
        let nextUuid = '';
        if (i < steps.length - 1) {
          nextUuid = steps[i + 1];
        }

        let stepContent = {
          sequence: i + 1,
          uuid: steps[i],
          nextUuid: nextUuid,
        };
        stepsContent.push(stepContent);
      }
      content = JSON.stringify(stepsContent);
    }

    let actionForm: API.ProgramAction = {
      programUUID: programUuid,
      content: content,
      actionType: values.actionType,
      name: values.name,
      description: values.description,
    };

    let response = await createProgramAction(actionForm);

    if (response.code === 200) {
      message.success('Create Program Action Success');
      navigate(`/program/details/${programUuid}`);
    } else {
      message.error('Create Program Action Failed');
    }

    // 执行提交逻辑
  };

  return (
    <div>
      <h1>Add Program Action</h1>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter the Name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="actionType"
          label="Action Type"
          rules={[{ required: true, message: 'Please select the Action Type' }]}
        >
          <Select onChange={handleActionTypeChange}>
            <Option value="Download">Download</Option>
            <Option value="Install">Install</Option>
            <Option value="Start">Start</Option>
            <Option value="Stop">Stop</Option>
            <Option value="Uninstall">Uninstall</Option>
            <Option value="Backup">Backup</Option>
            <Option value="Status">Status</Option>
            <Option value="Version">Version</Option>
            <Option value="Single">Single</Option>
            <Option value="Composite">Composite</Option>
          </Select>
        </Form.Item>
        <Form.Item
          style={{
            display:
              values.actionType === 'Install' ||
              values.actionType === 'Start' ||
              values.actionType === 'Stop' ||
              values.actionType === 'Uninstall'
                ? 'block'
                : 'none',
          }}
          name="windowsContent"
          label="Windows Content"
          rules={[{ required: true, message: 'Please enter the Content' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          style={{
            display:
              values.actionType === 'Install' ||
              values.actionType === 'Start' ||
              values.actionType === 'Stop' ||
              values.actionType === 'Uninstall'
                ? 'block'
                : 'none',
          }}
          name="linuxContent"
          label="Linux Content"
          rules={[{ required: true, message: 'Please enter the Content' }]}
        >
          <Input.TextArea />
        </Form.Item>

        {values.actionType === 'Composite' && (
          <>
            {steps.map((step, index) => (
              <Form.Item
                key={index}
                label={`Step ${index + 1}`}
                rules={[{ required: true, message: 'Please enter the step' }]}
              >
                <Select value={step} onChange={(value) => handleStepChange(value, index)}>
                  {actionList.map((item) => (
                    <Option value={item.uuid} key={item.uuid}>
                      {item.name}
                    </Option>
                  ))}
                </Select>

                <Button type="link" onClick={() => removeStep(index)}>
                  Remove
                </Button>
              </Form.Item>
            ))}
            <Button type="dashed" onClick={addStep} style={{ width: '100%' }}>
              Add Step
            </Button>
          </>
        )}

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter the Description' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Action
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProgramActionPage;
