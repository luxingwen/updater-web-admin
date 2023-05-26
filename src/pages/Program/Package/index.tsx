import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table, Button, Modal, Form, Input, Select, message } from 'antd';

import { getProgramDetails, getProgramVersionDetails, getPackageList, createPackage } from '@/services/updater-server/api';

const ProgramDetailPage = () => {
    const { programUuid, versionUuid } = useParams();
    const [program, setProgram] = useState(null);
    const [version, setVersion] = useState(null);
    const [packages, setPackages] = useState([]);
    const [isAddPackageModalVisible, setIsAddPackageModalVisible] = useState(false);


    const systemArchitectures = [
        'x86',
        'x86_64',
        'arm',
        'arm64',
        'ppc',
        'ppc64',
        's390',
        's390x',
        'sparc',
        'sparc64',
        'ia64',
        'riscv',
    ];

    const osOptions = [
        { value: 'Windows', label: 'Windows' },
        { value: 'Mac', label: 'Mac' },
        { value: 'Linux', label: 'Linux' },
    ];


    const fetchProgramDetails = async () => {
        try {
            const response = await getProgramDetails({ uuid: programUuid });
            console.log('response:', response);
            if (response.code === 200) {
                setProgram(response.data);
            }

            const versionResponse = await getProgramVersionDetails({ uuid: versionUuid });
            console.log('versionResponse:', versionResponse);
            if (versionResponse.code === 200) {
                setVersion(versionResponse.data);
            }

            const packageResponse = await getPackageList({ versionUuid: versionUuid });
            console.log('packageResponse:', packageResponse);
            if (packageResponse.code === 200) {
                setPackages(packageResponse.data);
            }
        } catch (error) {
            console.error('Error fetching program details:', error);
        }
    };

    useEffect(() => {
        fetchProgramDetails();
    }, []);

    const handleAddPackage = async (newPackage) => {
        // Add package logic here
        console.log('New Package:', newPackage);

        const packageData: API.Package = {
            versionUuid: versionUuid,
            os: newPackage.os,
            arch: newPackage.arch,
            storagePath: newPackage.storagePath,
            downloadPath: newPackage.downloadPath,
            md5: newPackage.md5,
        };

        await createPackage(packageData).then((response) => {
            console.log('response:', response);
            if (response.code === 200) {
                message.success('Package created successfully!');
                setIsAddPackageModalVisible(false);
                fetchProgramDetails();
            }
        }).catch((error) => {
            message.error('Error creating package:', error);
        });


        // Close the modal
    };

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

            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Package List</span>
                        <Button type="primary" onClick={() => setIsAddPackageModalVisible(true)}>
                            Add Package
                        </Button>
                    </div>
                }
            >
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

            <Modal
                title="Add Package"
                visible={isAddPackageModalVisible}
                onCancel={() => setIsAddPackageModalVisible(false)}
                footer={null}
            >
                <Form
                    id="addPackageForm"
                    onFinish={handleAddPackage}
                    layout='vertical'
                    initialValues={{
                        os: '',
                        arch: '',
                        storagePath: '',
                        downloadPath: '',
                        md5: '',
                    }}
                >
                    <Form.Item name="os" label="OS" rules={[{ required: true, message: 'Please select the OS' }]}>
                        <Select>
                            {osOptions.map((option) => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="arch" label="Arch" rules={[{ required: true, message: 'Please select the Arch' }]}>
                        <Select placeholder="Select Arch">
                            {systemArchitectures.map(arch => (
                                <Select.Option key={arch} value={arch}>
                                    {arch}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="storagePath"
                        label="Storage Path"
                        rules={[{ required: true, message: 'Please enter the Storage Path' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="downloadPath"
                        label="Download Path"
                        rules={[{ required: true, message: 'Please enter the Download Path' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="md5" label="MD5" rules={[{ required: true, message: 'Please enter the MD5' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" form='addPackageForm'>
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProgramDetailPage;
