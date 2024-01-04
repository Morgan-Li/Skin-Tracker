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
        // Handle read last seen time
        const lastSeenData = await lastSeenCollection.findOne({});
        return {
          statusCode: 200,
          body: JSON.stringify(lastSeenData),
        };

      case 'POST':
        // Handle update last seen time
        const data = JSON.parse(event.body);
        await lastSeenCollection.updateOne({}, { $set: { lastSeenDate: new Date(data.lastSeenDate) } }, { upsert: true });
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
