const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  console.log('Testing MongoDB connection...');
  console.log('URI:', uri ? uri.substring(0, 20) + '...' : 'NOT SET');
  
  if (!uri) {
    console.error('MONGODB_URI environment variable not set');
    return;
  }

  try {
    const client = new MongoClient(uri);
    console.log('Connecting to MongoDB...');
    
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // 测试数据库访问
    const db = client.db('hera_profiles');
    console.log('✅ Successfully accessed hera_profiles database');
    
    // 测试集合访问
    const collection = db.collection('profiles');
    console.log('✅ Successfully accessed profiles collection');
    
    // 测试ping
    await db.admin().ping();
    console.log('✅ Database ping successful');
    
    await client.close();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();
