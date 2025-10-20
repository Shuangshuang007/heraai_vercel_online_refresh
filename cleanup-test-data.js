const { MongoClient } = require('mongodb');

async function cleanupTestData() {
  try {
    // 连接到MongoDB
    const uri = process.env.MONGODB_URI || 'mongodb+srv://heraai:heraai123@cluster0.mongodb.net/heraai?retryWrites=true&w=majority';
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('heraai');
    const collection = db.collection('hera_profiles');
    
    // 查找并删除测试用户的订阅数据
    const testUsers = await collection.find({
      email: { $regex: /subscription-test/ }
    }).toArray();
    
    console.log(`Found ${testUsers.length} test users to clean up`);
    
    for (const user of testUsers) {
      console.log(`Cleaning up user: ${user.email}`);
      
      // 移除订阅字段，恢复为免费用户
      await collection.updateOne(
        { _id: user._id },
        { 
          $unset: { subscription: "" },
          $set: { updatedAt: new Date() }
        }
      );
      
      console.log(`✓ Cleaned up user: ${user.email}`);
    }
    
    // 查找所有有订阅的用户
    const allSubscribedUsers = await collection.find({
      'subscription.active': true
    }).toArray();
    
    console.log('\n=== Current Premium Users ===');
    allSubscribedUsers.forEach(user => {
      console.log(`- ${user.email}: ${user.subscription.plan} (expires: ${user.subscription.expiresAt})`);
    });
    
    await client.close();
    console.log('\n✅ Cleanup completed!');
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

cleanupTestData();
