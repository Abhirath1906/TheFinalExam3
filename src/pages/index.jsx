import {
  Layout,
  Drawer,
  Menu,
  Divider,
  Table,
  Input,
  Select,
  Button,
  Skeleton,
  Space,
  Modal,
  Form,
  InputNumber,
  message,
  Popconfirm
} from "antd"
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext"

const { Header, Content, Footer } = Layout
const { Search, TextArea } = Input

export async function getServerSideProps() {
  const res = await fetch("https://course.summitglobal.id/products")
  const data = await res.json()

  return {
    props: {
      products: data?.body?.data || []
    }
  }
}

export default function Home({ products }) {

  const [Open, setOpen] = useState(false)
  const [data, setData] = useState(products || [])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [category, setCategory] = useState(null)

  const [OpenMo, setOpenMo] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState(null)

  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const { theme, toggleTheme } = useAppContext()
  const { selectedCategory, setSelectedCategory } = useAppContext()

  const handleRefresh = async () => {
    try {
      setLoading(true)
      const res = await fetch("https://course.summitglobal.id/products")
      const data = await res.json()
      setData(data?.body?.data || [])
    } catch {
      message.error("Failed refresh")
    } finally {
      setLoading(false)
      message.success("Success refresh")
    }
  }


  const handleAddProduct = (values) => {
    const newProduct = { id: Date.now(), ...values }

    setData(prev => [newProduct, ...prev])

    message.success("Product added")
    setOpenMo(false)
    form.resetFields()
  }


  const handleUpdateProduct = (values) => {
    setData(prev =>
      prev.map(item =>
        item.id === editData.id ? { ...item, ...values } : item
      )
    )

    message.success("Product updated")
    setOpenEdit(false)
    editForm.resetFields()
  }


  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id))
    message.success("Product deleted")
  }

  const filteredData = useMemo(() => {
    return selectedCategory
      ? data.filter(item => item.category === selectedCategory)
      : data
  }, [data, selectedCategory])

  const categories = [...new Set((data || []).map(item => item.category))]

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (img) => (
        <img
          src={img || "https://via.placeholder.com/60"}
          width={60}
          height={60}
          style={{ objectFit: "cover" }}
        />
      )
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rp ${price}`
    },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            onClick={() => {
              setEditData(record)
              editForm.setFieldsValue(record)
              setOpenEdit(true)
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger type="default">Delete</Button>
          </Popconfirm>

          <Link href={`/productss/${record.id}`}>
            <Button>Details</Button>
          </Link>
        </Space>
      )
    }
  ]

  return (
    <>
      <Layout>

        <Drawer
          open={Open}
          onClose={() => setOpen(false)}
          placement="left"
          style={{ backgroundColor: "black", color: "white" }}
        >
          <Menu theme="dark" mode="inline" style={{ backgroundColor: "black" }}>
            <Menu.Item>
              <Link href="/">Home</Link>

            </Menu.Item>
            <Menu.Item>
              <Link href="/Dashboard">Dashboard</Link>

            </Menu.Item>

            <Menu.Item>
              <Button onClick={toggleTheme}>
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </Button>
            </Menu.Item>
          </Menu>
        </Drawer>

        <Header style={{ backgroundColor: "black", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <MenuOutlined
              onClick={() => setOpen(true)}
              style={{ fontSize: "30px", marginTop: "-30px" }}
            />
            <p style={{ fontSize: "40px" }}>The Final Exam</p>
          </div>
        </Header>

        <Content style={{
          padding: "50px", height: "150vh", backgroundColor: theme === "dark" ? "#020617" : "white",
          color: theme === "dark" ? "white" : "black",
          transition: "0.4s",
        }}>

          <p style={{ fontSize: "50px" }}>Product List</p>
          <Divider />

          <Space style={{ marginBottom: 20, gap: "30px" }} wrap>
            <Search
              placeholder="Search product..."
              allowClear
              style={{ width: 200 }}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <Select
              placeholder="Filter Category"
              allowClear
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              style={{ width: 200 }}
            >
              {categories.map(cat => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>

            <Button onClick={() => setOpenMo(true)} type="primary">
              Add
            </Button>

            <Button onClick={handleRefresh}>
              Refresh
            </Button>
          </Space>

          {loading ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          )}
        </Content>

        <Footer style={{ backgroundColor: "black", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>Made By Abhirath</p>
          </div>
        </Footer>


        <Modal
          title="Add Product"
          open={OpenMo}
          onCancel={() => setOpenMo(false)}
          onOk={() => form.submit()}
        >
          <Form layout="vertical" form={form} onFinish={handleAddProduct}>
            <Form.Item name="name" label="Name" rules={[{ required: true,message:"Please Type the product name......" }]}>
              <Input placeholder="Product name"/>
            </Form.Item>

            <Form.Item name="description" label="Description" rules={[{ required: true,message:"Please Type the product des......" }]}>
              <TextArea rows={3} placeholder="Product des"/>
            </Form.Item>

            <Form.Item name="price" label="Price" rules={[{ required: true,message:"Please Type the product price......" }]}>
              <InputNumber style={{ width: "100%" }} placeholder="Product price" />
            </Form.Item>

            <Form.Item name="stock" label="Stock" rules={[{ required: true,message:"Please Type the product stock....." }]}>
              <InputNumber style={{ width: "100%" }} placeholder="Product stock" />
            </Form.Item>

            <Form.Item name="category" label="Category" rules={[{ required: true,message:"Please Type the product category......" }]}>
              <Input placeholder="Product category"/>
            </Form.Item>

            <Form.Item name="image" label="Image URL" rules={[{ required: true,message:"Please Type the image URL......" }]}>
              <Input placeholder="Product image(URL)"/>
            </Form.Item>
          </Form>
        </Modal>


        <Modal
          title="Edit Product"
          open={OpenEdit}
          onCancel={() => setOpenEdit(false)}
          onOk={() => editForm.submit()}
        >
          <Form layout="vertical" form={editForm} onFinish={handleUpdateProduct}>
            <Form.Item name="name" label="Name" rules={[{ required: true,message:"Please Type the product name......" }]}>
              <Input placeholder="Product name"/>
            </Form.Item>

            <Form.Item name="description" label="Description" rules={[{ required: true,message:"Please Type the product des......" }]}>
              <TextArea rows={3} placeholder="Product des"/>
            </Form.Item>

            <Form.Item name="price" label="Price" rules={[{ required: true,message:"Please Type the product price......" }]}>
              <InputNumber style={{ width: "100%" }}  placeholder="Product price"/>
            </Form.Item>

            <Form.Item name="stock" label="Stock" rules={[{ required: true,message:"Please Type the product stock....." }]}>
              <InputNumber style={{ width: "100%" }} placeholder="Product stock"/>
            </Form.Item>

            <Form.Item name="category" label="Category" rules={[{ required: true,message:"Please Type the product category......" }]}>
              <Input placeholder="Product category"/>
            </Form.Item>

            <Form.Item name="image" label="Image URL" rules={[{ required: true,message:"Please Type the image URL......" }]}>
              <Input placeholder="Product image(URL)"/>
            </Form.Item>
          </Form>
        </Modal>

      </Layout>
    </>
  )
}
