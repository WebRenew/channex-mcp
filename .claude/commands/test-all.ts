#!/usr/bin/env node
import { channexClient } from '../../src/api/client.js';
import { propertiesResource } from '../../src/resources/properties.js';
import { roomTypesResource } from '../../src/resources/room-types.js';
import { ratePlansResource } from '../../src/resources/rate-plans.js';
import { ariResource } from '../../src/resources/ari.js';

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  response?: any;
}

const tests: TestResult[] = [];

async function runTest(name: string, fn: () => Promise<any>) {
  console.log(`Running: ${name}`);
  try {
    const response = await fn();
    tests.push({ name, success: true, response });
    console.log(`✅ ${name}`);
  } catch (error: any) {
    tests.push({ name, success: false, error: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('🧪 Running Channex MCP Tests\n');

  // Test properties
  await runTest('List properties', async () => {
    return propertiesResource.list({ pagination: { limit: 1 } });
  });

  await runTest('Get property options', async () => {
    return propertiesResource.options();
  });

  // Test room types
  await runTest('List room types', async () => {
    return roomTypesResource.list({ pagination: { limit: 1 } });
  });

  // Test rate plans
  await runTest('List rate plans', async () => {
    return ratePlansResource.list({ pagination: { limit: 1 } });
  });

  // Print summary
  console.log('\n📊 Test Summary:');
  const passed = tests.filter((t) => t.success).length;
  const failed = tests.filter((t) => !t.success).length;
  console.log(`Passed: ${passed}/${tests.length}`);
  console.log(`Failed: ${failed}/${tests.length}`);

  if (failed > 0) {
    console.log('\n❌ Failed tests:');
    tests
      .filter((t) => !t.success)
      .forEach((t) => console.log(`  - ${t.name}: ${t.error}`));
  }

  // Save test results
  const resultsPath = new URL('./test-results.json', import.meta.url).pathname;
  await import('fs').then((fs) => {
    fs.writeFileSync(resultsPath, JSON.stringify(tests, null, 2));
  });
  console.log(`\n💾 Test results saved to: ${resultsPath}`);
}

runAllTests().catch(console.error);
