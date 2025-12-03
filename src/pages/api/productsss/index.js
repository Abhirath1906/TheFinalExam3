export default async function handler(req, res) {
    const { method } = req
  
    if (method === "POST") {
      try {
        const response = await fetch("https://course.summitglobal.id/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
    
          },
          body: JSON.stringify(req.body)
        })
  
        const data = await response.json()
        return res.status(200).json(data)
      } catch (error) {
        return res.status(500).json({ message: "POST FAILED" })
      }
    }
  

    res.status(405).json({ message: "Method Not Allowed" })
  }
  