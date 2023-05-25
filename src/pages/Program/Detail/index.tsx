import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Table, Button, Card } from 'antd';
import { getProgramDetails, getVersionList, getProgramActionList } from '@/services/updater-server/api';

const ProgramDetails = () => {
    const { uuid } = useParams();

    const programUUID = uuid;

    const navigate = useNavigate();

    console.log('programUUID:', programUUID);

    const [program, setProgram] = useState(null);
    const [versions, setVersions] = useState([]);
    const [programActions, setProgramActions] = useState([]);


    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
  

    const handleVesionEdit = (record) => {
        console.log('record:', record);
        navigate(`/program/version/edit/${uuid}/${record.uuid}`);
    }

    const showEditModal = (record) => {
      setSelectedRecord(record);
      setEditModalVisible(true);
    };
  
    const showDeleteModal = (record) => {
      setSelectedRecord(record);
      setDeleteModalVisible(true);
    };
  
    const handleEditConfirm = () => {
      // Handle edit confirmation here
      // You can access the selected record using `selectedRecord` state
      // Close the modal and perform necessary operations
      setEditModalVisible(false);
    };
  
    const handleDeleteConfirm = () => {
      // Handle delete confirmation here
      // You can access the selected record's uuid using `selectedRecord.uuid`
      // Close the modal and perform necessary operations
      setDeleteModalVisible(false);
    };
  
    const handleEditCancel = () => {
      setEditModalVisible(false);
    };
  
    const handleDeleteCancel = () => {
      setDeleteModalVisible(false);
    };

    const fetchProgramDetails = async () => {
        try {
            const programDetails = await getProgramDetails({ uuid: uuid });
            setProgram(programDetails.data);

            const versionList = await getVersionList({ programUuid: programUUID });
            setVersions(versionList.data.data);

            const programActionList = await getProgramActionList({ programUuid: programUUID });
            setProgramActions(programActionList.data);
        } catch (error) {
            console.error('Error fetching program details:', error);
        }
    };

    useEffect(() => {
        fetchProgramDetails();
    }, []);

    return (
        <Card
            bodyStyle={{ padding: 0 }}
            style={{ width: '100%', overflow: 'auto' }}
        >
            {program && (
                <Descriptions title="Program Details" bordered>
                    <Descriptions.Item label="UUID">{program.uuid}</Descriptions.Item>
                    <Descriptions.Item label="Execution User">{program.execUser}</Descriptions.Item>
                    <Descriptions.Item label="Name">{program.name}</Descriptions.Item>
                    <Descriptions.Item label="Description">{program.description}</Descriptions.Item>
                    <Descriptions.Item label="Team ID">{program.teamID}</Descriptions.Item>
                    <Descriptions.Item label="Install Path">{program.installPath}</Descriptions.Item>
                </Descriptions>
            )}

            <br />

            <h3>Version List</h3>
            <Table
                dataSource={versions}
                style={{ whiteSpace: 'nowrap', }}
                columns={[
                    { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
                    { title: 'Version', dataIndex: 'version', key: 'version' },
                    { title: 'Release Note', dataIndex: 'releaseNote', key: 'releaseNote' },
                    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
                    { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
                    {
                        title: 'Actions',
                        dataIndex: 'actions',
                        key: 'actions',
                        render: (_, record) => (
                            <div>
                                <Button type="primary" onClick={() => handleVesionEdit(record)} key="edit">
                                    Edit
                                </Button>
                                <Button type="danger" onClick={() => handleDelete(record.uuid)} key="delete">
                                    Delete
                                </Button>
                            </div>
                        ),
                    },
                ]}
                rowKey="uuid"
            />

            <br />

            <h3>Program Action List</h3>
            <Table
                style={{ whiteSpace: 'nowrap', }}
                dataSource={programActions}
                columns={[
                    { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
                    { title: 'Name', dataIndex: 'name', key: 'name' },
                    { title: 'Content', dataIndex: 'content', key: 'content' },
                    { title: 'Status', dataIndex: 'status', key: 'status' },
                    { title: 'Description', dataIndex: 'description', key: 'description' },
                    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
                    { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
                ]}
                rowKey="uuid"
            />
        </Card>
    );
};

export default ProgramDetails;
