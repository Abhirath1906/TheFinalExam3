// let products = [
//     {
//       id: 1,
//       name: "Kaos Polos",
//       description: "Kaos polos berbahan katun premium, nyaman digunakan sehari-hari.",
//       price: 75000,
//       stock: 100,
//       category: "Fashion",
//       image: "https://img.freepik.com/free-psd/blank-white-tshirt-wooden-hanger-mockup_191095-81044.jpg",
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     }
//   ]
  
//   export default function handler(req, res) {
//     // ✅ GET → ambil semua data
//     if (req.method === "GET") {
//       return res.status(200).json({
//         body: {
//           data: products
//         }
//       })
//     }
  
//     // ✅ POST → tambah data baru
//     if (req.method === "POST") {
//       try {
//         const newProduct = {
//           id: Date.now(),
//           ...req.body,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         }
  
//         products.unshift(newProduct)
  
//         return res.status(201).json({
//           message: "Product added",
//           body: {
//             data: products
//           }
//         })
//       } catch (err) {
//         return res.status(500).json({
//           message: "Failed to add product"
//         })
//       }
//     }
  
//     // ✅ PUT → update FULL PAYLOAD
//     if (req.method === "PUT") {
//       try {
//         const { id } = req.query
  
//         products = products.map(item =>
//           item.id == id
//             ? {
//                 ...item,
//                 ...req.body,
//                 updated_at: new Date().toISOString()
//               }
//             : item
//         )
  
//         return res.status(200).json({
//           message: "Product updated",
//           body: {
//             data: products
//           }
//         })
//       } catch (err) {
//         return res.status(500).json({
//           message: "Failed to update product"
//         })
//       }
//     }
  
//     // ✅ METHOD LAIN DITOLAK
//     return res.status(405).json({
//       message: "Method not allowed"
//     })
//   }
  

