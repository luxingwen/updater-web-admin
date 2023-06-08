import { getProgramActionInfo } from '@/services/updater-server/api';
import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type ActionPipe = {
  uuid: string;
  sequence: number;
  nextUuid: string;
  info: API.ProgramAction;
};

const { Step } = Steps;

const ProgramActionInfoPage = ({ action }: { action: API.ProgramAction }) => {
  const [actionPipes, setActionPipes] = useState<ActionPipe[]>([]);

  useEffect(() => {
    if (action.actionType === 'Composite') {
      const fetchActionInfo = async (item: ActionPipe) => {
        try {
          const response = await getProgramActionInfo({ uuid: item.uuid });
          if (response.code === 200) {
            item.data = response.data;
            setActionPipes((prevActionPipes) => [...prevActionPipes, item]);
          }
        } catch (error) {
          console.error(error);
        }
      };

      const parsedContent = JSON.parse(action.content);
      parsedContent.forEach((item: ActionPipe) => {
        console.log(item.uuid);
        fetchActionInfo(item);
      });
    }
  }, []);

  return (
    <div>
      <h1>Program Action Details</h1>
      <p>UUID: {action.uuid}</p>
      <p>Program UUID: {action.programUUID}</p>
      <p>Name: {action.name}</p>
      <p>Action Type: {action.actionType}</p>
      <p>Status: {action.status}</p>
      <p>Description: {action.description}</p>
      <p>Created At: {action.createdAt}</p>
      <p>Updated At: {action.updatedAt}</p>

      {action.actionType === 'Composite' ? (
        <div>
          <h2>Steps</h2>
          <Steps current={0} size="small">
            {actionPipes.map((pipe, index) => (
              <Step
                key={pipe.uuid}
                title={pipe.data?.name}
                status={index === 0 ? 'process' : 'wait'}
              />
            ))}
          </Steps>
        </div>
      ) : (
        <div>
          <h2>Content</h2>
          <p>{action.content}</p>
        </div>
      )}
    </div>
  );
};

const ProgramActionDetailPage = () => {
  const { uuid } = useParams();
  const [action, setAction] = useState<API.ProgramAction>();

  useEffect(() => {
    getProgramActionInfo({ uuid: uuid }).then((response) => {
      if (response.code === 200) {
        setAction(response.data);
      }
    });
  }, []);

  return <div>{action ? <ProgramActionInfoPage action={action} /> : null}</div>;
};

export default ProgramActionDetailPage;
