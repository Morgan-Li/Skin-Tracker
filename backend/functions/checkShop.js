const axios = require('axios');

exports.handler = async function(event, context) {
  const itemNameToCheck = 'Champion KyrA'; 

  try {
    const response = await axios.get('https://fortnite-api.com/v2/shop/br');
    const items = response.data.data.featured.entries.flatMap(entry => entry.items);
    const itemFound = items.some(item => item.name.toLowerCase() === itemNameToCheck.toLowerCase());

    if (itemFound) {
      console.log(`Item found: ${itemNameToCheck}`);
    } else {
      console.log(`Item not found: ${itemNameToCheck}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        itemFound: itemFound,
        message: itemFound ? `Item found: ${itemNameToCheck}` : `Item not found: ${itemNameToCheck}`
      })
    };
  } catch (error) {
    console.error("Error fetching Fortnite shop data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching shop data" })
    };
  }
};
