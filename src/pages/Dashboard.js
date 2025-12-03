import {
  Layout,
  Drawer,
  Menu,
  Divider,
  Card,
  Row,
  Col,
  Skeleton,
  Tag,
  Button
} from "antd"
import { MenuOutlined } from "@ant-design/icons"
import Link from "next/link"
import React, { useState, useEffect, useMemo } from "react"
import { useAppContext } from "@/context/AppContext"

const { Header, Content, Footer } = Layout

export async function getServerSideProps() {
  const res = await fetch("https://course.summitglobal.id/products")
  const data = await res.json()

  return {
    props: {
      products: data?.body?.data || []
    }
  }
}

export default function Dashboard({ products }) {
  const [Open, setOpen] = useState(false)
  const [randomProduct, setRandomProduct] = useState(null)
  const [loadingRandom, setLoadingRandom] = useState(true)

  const { theme, toggleTheme, setSelectedCategory } = useAppContext()


  useEffect(() => {
    if (!products || products.length === 0) return
    const random = products[Math.floor(Math.random() * products.length)]
    setRandomProduct(random)
    setLoadingRandom(false)
  }, [products])

  const categories = useMemo(() => {
    return [...new Set(products.map(item => item.category))]
  }, [products])


  const outOfStock = products.filter(item => item.stock === 0)

  return (
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
          <p style={{ fontSize: "40px" }}>Dashboard</p>
        </div>
      </Header>


      <Content
        style={{
          padding: "50px",
          height: "150vh",
          backgroundColor: theme === "dark" ? "#020617" : "white",
          color: theme === "dark" ? "white" : "black",
          transition: "0.4s",
        }}
      >
        <p style={{ fontSize: "32px", fontWeight: "bold" }}>The Dashboard</p>
        <Divider />


        <Row style={{ display: "flex", justifyContent: "center", gap: "100px" }} gutter={20}>
          <Col span={8}>
            <Card style={{ height: "250px" }} title="Total Products">
              <h1 style={{ fontSize: "48px", textAlign: "center" }}>
                {products.length}
              </h1>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Random Product">
              {loadingRandom ? (
                <Skeleton active paragraph={{ rows: 5 }} />
              ) : randomProduct ? (
                <>
                  <p><b>{randomProduct.name}</b></p>
                  <p>{randomProduct.category}</p>
                  <p>Rp {randomProduct.price}</p>

                  {randomProduct.stock === 0 ? (
                    <Tag color="red">OUT OF STOCK</Tag>
                  ) : (
                    <p>Stock: {randomProduct.stock}</p>
                  )}
                </>
              ) : (
                <p>Failed to load random product</p>
              )}
            </Card>
          </Col>
        </Row>


        <Divider style={{ marginTop: "100px" }}>
          <p>The Categories</p>
        </Divider>

        <div style={{ marginTop: "50px", display: "flex", justifyContent: "center" }}>
          <Card style={{ backgroundColor: "lightblue" }} title="Categories">
            {categories.map(cat => (
              <Card
                key={cat}
                hoverable
                onClick={() => setSelectedCategory(cat)}
                style={{
                  marginBottom: 8,
                  display: "inline-block",
                  margin: "10px",
                  cursor: "pointer"
                }}
              >
                {cat}
              </Card>
            ))}
          </Card>
        </div>


        <div style={{ marginTop: "100px" }}>
          <Divider />
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>Out of Stock Preview</p>

          <Row gutter={16}>
            {outOfStock.length === 0 ? (
              <p style={{ marginLeft: 10 }}>Tidak ada produk yang habis</p>
            ) : (
              outOfStock.map(item => (
                <Col key={item.id} span={6}>
                  <Card hoverable>
                    <img
                      src={item.image}
                      style={{ width: "100%", height: 150, objectFit: "cover" }}
                    />
                    <p><b>{item.name}</b></p>
                    <Tag color="red">OUT OF STOCK</Tag>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>




      </Content>
      {/* <Footer style={{backgroundColor:"black",color:"white"}}>
          <div style={{display:"flex",justifyContent:"center"}}>
            <p>Made By Abhirath</p>
          </div>
        </Footer> */}
    </Layout>
  )
}
