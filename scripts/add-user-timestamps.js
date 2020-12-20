const { MongoClient, ObjectId } = require('mongodb');
const moment = require('moment');

const dbName = 'development';

/**
 * Change created and updated to createdAt and updatedAt on media items
 */
async function addMediaInfo() {
  const client = await MongoClient.connect('mongodb://mongo.db');
  const db = client.db(dbName);
  const collection = db.collection('users');

  const media = await collection.find().toArray();
  const updates = media.map((item) => {
    const createDate = moment(new ObjectId(item._id).getTimestamp())
      .utc()
      .toDate();

    return {
      _id: new ObjectId(item._id),
      createdAt: createDate,
      updatedAt: createDate,
      lastLoginAt: createDate
    };
  });
  for (let item of updates) {
    let { _id, ...update } = item;
    await db.collection('users').updateOne({ _id }, { $set: update });
  }
}

addMediaInfo();
