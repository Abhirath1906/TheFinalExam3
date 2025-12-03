export default async function handler(req, res) {
    const { id } = req.query
    const { method, body } = req
  
    try {
     
      if (method === "PUT") {
        const response = await fetch(
          `https://course.summitglobal.id/products/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        )
  
        if (!response.ok) {
          const text = await response.text()
          console.error("EXTERNAL API ERROR:", text)
          return res.status(500).json({ message: "External API error" })
        }
  
        const data = await response.json()
        return res.status(200).json(data)
      }
  

      if (method === "DELETE") {
        const response = await fetch(
          `https://course.summitglobal.id/products/${id}`,
          { method: "DELETE" }
        )
  
        const data = await response.json()
        return res.status(200).json(data)
      }
  
      return res.status(405).json({ message: "Method Not Allowed" })
    } catch (error) {
      console.error("API ERROR:", error)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
  