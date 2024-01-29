const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_ATLAS_CONNECTION;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  const itemNameToCheck = process.env.SKIN_TO_TRACK.toLowerCase(); 

  try {
    await client.connect();
    const database = client.db('Skin-Tracker');
    const lastSeenCollection = database.collection('Last-Seen');

    const response = await axios.get('https://fortnite-api.com/v2/shop/br');
    const items = response.data.data.featured.entries.flatMap(entry => entry.items);
    const itemFound = items.some(item => item.name.toLowerCase() === itemNameToCheck);

    if (itemFound) {
      await sendEmailAlert(itemNameToCheck, client);
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

async function sendEmailAlert(itemName, client) {
  // fetch the mailing list from the database
  const database = client.db('Skin-Tracker');
  const mailingListCollection = database.collection('Mailing-List');

  const subscribers = await mailingListCollection.find({}).toArray();

  // Send an email to each subscriber individually
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  subscribers.forEach(async (subscriber) => {
    const unsubscribeLink = `https://itemshoptracker.netlify.app/.netlify/functions/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: subscriber.email, 
      subject: `Fortnite Item Available: ${itemName}`,
      text: `The item "${itemName}" is now available in the shop!\n\nIf you no longer wish to receive these emails, you can unsubscribe at any time by clicking the link below:\n${unsubscribeLink}`,
      html: `<p>The item "<strong>${itemName}</strong>" is now available in the shop!</p><p>If you no longer wish to receive these emails, you can <a href="${unsubscribeLink}">unsubscribe</a> at any time.</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  });
}