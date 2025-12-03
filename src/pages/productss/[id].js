import {
  Layout,
  Drawer,
  Menu,
  Divider,
  Card,
  Button,
  Tag,
  Skeleton,
} from "antd"
import { MenuOutlined } from "@ant-design/icons"
import Link from "next/link"
import { useState } from "react"
import { useAppContext } from "@/context/AppContext"
import { useRouter } from "next/router"

const { Header, Content, Footer } = Layout

export async function getServerSideProps(context) {
  const { id } = context.query

  try {
    const res = await fetch("https://course.summitglobal.id/products")
    const data = await res.json()

    const products = data?.body?.data || []

    const product = products.find(
      item => String(item.id || item._id) === String(id)
    )

    if (!product) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        product
      }
    }
  } catch (error) {
    return {
      props: {
        product: null
      }
    }
  }
}

export default function ProductDetail({ product }) {
  const [Open, setOpen] = useState(false)
  const { theme, toggleTheme } = useAppContext()
  const router = useRouter()

  if (!product) {
    return (
      <Layout>
        <Content style={{ padding: 100 }}>
          <h1>Product not found</h1>
          <Link href="/">
            <Button>Back</Button>
          </Link>
        </Content>
      </Layout>
    )
  }

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
          <p style={{ fontSize: "40px" }}>The Final Exam</p>
        </div>
      </Header>





      <Content
        style={{
          padding: "50px",
          minHeight: "120vh",
          backgroundColor: theme === "dark" ? "#020617" : "white",
          color: theme === "dark" ? "white" : "black",
          transition: "0.4s",
        }}
      >


        <p style={{fontSize:"50px"}}>Product Details</p>
        <Divider />

        <Button onClick={() => router.back()} style={{ marginBottom: 20 }}>Back</Button>


        <Card style={{ maxWidth: 600, margin: "0 auto" }}>
          <img
            src={product.image}
            style={{
              width: "100%",
              height: 300,
              objectFit: "cover",
              marginBottom: 20,
            }}
          />

          <h1>{product.name}</h1>
          <p><b>Category:</b> {product.category}</p>
          <p><b>Price:</b> Rp {product.price}</p>

          {product.stock === 0 ? (
            <Tag color="red">OUT OF STOCK</Tag>
          ) : (
            <Tag color="green">Stock: {product.stock}</Tag>
          )}

          <Divider />

          <p>{product.description || "No description available"}</p>
        </Card>
      </Content>

      
      <Footer style={{ backgroundColor: "black", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p>Made By Abhirath</p>
        </div>
      </Footer>
    </Layout>
  )
}
