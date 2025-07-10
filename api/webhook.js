export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  // Get the data from the request body
  const data = req.body;

  console.log('Received POST:', data);

  // Example response
  res.status(200).json({ success: true, received: data });
}
