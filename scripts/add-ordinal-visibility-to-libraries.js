const { MongoClient } = require('mongodb');
const moment = require('moment');
const dbName = 'Movies';

/**
 * Add ordinal to library items and visiblity to library
 */
async function migrate() {
  const client = await MongoClient.connect('mongodb://mongo.db');
  const db = client.db(dbName);
  const collection = db.collection('libraries');

  const libraries = await collection.find().toArray();
  libraries.forEach((library) => {
    library.items = library.items.map((id, order) => ({ id, order }));
    library.visibility = 0;
    library.createdAt = moment(library.created).toDate();
    library.updatedAt = moment(library.updated).toDate();
    delete library.created;
    delete library.updated;
  });

  await db.collection('libraries-migrated').insertMany(libraries);

  await db.collection('libraries').rename('libraries-old');
  await db.collection('libraries-migrated').rename('libraries');
}

migrate();
