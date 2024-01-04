const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_ATLAS_CONNECTION;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  const itemNameToCheck = 'Champion KYRA'.toLowerCase(); 

  try {
    await client.connect();
    const database = client.db('Skin-Tracker');
    const lastSeenCollection = database.collection('Last-Seen');

    const response = await axios.get('https://fortnite-api.com/v2/shop/br');
    const items = response.data.data.featured.entries.flatMap(entry => entry.items);
    const itemFound = items.some(item => item.name.toLowerCase() === itemNameToCheck);

    if (itemFound) {
      //await sendEmailAlert(itemNameToCheck);
      console.log(`Item found: ${itemNameToCheck}`);

      await lastSeenCollection.updateOne(
        { itemName: itemNameToCheck },
        { $set: { lastSeenDate: new Date() } },
        { upsert: true }
      );
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
        user: process.env.EMAIL_USERNAME, 
        pass: process.env.EMAIL_PASSWORD  
      }
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USERNAME, 
      to: 'recipient@example.com',
      subject: `Fortnite Item Available: ${itemName}`, 
      text: `The item "${itemName}" is now available in the shop!`, 
      html: `<p>The item "<strong>${itemName}</strong>" is now available in the shop!</p>`
    };
  
    await transporter.sendMail(mailOptions);
  }