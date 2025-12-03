export default async function handler(req, res) {
    try {
      const response = await fetch("https://course.summitglobal.id/products");
      const data = await response.json();

      res.status(200).json({
        body: {
          data: data?.body?.data || []
        }
      });
  
    } catch (error) {
      res.status(500).json({
        body: {
          data: []
        },
        message: "Refresh Failed"
      });
    }
  }
  