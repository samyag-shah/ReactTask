import { useEffect, useState } from "react";

import {
  Table,
  Tabs,
  Space,
  Button,
  Modal,
  Form,
  Input,
  message,
  InputNumber,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { addUser, deleteUser, editUser, restoreUser } from "./Redux/userSlice";

import "./App.css";

function App() {
  const [edit, setEdit] = useState(false);
  const [key, setKey] = useState();
  const [error, setError] = useState();
  const [activeTab, setActiveTab] = useState("1");

  const [form] = Form.useForm();

  const dataSource3 = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //Users Table
  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "name",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "age",
    },
    {
      title: "Mobile-no",
      dataIndex: "phoneNo",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              handleEdit(record);
              setKey(record.key);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(record.key)}>Delete</Button>
        </Space>
      ),
    },
  ];

  //deleted Users Table
  const columns1 = [
    {
      title: "Name",
      dataIndex: "username",
      key: "name",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "age",
    },
    {
      title: "Mobile-no",
      dataIndex: "phoneNo",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleRestore(record.key)}>Restore</Button>
        </Space>
      ),
    },
  ];

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const onFinish = (values) => {
    if (edit) {
      dispatch(editUser({ value: { ...values, key } }));
      setIsModalOpen(false);
      setEdit(false);
    } else {
      let data1 = dataSource3.users.find((data) => data.email === values.email);
      let data2 = dataSource3.deletedUsers.find(
        (data) => data.email === values.email
      );
      if (data1 || data2) {
        setError("Email already exist");
        return;
      } else {
        setError("");
        dispatch(addUser({ ...values, key: dataSource3.key }));
      }
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      username: record.username,
      email: record.email,
      phoneNo: record.phoneNo,
    });
    setEdit(true);
  };

  useEffect(() => {
    if (edit) {
      showModal();
    }
  }, [edit]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
    message.success("User Deleted Succesfully");
  };

  const handleRestore = (id) => {
    dispatch(restoreUser(id));
    setActiveTab("1");
    message.success("User Restored Successfully");
  };

  //Tabs
  const items = [
    {
      key: "1",
      label: `User`,
      children: (
        <>
          <Button className="main1" type="primary" onClick={showModal}>
            Add New User
          </Button>
          <Table
            dataSource={dataSource3.users}
            columns={columns}
            pagination={false}
          />
        </>
      ),
    },
    {
      key: "2",
      label: `Deleted Users`,
      children: (
        <Table
          dataSource={dataSource3.deletedUsers}
          columns={columns1}
          pagination={false}
        />
      ),
    },
  ];

  const hadleActive = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="main">
      <Tabs
        defaultActiveKey="1"
        items={items}
        activeKey={activeTab}
        onChange={hadleActive}
      />

      <Modal
        title={edit ? "Edit User" : "Add New User"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEdit(false);
          form.resetFields();
          setError("");
        }}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
              {
                whitespace: true,
                message: "Please input valid username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please input valid email!",
              },
            ]}
          >
            <Input disabled={edit} />
          </Form.Item>

          <Form.Item
            label="Phone No"
            name="phoneNo"
            rules={[
              {
                required: true,
                message: "Please input your phoneno!",
              },
              {
                validator: (_, value) => {
                  if (
                    value?.toString()?.length &&
                    (value.toString().length < 10 ||
                      value.toString().length > 10)
                  ) {
                    return Promise.reject("Phone length should be 10");
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <div className="error">
            <p>{error}</p>
          </div>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              {edit ? "Edit" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
