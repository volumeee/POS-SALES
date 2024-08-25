import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
  Pagination,
  theme,
  Tag,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  fetchCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  activateCustomer,
  deactivateCustomer,
} from "../../../features/customersSlice";
import { useNavigate } from "react-router-dom";

const CustomerTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);
  const status = useSelector((state) => state.customers.status);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCustomers());
    }
  }, [status, dispatch]);

  const showModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalVisible(true);
    if (customer) {
      form.setFieldsValue(customer);
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingCustomer) {
        dispatch(updateCustomer({ id: editingCustomer.id, ...values }));
      } else {
        dispatch(addCustomer(values));
      }
      setIsModalVisible(false);
      form.resetFields();
      message.success(
        `Customer ${editingCustomer ? "updated" : "added"} successfully`
      );
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteCustomer(id));
    message.success("Customer deleted successfully");
  };

  const handleStatusChange = (record) => {
    const isCurrentlySuspended = !!record.deleted_at;
    const statusAction = isCurrentlySuspended
      ? activateCustomer
      : deactivateCustomer;
    const statusText = isCurrentlySuspended ? "activate" : "suspend";

    Modal.confirm({
      title: `Change status to ${
        isCurrentlySuspended ? "Active" : "Suspended"
      }?`,
      content: `Are you sure you want to ${statusText} this customer?`,
      onOk: () => {
        dispatch(statusAction(record.id)).then(() => {
          dispatch(fetchCustomers());
          message.success(
            `Customer ${
              isCurrentlySuspended ? "activated" : "suspended"
            } successfully`
          );
        });
      },
    });
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_, record) => (
        <Tag
          color={record.deleted_at ? "volcano" : "green"}
          onClick={() => handleStatusChange(record)}
          style={{ cursor: "pointer" }}
        >
          {record.deleted_at ? "Suspended" : "Active"}
        </Tag>
      ),
      sorter: (a, b) => {
        const statusA = a.deleted_at ? 1 : 0;
        const statusB = b.deleted_at ? 1 : 0;
        return statusA - statusB;
      },
    },
    {
      title: "Action",
      fixed: "right",
      key: "action",
      width: 250,
      render: (_, record) => (
        <>
          <Button
            type="default"
            icon={<ExportOutlined />}
            onClick={() => handleViewDetails(record.id)}
            style={{ marginRight: 8 }}
          ></Button>
          <Button type="primary" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            New Customer
          </Button>
          <Input
            placeholder="Search customers"
            prefix={<SearchOutlined />}
            style={{ width: 200, marginLeft: 8 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={filteredCustomers}
            rowKey="id"
            loading={status === "loading"}
            scroll={{ x: 1200 }}
            pagination={<Pagination defaultCurrent={6} total={500} />}
          />
        </div>
      </div>

      <Modal
        title={editingCustomer ? "Edit Customer" : "New Customer"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerTable;
