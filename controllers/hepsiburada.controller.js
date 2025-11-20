const axios = require("axios");

exports.getProducts = async (req, res) => {
  try {
    const url = `https://mpop.hepsiburada.com/api/products/merchantid/${process.env.HEPSIBURADA_MERCHANTID}`;

    const result = await axios.get(url, {
      headers: {
        "Authorization": process.env.HEPSIBURADA_API_KEY,
        "Content-Type": "application/json",
      },
    });

    return res.json({ success: true, data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const url = `https://mpop.hepsiburada.com/api/orders/merchantid/${process.env.HEPSIBURADA_MERCHANTID}`;

    const result = await axios.get(url, {
      headers: {
        "Authorization": process.env.HEPSIBURADA_API_KEY,
        "Content-Type": "application/json",
      },
    });

    return res.json({ success: true, data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOrderDetail = async (req, res) => {
  try {
    const orderId = req.params.id;

    const url = `https://mpop.hepsiburada.com/api/orders/${orderId}`;

    const result = await axios.get(url, {
      headers: {
        "Authorization": process.env.HEPSIBURADA_API_KEY,
        "Content-Type": "application/json",
      },
    });

    return res.json({ success: true, data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
