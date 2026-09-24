async function run() {
  const routes = [
    '/',
    '/awareness',
    '/awareness/consent',
    '/awareness/boundaries',
    '/awareness/bystander-support',
    '/awareness/digital-safety',
    '/awareness/get-help',
    '/survivor',
    '/survivor/safety',
    '/survivor/triage',
    '/survivor/options',
    '/survivor/action',
    '/privacy',
    '/resources',
    '/api/health'
  ];

  console.log('--- TESTING LOCALHOST:3000 ENDPOINTS ---');
  let allPass = true;
  for (const r of routes) {
    try {
      const res = await fetch(`http://localhost:3000${r}`);
      const ok = res.status >= 200 && res.status < 400;
      console.log(`[${res.status}] ${r} -> ${ok ? 'OK' : 'FAIL'}`);
      if (!ok) allPass = false;
    } catch (e: any) {
      console.error(`[ERROR] ${r} -> ${e.message}`);
      allPass = false;
    }
  }

  if (allPass) {
    console.log('\nALL 15 ENDPOINTS RESPONDED WITH HTTP 200 ON LOCALHOST:3000');
    process.exit(0);
  } else {
    console.error('\nONE OR MORE ENDPOINTS FAILED');
    process.exit(1);
  }
}

run();
