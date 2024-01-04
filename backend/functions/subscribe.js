const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_ATLAS_CONNECTION;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false; // enables reusing the DB connection

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);
  if (!data.email) {
    return { statusCode: 400, body: 'Email address is required' };
  }

  try {
    await client.connect();
    const database = client.db('Skin-Tracker');
    const subscribers = database.collection('Mailing-List');

    // Check if the email already exists
    const existingSubscriber = await subscribers.findOne({ email: data.email });
    if (existingSubscriber) {
      return { statusCode: 409, body: 'Email already subscribed' };
    }

    // Add the new subscriber
    const subscriber = { email: data.email, dateSubscribed: new Date() };
    await subscribers.insertOne(subscriber);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscription successful' }),
    };
  } catch (error) {
    console.error('Error subscribing:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error subscribing to mailing list' }),
    };
  }
};
