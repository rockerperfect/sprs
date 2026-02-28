const http = require('http');

const request = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function runTests() {
  console.log('--- SPRS End-to-End Validation Suite ---');
  
  // Test 1: Reset
  console.log('\n[1] Testing Reset Functionality...');
  await request('POST', '/api/v1/reset');
  let gateways = await request('GET', '/api/v1/gateway');
  gateways.data.forEach(g => {
    if (g.status !== 'Healthy' || g.circuitState !== 'CLOSED') {
      console.error(`Failed on ${g.gateway}:`, g);
      throw new Error('Reset failed state validation');
    }
  });
  console.log('✅ Reset successful. All gateways Healthy and CLOSED.');

  // Test 2: Bulk Simulation 
  console.log('\n[2] Testing Bulk Simulation (100 txns)...');
  await request('POST', '/api/v1/simulate-bulk', { count: 100 });
  console.log('✅ Simulation completed.');

  console.log('\n[3] Validating Circuit Breaker Logic...');
  gateways = await request('GET', '/api/v1/gateway');
  
  const gwA = gateways.data.find(g => g.gateway === 'Gateway-A');
  const gwB = gateways.data.find(g => g.gateway === 'Gateway-B');
  const gwC = gateways.data.find(g => g.gateway === 'Gateway-C');

  if (gwA.circuitState === 'OPEN') console.log('✅ Gateway-A Circuit Breaker tripped to OPEN as expected.');
  else console.log('❌ Gateway-A did not trip. State:', gwA.circuitState);

  if (gwB.circuitState === 'OPEN') console.log('✅ Gateway-B Circuit Breaker tripped to OPEN as expected.');
  else console.log('❌ Gateway-B did not trip. State:', gwB.circuitState);

  if (gwC.circuitState === 'CLOSED') console.log('✅ Gateway-C remained CLOSED to absorb fallback traffic.');
  else console.log('❌ Gateway-C incorrectly tripped.');

  // Test 4: Verify Anomaly Detection
  console.log('\n[4] Validating Anomaly Detection & Health Scoring...');
  if (gwA.status === 'Degraded') console.log('✅ Gateway-A correctly flagged as Degraded.');
  if (gwB.status === 'Degraded') console.log('✅ Gateway-B correctly flagged as Degraded.');
  
  // Test 5: Verify Metrics
  console.log('\n[5] Validating System Metrics...');
  const metrics = await request('GET', '/api/v1/metrics');
  if (metrics.data.totalTransactions > 100) {
    console.log(`✅ Cascading fallback worked! 100 payments generated ${metrics.data.totalTransactions} internal transactions due to retries.`);
  }

  console.log('\n--- All automated core logic verification completed! ---');
}

runTests().catch(console.error);
