import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table } from 'antd';

const ProgramDetailPage = () => {
  const { programUUID } = useParams();
  const [program, setProgram] = useState(null);
  const [version, setVersion] = useState(null);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Fetch program details, version details, and package list based on the programUUID
    // Update the state variables accordingly
    // Example API calls:
    // - Fetch program details: GET /api/program/:programUUID
    // - Fetch version details: GET /api/version/:versionUUID
    // - Fetch package list: GET /api/packages?programUUID=:programUUID

    // Example data (replace with actual API responses):
    const programData = {
      uuid: '12345',
      execUser: 'admin',
      name: 'Program 1',
      description: 'Program description',
      teamID: 'Team 1',
      installPath: '/path/to/install',
      createdAt: '2023-05-25T12:00:00Z',
      updatedAt: '2023-05-25T14:30:00Z',
    };

    const versionData = {
      uuid: '67890',
      programUuid: '12345',
      version: '1.0.0',
      releaseNote: 'Version release notes',
      createdAt: '2023-05-25T12:00:00Z',
      updatedAt: '2023-05-25T14:30:00Z',
    };

    const packageData = [
      {
        uuid: 'abcde',
        versionUuid: '67890',
        os: 'Windows',
        arch: 'x64',
        storagePath: '/path/to/storage',
        downloadPath: '/path/to/download',
        md5: 'a1b2c3d4e5',
        createdAt: '2023-05-25T12:00:00Z',
        updatedAt: '2023-05-25T14:30:00Z',
      },
      // Add more package data as needed
    ];

    setProgram(programData);
    setVersion(versionData);
    setPackages(packageData);
  }, [programUUID]);

  return (
    <div>
      {program && (
        <Card title="Program Information">
          <p>UUID: {program.uuid}</p>
          <p>Execution User: {program.execUser}</p>
          <p>Name: {program.name}</p>
          <p>Description: {program.description}</p>
          <p>Team ID: {program.teamID}</p>
          <p>Install Path: {program.installPath}</p>
          <p>Created At: {program.createdAt}</p>
          <p>Updated At: {program.updatedAt}</p>
        </Card>
      )}

      {version && (
        <Card title="Version Information">
          <p>UUID: {version.uuid}</p>
          <p>Program UUID: {version.programUuid}</p>
          <p>Version: {version.version}</p>
          <p>Release Note: {version.releaseNote}</p>
          <p>Created At: {version.createdAt}</p>
          <p>Updated At: {version.updatedAt}</p>
        </Card>
      )}

      <Card title="Package List">
        <Table
          dataSource={packages}
          columns={[
            { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
            { title: 'OS', dataIndex: 'os', key: 'os' },
            { title: 'Arch', dataIndex: 'arch', key: 'arch' },
            { title: 'Storage Path', dataIndex: 'storagePath', key: 'storagePath' },
            { title: 'Download Path', dataIndex: 'downloadPath', key: 'downloadPath' },
            { title: 'MD5', dataIndex: 'md5', key: 'md5' },
            { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
            { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
          ]}
          rowKey="uuid"
        />
      </Card>
    </div>
  );
};

export default ProgramDetailPage;
