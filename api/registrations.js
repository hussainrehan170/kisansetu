// Vercel Serverless Function: /api/registrations
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json([
    {
      id: "reg_d5fabdaa0a32",
      role: "farmer",
      fullName: "Ramesh Jadhav",
      phone: "9876543210",
      createdAt: "2026-09-06T05:56:21.454Z",
      villageDistrict: "Yeola, Nashik",
      state: "Maharashtra",
      primaryCrops: "Onion, Wheat, Grapes"
    },
    {
      id: "reg_a664fc68352f",
      role: "buyer",
      fullName: "FreshMart Agro Manager",
      phone: "9812345678",
      createdAt: "2026-09-06T05:56:21.456Z",
      companyName: "FreshMart Agro Pvt Ltd",
      businessType: "Processor",
      location: "Vashi, Navi Mumbai"
    }
  ]);
}
