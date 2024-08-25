import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
  Tag,
  Pagination,
  theme,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../features/productSlice";

const ProductTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const showModal = (product = null) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, ...values }));
        message.success("Product updated successfully");
      } else {
        await dispatch(addProduct(values));
        message.success("Product added successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      dispatch(fetchProducts()); // Refresh products list after adding/updating
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    message.success("Product deleted successfully");
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.price.toString().includes(searchQuery) ||
      product.stock.toString().includes(searchQuery)
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 250,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (amount) => formatCurrency(amount),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: 120,
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_, record) => (
        <Tag color={record.deleted_at ? "volcano" : "green"}>
          {record.deleted_at ? "Inactive" : "Active"}
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
      width: 200,
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          >
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
            New Product
          </Button>
          <Input
            placeholder="Search products"
            prefix={<SearchOutlined />}
            style={{ width: 200, marginLeft: 8 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={status === "loading"}
          scroll={{ x: 1200 }}
          pagination={
            <Pagination defaultCurrent={1} total={filteredProducts.length} />
          }
        />
      </div>

      <Modal
        title={editingProduct ? "Edit Product" : "New Product"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductTable;
