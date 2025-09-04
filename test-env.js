// 测试环境变量加载
require('dotenv').config({ path: '.env.local' });

console.log('🧪 测试环境变量加载...\n');

// 检查Stripe相关环境变量
const stripeVars = {
  'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
  'STRIPE_PUBLISHABLE_KEY': process.env.STRIPE_PUBLISHABLE_KEY,
  'STRIPE_WEBHOOK_SECRET': process.env.STRIPE_WEBHOOK_SECRET,
  'STRIPE_DAILY_PRICE_KEY': process.env.STRIPE_DAILY_PRICE_KEY,
  'STRIPE_WEEKLY_PRICE_KEY': process.env.STRIPE_WEEKLY_PRICE_KEY,
  'STRIPE_MONTHLY_PRICE_KEY': process.env.STRIPE_MONTHLY_PRICE_KEY
};

console.log('📋 Stripe环境变量状态:');
Object.entries(stripeVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${key}: 未设置`);
  }
});

console.log('\n🔍 检查Price Key格式:');
Object.entries(stripeVars).forEach(([key, value]) => {
  if (key.includes('PRICE_KEY') && value) {
    if (value.startsWith('price_') && value.length > 20) {
      console.log(`✅ ${key}: 格式正确 (${value.length} 字符)`);
    } else {
      console.log(`❌ ${key}: 格式错误 - 应该是 'price_' 开头`);
    }
  }
});

console.log('\n📁 当前工作目录:', process.cwd());
console.log('📄 .env.local 文件路径:', require('path').resolve('.env.local'));
