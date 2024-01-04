const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_ATLAS_CONNECTION;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await client.connect();
    const database = client.db('Skin-Tracker');
    const lastSeenCollection = database.collection('Last-Seen');

    switch (event.httpMethod) {
      case 'GET':
        // Handle read last seen time for a specific item
        const query = event.queryStringParameters;
        if (!query || !query.itemName) {
          return { statusCode: 400, body: 'Item name query parameter is required' };
        }
        const lastSeenData = await lastSeenCollection.findOne({ itemName: query.itemName });
        return {
          statusCode: 200,
          body: JSON.stringify(lastSeenData),
        };

      case 'POST':
        // Handle update last seen time for a specific item
        const data = JSON.parse(event.body);
        if (!data.itemName || !data.lastSeenDate) {
          return { statusCode: 400, body: 'Item name and last seen date are required' };
        }
        await lastSeenCollection.updateOne(
          { itemName: data.itemName },
          { $set: { lastSeenDate: new Date(data.lastSeenDate) } },
          { upsert: true }
        );
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Last seen time updated' }),
        };

      default:
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error accessing last seen data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error accessing last seen data' }),
    };
  } finally {
    await client.close();
  }
};