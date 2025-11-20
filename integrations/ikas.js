// integrations/ikas.js
const axios = require('axios');

async function getIkasProducts(apiKey) {
  const url = "https://api.ikas.app/public/products";

  const res = await axios.get(url, {
    headers: {
      'X-Ikas-Api-Key': apiKey
    }
  });

  return res.data;
}

module.exports = { getIkasProducts };
