const mongoose = require('mongoose');

async function test() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/JAC';
  console.log('[test-mongo] probando conexión a:', uri);
  try {
    await mongoose.connect(uri);
    console.log('[test-mongo] conexión OK');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[test-mongo] ERROR:', err);
    process.exit(1);
  }
}

test();
