import { useEffect, useState } from 'react';

import {
  createVersion,
  deleteVersion,
  getProgramActionList,
  getProgramDetails,
  getVersionList,
} from '@/services/updater-server/api';
import { Button, Card, Descriptions, Form, Input, message, Modal, Table } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const ProgramDetails = () => {
  const { uuid } = useParams();

  const programUUID = uuid;

  const navigate = useNavigate();

  console.log('programUUID:', programUUID);

  const [program, setProgram] = useState(null);
  const [versions, setVersions] = useState([]);
  const [programActions, setProgramActions] = useState([]);

  // const [editModalVisible, setEditModalVisible] = useState(false);
  //const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // const [selectedRecord, setSelectedRecord] = useState(null);

  const [showAddVersionModal, setShowAddVersionModal] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteItemUuid, setDeleteItemUuid] = useState(null);

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

  const handleAddVersionClick = () => {
    setShowAddVersionModal(true);
  };

  const handleAddVersionModalCancel = () => {
    setShowAddVersionModal(false);
  };

  // Function to handle the delete button click
  const handleDeleteButtonClick = (uuid) => {
    setDeleteItemUuid(uuid);
    setDeleteConfirmVisible(true);
  };

  const handleVersionDelete = async (record) => {
    console.log('record:', record);
    await deleteVersion({ uuid: record.uuid })
      .then((response) => {
        console.log('response:', response);
        if (response.code === 200) {
          message.success('Version deleted successfully');
          fetchProgramDetails();
        }
      })
      .catch((error) => {
        message.error('Error deleting version');
        console.error('Error deleting version:', error);
      });
  };

  // Function to handle the confirm delete action
  const handleConfirmDelete = () => {
    // Delete logic here
    console.log('Deleting item with UUID:', deleteItemUuid);

    handleVersionDelete({ uuid: deleteItemUuid });
    // Close the confirmation dialog
    setDeleteConfirmVisible(false);
  };

  const handleCancelDelete = () => {
    // Close the confirmation dialog
    setDeleteConfirmVisible(false);
  };

  const handleAddVersionModalSubmit = async (values) => {
    // Handle form submission here
    console.log('Submitted values:', values);

    const versionData: API.Version = {
      programUuid: programUUID ? programUUID : '',
      version: values.version,
      releaseNote: values.releaseNote,
    };

    console.log('versionData:', versionData);

    await createVersion(versionData)
      .then((response) => {
        console.log('response:', response);
        if (response.code === 200) {
          setShowAddVersionModal(false);
          fetchProgramDetails();
        }
      })
      .catch((error) => {
        console.error('Error creating version:', error);
      });
  };

  const handleVesionEdit = (record) => {
    console.log('record:', record);
    navigate(`/program/version/edit/${uuid}/${record.uuid}`);
  };

  const handlerRunAction = (record) => {
    navigate(`/program/action/run/${uuid}/${record.uuid}`);
  };

  // const showEditModal = (record) => {
  //     setSelectedRecord(record);
  //     setEditModalVisible(true);
  // };

  // const showDeleteModal = (record) => {
  //     setSelectedRecord(record);
  //     setDeleteModalVisible(true);
  // };

  //  const handleEditConfirm = () => {
  // Handle edit confirmation here
  // You can access the selected record using `selectedRecord` state
  // Close the modal and perform necessary operations
  // setEditModalVisible(false);
  // };

  // const handleDeleteConfirm = () => {
  // Handle delete confirmation here
  // You can access the selected record's uuid using `selectedRecord.uuid`
  // Close the modal and perform necessary operations
  // setDeleteModalVisible(false);
  //  };

  //  const handleEditCancel = () => {
  //    setEditModalVisible(false);
  //  };

  // const handleDeleteCancel = () => {
  //     setDeleteModalVisible(false);
  // };

  useEffect(() => {
    fetchProgramDetails();
  }, []);

  const handlerAddAction = () => {
    navigate(`/program/action/add/${uuid}`);
  };

  const handlerActionInfo = (record) => {
    navigate(`/program/action/detail/${record.uuid}`);
  };

  return (
    <Card bodyStyle={{ padding: 0 }} style={{ width: '100%', overflow: 'auto' }}>
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ margin: 0 }}>Version List</h3>
        <Button type="primary" onClick={handleAddVersionClick}>
          Add Version
        </Button>
      </div>

      <Table
        dataSource={versions}
        style={{ whiteSpace: 'nowrap' }}
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
                <Button
                  style={{ marginLeft: '10px' }}
                  danger
                  onClick={() => handleDeleteButtonClick(record.uuid)}
                  key="delete"
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        rowKey="uuid"
      />

      <Modal
        visible={deleteConfirmVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>你确定要删除这个版本吗?</p>
      </Modal>
      <Modal
        visible={showAddVersionModal}
        title="Add Version"
        onCancel={handleAddVersionModalCancel}
        footer={[
          <Button key="cancel" onClick={handleAddVersionModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" form="addVersionForm" htmlType="submit">
            Submit
          </Button>,
        ]}
      >
        <Form
          id="addVersionForm"
          onFinish={handleAddVersionModalSubmit}
          initialValues={{ version: '', releaseNote: '' }}
          layout="vertical" // 设置表单布局为垂直布局
        >
          <Form.Item
            label="Version"
            name="version"
            rules={[{ required: true, message: 'Please enter the version number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Release Note"
            name="releaseNote"
            rules={[{ required: true, message: 'Please enter the release note' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <br />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ margin: 0 }}>Program Action List</h3>
        <Button type="primary" onClick={handlerAddAction}>
          Add Action
        </Button>
      </div>

      <Table
        style={{ whiteSpace: 'nowrap' }}
        dataSource={programActions}
        columns={[
          { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Status', dataIndex: 'status', key: 'status' },
          { title: 'Description', dataIndex: 'description', key: 'description' },
          { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
          { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
          {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
              <div>
                <Button type="primary" onClick={() => handlerRunAction(record)} key="run-action">
                  Run
                </Button>

                <Button onClick={() => handlerActionInfo(record)} key="run-action-info">
                  详情
                </Button>
              </div>
            ),
          },
        ]}
        rowKey="uuid"
      />
    </Card>
  );
};

export default ProgramDetails;
