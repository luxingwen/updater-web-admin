import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { getProgramActionInfo } from '@/services/updater-server/api';

const ProgramActionInfoPage = ({ action }: { action: API.ProgramAction }) => {
  return (
    <div>
      <h1>Program Action Details</h1>
      <p>UUID: {action.uuid}</p>
      <p>Program UUID: {action.programUUID}</p>
      <p>Name: {action.name}</p>
      <p>Action Type: {action.actionType}</p>
      <p>Content: {action.content}</p>
      <p>Status: {action.status}</p>
      <p>Description: {action.description}</p>
      <p>Created At: {action.createdAt}</p>
      <p>Updated At: {action.updatedAt}</p>
    </div>
  );
};

const ProgramActionDetailPage = () => {
  const { uuid } = useParams();
  const [action, setAction] = useState<API.ProgramAction>();

  useEffect(() => {
    getProgramActionInfo({ uuid: uuid }).then((response) => {
      if (response.code === 200) {
        console.log('response.data:', response.data);
        setAction(response.data);
      }
    });
  }, []);

  return <div>{action ? <ProgramActionInfoPage action={action} /> : null}</div>;
};

export default ProgramActionDetailPage;
