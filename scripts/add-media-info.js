const { MongoClient } = require('mongodb');
const moment = require('moment');

const dbName = 'development';

/**
 * Change created and updated to createdAt and updatedAt on media items
 */
async function addMediaInfo() {
  const client = await MongoClient.connect('mongodb://mongo.db');
  const db = client.db(dbName);
  const collection = db.collection('media');

  const media = await collection.find().toArray();
  media.forEach((item) => {
    item.createdAt = moment(item.created).toDate();
    item.updatedAt = moment(item.updated).toDate();
    delete item.created;
    delete item.updated;
  });

  await db.collection('media-migrated').insertMany(media);

  await db.collection('media').rename('media-old');
  await db.collection('media-migrated').rename('media');
}

addMediaInfo();
