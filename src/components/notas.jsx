
import { Col, Row, Table, Modal, Button, Input, Form, Popconfirm, Select } from "antd";
import { useEffect, useState } from "react";
import axios from 'axios';

function Notas() {

    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'nota',
            dataIndex: 'nota',
            key: 'nota',
        },
        {
            title: 'User',
            render(id, row,) {
                return row.User.name
            }
        },
        {
            title: 'Options',
            dataIndex: 'Options',
            key: 'Options',
            render: (value, row) => {
                return (
                    <>
                        <Button type="primary" onClick={() => showModalEdit(row.id)} style={{ marginRight: '4px' }} >Edit </Button>
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this nota?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => confirm(row.id)}
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    </>
                )
            }
        },

    ];

    const getData = async () => {
        let responseNotas = await axios.get('http://localhost:3000/notas')
        setData(responseNotas.data)
        let responseUsers = await axios.get('http://localhost:3000/users');
        const users = responseUsers.data.map((element) => ({ label: element.name, value: element.id }));
        setUsers(users);
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
        setIsUpdate(false)
    };

    const showModalEdit = async (id) => {
        setIsUpdate(true)
        setIsModalOpen(true)
        let response = await axios.get(`http://localhost:3000/notas/${id}`)
        const dato = response.data
        const datos = { nota: dato.nota, id: dato.id, userID: dato.User.id }
        form.setFieldsValue(datos)
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        form.resetFields()
        setIsModalOpen(false);
        setIsUpdate(false);
    };

    const onfinish = async (values) => {
        console.log(values)
        const notaID = values.id
        let { id, ...dato } = values;
        if (isUpdate) {
            let response = await axios.put(`http://localhost:3000/notas/${notaID}`, dato)
        } else {
            let response = await axios.post('http://localhost:3000/notas', dato)
        }
        getData()
        form.resetFields()
        handleCancel()
    }

    const confirm = async (id) => {
        await axios.delete(`http://localhost:3000/notas/${id}`)
        getData()
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Create new Nota
            </Button>
            <Modal title="New Nota"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={''}
            >
                <Form
                    form={form}
                    onFinish={onfinish}>
                    <Form.Item
                        name="nota"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Nota!',
                            },
                        ]}
                    >
                        <Input placeholder="Nota" />
                    </Form.Item>

                    <Form.Item
                        name="id"
                        hidden
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        name='userID'
                    >
                        <Select
                            name="userID"
                            placeholder="Please select a User"
                            options={users} />

                    </Form.Item>



                    <Form.Item>
                        {isUpdate ?
                            (<Button block type="primary" htmlType="submit">
                                Update
                            </Button>) :
                            (<Button block type="primary" htmlType="submit">
                                Create
                            </Button>)
                        }
                    </Form.Item>

                </Form>
            </Modal>
            <Row>
                <Col md={24} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Table rowKey={'id'} dataSource={data} columns={columns} />
                </Col>
            </Row>
        </>
    )
}

export default Notas
