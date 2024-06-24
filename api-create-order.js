import { createOrder } from '../../lib/orders';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const order = await createOrder(req.body);
      res.status(201).json({ order });
    } catch (error) {
      res.status(500).json({ error: 'Order creation failed. Please try again.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
