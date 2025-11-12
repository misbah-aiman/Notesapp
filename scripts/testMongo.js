const fs = require('fs');
const { MongoClient } = require('mongodb');

function loadEnv(path = '.env.local') {
  try {
    const raw = fs.readFileSync(path, 'utf8');
    const lines = raw.split(/\r?\n/);
    const env = {};
    for (const line of lines) {
      if (!line || line.trim().startsWith('#')) continue;
      const idx = line.indexOf('=');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
    return env;
  } catch (err) {
    console.error('Failed to read .env.local:', err.message || err);
    return {};
  }
}

(async () => {
  const env = loadEnv();
  const uri = env.MONGODB_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in .env.local or environment');
    process.exit(2);
  }

  console.log('Using MONGODB_URI:', uri.replace(/:(.*)@/, ':*****@'));

  const client = new MongoClient(uri, {});
  try {
    await client.connect();
    const res = await client.db('admin').command({ ping: 1 });
    console.log('Ping result:', res);
    console.log('MongoDB connection OK');
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection error:');
    console.error(err && err.stack ? err.stack : err);
    try { await client.close(); } catch (_) {}
    process.exit(1);
  }
})();
