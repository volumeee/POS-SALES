import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Input,
  Table,
  Tag,
  Modal,
  Row,
  Col,
  InputNumber,
  Select,
} from "antd";
import {
  fetchCustomerDetail,
  updateCustomerProduct,
} from "../../../features/customersSlice";
import { fetchProducts } from "../../../features/productSlice";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumb } from "../../../features/breadCrumbSlice";

const { Option } = Select;

const CustomerDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customerDetail = useSelector((state) => state.customers.customerDetail);
  const status = useSelector((state) => state.customers.status);
  const products = useSelector((state) => state.products.products);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomerDetail(id));
    dispatch(fetchProducts());
  }, [dispatch, id]);

  useEffect(() => {
    if (customerDetail) {
      form.setFieldsValue({
        name: customerDetail.name,
        email: customerDetail.email,
        phone: customerDetail.phone,
        address: customerDetail.address,
      });

      dispatch(
        setBreadcrumb({
          url: `/customers/${id}`,
          name: customerDetail.name,
        })
      );
    }
  }, [customerDetail, form, dispatch, id]);

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

  const showModal = (item) => {
    const selectedProduct = products.find(
      (product) => product.id === item.product_id
    );
    setSelectedItem({
      ...item,
      price: selectedProduct?.price || 0,
      transaction_item_id: item.transaction_item_id,
    });
    editForm.setFieldsValue({
      productId: item.product_id,
      quantity: item.quantity,
    });
    setIsModalVisible(true);
    console.log(item.transaction_item_id);
  };

  const handleProductChange = () => {
    const selectedProduct = products.find(
      (product) => product.id === editForm.getFieldValue("productId")
    );
    const quantity = editForm.getFieldValue("quantity") || 0;
    if (selectedProduct) {
      setSelectedItem({
        ...selectedItem,
        price: selectedProduct.price,
        quantity,
      });
    }
  };

  const handleOk = () => {
    editForm.validateFields().then((values) => {
      if (selectedItem) {
        dispatch(
          updateCustomerProduct({
            customerId: id,
            transactionItemId: selectedItem.transaction_item_id,
            quantity: values.quantity,
            newProductId: values.productId,
          })
        ).then(() => {
          setIsModalVisible(false);
          dispatch(fetchCustomerDetail(id));
        });
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const transactionColumns = [
    {
      title: "No",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Payment Status",
      key: "payment_status",
      dataIndex: "payment_status",
      render: (status) => (
        <Tag color={status === "PENDING" ? "volcano" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => formatDate(date),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => formatDate(date),
    },
  ];

  const itemColumns = [
    {
      title: "Product ID",
      dataIndex: "product_id",
      key: "product_id",
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => showModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          navigate("/customers");
        }}
        style={{ marginBottom: 16 }}
      >
        Back to Customer List
      </Button>

      <Card title="Customer Details" loading={status === "loading"}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input readOnly />
          </Form.Item>
        </Form>
      </Card>

      <Card title="Customer Transactions" style={{ marginTop: 16 }}>
        <Table
          dataSource={customerDetail?.transactions}
          columns={transactionColumns}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender: (record) => (
              <Table
                dataSource={record.items}
                columns={itemColumns}
                pagination={false}
                rowKey={(item) => item.id}
              />
            ),
          }}
        />
      </Card>

      <Modal
        title="Edit Product"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form form={editForm} layout="vertical">
              <Form.Item
                name="productId"
                label="Product"
                rules={[{ required: true, message: "Please select a product" }]}
              >
                <Select onChange={handleProductChange}>
                  {products.map((product) => (
                    <Option key={product.id} value={product.id}>
                      {product.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[
                  { required: true, message: "Please input the quantity" },
                ]}
              >
                <InputNumber min={1} onChange={handleProductChange} />
              </Form.Item>
            </Form>
          </Col>
          <Col span={12}>
            <h4>Summary</h4>
            <p>Total Products: {selectedItem?.quantity || 0}</p>
            <p>Total Price: {formatCurrency(selectedItem?.price || 0)}</p>
            <p>
              Total Amount:{" "}
              {formatCurrency(
                selectedItem?.price * selectedItem?.quantity || 0
              )}
            </p>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default CustomerDetail;
