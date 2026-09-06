// Vercel Serverless Function: /api/register
let memoryRegistrations = [
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
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const role = body.role || 'farmer';
      const fullName = (body.fullName || '').trim();
      const phone = (body.phone || '').trim().replace(/\D/g, '');

      if (!fullName || !phone) {
        return res.status(400).json({ error: 'Full Name and Phone Number are required' });
      }

      const newRecord = {
        ...body,
        id: 'reg_' + Math.random().toString(36).substring(2, 11),
        phone: phone,
        createdAt: new Date().toISOString()
      };

      memoryRegistrations.unshift(newRecord);
      return res.status(201).json(newRecord);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON payload: ' + e.message });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json(memoryRegistrations);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
