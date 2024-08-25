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
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  updateTransactionPaymentStatus,
} from "../../../features/transactionSlice";
import { useNavigate } from "react-router-dom";

const TransactionTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transaction.transactions);
  const status = useSelector((state) => state.transaction.status);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTransactions());
    }
  }, [status, dispatch]);

  const showModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsModalVisible(true);
    if (transaction) {
      form.setFieldsValue(transaction);
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingTransaction) {
        dispatch(updateTransaction({ id: editingTransaction.id, ...values }));
      } else {
        dispatch(addTransaction(values));
      }
      setIsModalVisible(false);
      form.resetFields();
      message.success(
        `Transaction ${editingTransaction ? "updated" : "added"} successfully`
      );
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteTransaction(id));
    message.success("Transaction deleted successfully");
  };

  const handlePaymentStatusChange = (record) => {
    const newStatus = record.payment_status === "paid" ? "unpaid" : "paid";
    dispatch(
      updateTransactionPaymentStatus({
        id: record.id,
        paymentStatus: newStatus,
      })
    ).then(() => {
      dispatch(fetchTransactions());
      message.success(`Transaction marked as ${newStatus}`);
    });
  };

  const handleViewDetails = (transactionId) => {
    navigate(`/transactions/${transactionId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
    },
    {
      title: "Transaction Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => formatCurrency(amount),
      sorter: (a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount),
    },
    {
      title: "Payment Status",
      key: "payment_status",
      width: 120,
      render: (_, record) => (
        <Tag
          color={record.payment_status === "SUCCESS" ? "green" : "volcano"}
          onClick={() => handlePaymentStatusChange(record)}
          style={{ cursor: "pointer" }}
        >
          {record.payment_status === "SUCCESS" ? "SUCCESS" : "PENDING"}
        </Tag>
      ),
      sorter: (a, b) => a.payment_status.localeCompare(b.payment_status),
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
            New Transaction
          </Button>
          <Input
            placeholder="Search transactions"
            prefix={<SearchOutlined />}
            style={{ width: 200, marginLeft: 8 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="id"
            loading={status === "loading"}
            scroll={{ x: 1200 }}
            pagination={<Pagination defaultCurrent={6} total={500} />}
          />
        </div>
      </div>

      <Modal
        title={editingTransaction ? "Edit Transaction" : "New Transaction"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="customer_name"
            label="Customer Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="created_at"
            label="Transaction Date"
            rules={[{ required: true, type: "date" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="total_amount"
            label="Total Amount"
            rules={[{ required: true, type: "number" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="payment_status"
            label="Payment Status"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TransactionTable;
