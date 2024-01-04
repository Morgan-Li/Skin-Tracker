const axios = require('axios');
const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  const itemNameToCheck = 'Champion KYRA'; 

  try {
    const response = await axios.get('https://fortnite-api.com/v2/shop/br');
    const items = response.data.data.featured.entries.flatMap(entry => entry.items);
    const itemFound = items.some(item => item.name.toLowerCase() === itemNameToCheck.toLowerCase());

    if (itemFound) {
      await sendEmailAlert(itemNameToCheck);
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

async function sendEmailAlert(itemName) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "me@gmail.com", 
        pass: "cat" 
      }
    });
  
    const mailOptions = {
      from: "me@gmail.com", 
      to: 'morgan-li@example.com',
      subject: `Fortnite Item Available: ${itemName}`, 
      text: `The item "${itemName}" is now available in the shop!`, 
      html: `<p>The item "<strong>${itemName}</strong>" is now available in the shop!</p>`
    };
  
    await transporter.sendMail(mailOptions);
  }