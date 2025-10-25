// 测试Stripe支付流程
// 使用方法: node test-stripe-flow.js

const fetch = require('node-fetch');

async function testStripeFlow() {
  console.log('🧪 测试Stripe支付流程...\n');

  const testEmail = 'test@heraai.net.au';
  const testPlan = 'daily';

  try {
    // 1. 测试创建checkout session
    console.log('1️⃣ 测试创建checkout session...');
    const checkoutResponse = await fetch('http://localhost:3002/api/subscription/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        plan: testPlan,
        successUrl: 'http://localhost:3002/payment-success',
        cancelUrl: 'http://localhost:3002/profile'
      })
    });

    if (checkoutResponse.ok) {
      const checkoutData = await checkoutResponse.json();
      console.log('✅ Checkout session创建成功!');
      console.log('   Session ID:', checkoutData.sessionId);
      console.log('   Stripe URL:', checkoutData.url);
      console.log('   请访问上面的URL完成测试支付\n');
    } else {
      const errorData = await checkoutResponse.json();
      console.log('❌ Checkout session创建失败:', errorData);
    }

    // 2. 测试订阅状态查询
    console.log('2️⃣ 测试订阅状态查询...');
    const statusResponse = await fetch(`http://localhost:3002/api/subscription/status?email=${testEmail}`);
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ 订阅状态查询成功!');
      console.log('   当前状态:', statusData);
    } else {
      const errorData = await statusResponse.json();
      console.log('❌ 订阅状态查询失败:', errorData);
    }

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
testStripeFlow();

