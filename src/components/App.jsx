import { Col, Row, Table, Modal, Button, Input, Form, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import axios from 'axios';
import Clients from "./clients";
import Notas from "./notas";

function App() {

  const [data, setData] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false)
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Last_name',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        text ? 'Activo' : 'Inactivo'
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => (
        text.slice(0, 10)
      )
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
              description="Are you sure to delete this user?"
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
    let response = await axios.get('http://localhost:3000/users')
    setData(response.data)
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    setIsUpdate(false)
  };

  const showModalEdit = async (id) => {
    setIsUpdate(true)
    setIsModalOpen(true)
    let response = await axios.get(`http://localhost:3000/users/${id}`)
    form.setFieldsValue(response.data)
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
    const idUser = values.id;
    const { id, ...data } = values;
    if (isUpdate) {
      let response = await axios.put(`http://localhost:3000/users/${idUser}`, data)
    } else {
      let response = await axios.post('http://localhost:3000/users', values)
    }
    getData()
    form.resetFields()
    handleCancel()
  }

  const confirm = async (id) => {
    await axios.delete(`http://localhost:3000/users/${id}`)
    getData()
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create new User
      </Button>
      <Modal title="New User"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={''}
      >
        <Form
          form={form}
          onFinish={onfinish}>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input placeholder="name" />
          </Form.Item>

          <Form.Item
            name="last_name"
            rules={[
              {
                required: true,
                message: 'Please input your lastname!',
              },
            ]}
          >
            <Input type="text" placeholder="lastname" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="id"
            hidden
          >
            <Input type="text" />
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
      <div>
        <Clients />
      </div>
      <div>
        <Notas />
      </div>
    </>
  )
}

export default App
