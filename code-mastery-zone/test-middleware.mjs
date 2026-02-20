
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testRedirect(countryCode, caseName) {
    try {
        const response = await fetch(BASE_URL, {
            headers: {
                'x-vercel-ip-country': countryCode
            },
            redirect: 'manual' // Don't follow redirects automatically
        });

        console.log(`Test Case: ${caseName} (Country: ${countryCode})`);
        console.log(`Status: ${response.status}`);
        console.log(`Location: ${response.headers.get('location')}`);
        console.log('-----------------------------------');
    } catch (error) {
        console.error(`Error testing ${caseName}:`, error.message);
    }
}

async function runTests() {
    console.log('Starting Middleware Verification...\n');

    // Test 1: Arabic Country (Egypt) -> Should redirect to /ar
    await testRedirect('EG', 'Arabic User (Egypt)');

    // Test 2: Arabic Country (Saudi Arabia) -> Should redirect to /ar
    await testRedirect('SA', 'Arabic User (KSA)');

    // Test 3: Non-Arabic Country (US) -> Should redirect to /en (default)
    await testRedirect('US', 'Non-Arabic User (US)');

    // Test 4: Non-Arabic Country (France) -> Should redirect to /en (default)
    await testRedirect('FR', 'Non-Arabic User (France)');
}

runTests();
