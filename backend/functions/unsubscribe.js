const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_ATLAS_CONNECTION;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false; // reuse the DB connection

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
    const mailingList = database.collection('Mailing-List');

    // Remove the subscriber
    const result = await mailingList.deleteOne({ email: data.email });
    if (result.deletedCount === 0) {
      return { statusCode: 404, body: 'Subscriber not found' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Unsubscription successful' }),
    };
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error unsubscribing from mailing list' }),
    };
  } finally {
    await client.close();
  }
};
