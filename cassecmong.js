
import mongodb from 'mongodb';
const { MongoClient } = mongodb;
const url = 'mongodb+srv://tureti:db7dm8mf@cluster0.tvkiecu.mongodb.net/votreBaseDeDonnées?retryWrites=true&w=majority';
const client = new MongoClient(url);
await client.connect();
const database = client.db('votreBaseDeDonnées');
const collection = database.collection('user');
const result = await collection.deleteMany({});
await client.close();
console.log('Connexion MongoDB fermée');

