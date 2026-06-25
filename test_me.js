async function testMe() {
  try {
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'john.doe@example.com',
            password: 'SecretPass123!'
        })
    });
    
    if (!loginRes.ok) {
       // Need to register first
       console.log('Login failed, registering...');
       const registerRes = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: 'Api',
            lastName: 'Tester',
            email: 'api.tester@example.com',
            password: 'Password123!'
        })
       });
       const data = await registerRes.json();
       var token = data.data.accessToken;
    } else {
       const data = await loginRes.json();
       var token = data.data.accessToken;
    }
    console.log('Got token:', token);
    
    console.log('Fetching /me...');
    const meRes = await fetch('http://localhost:5000/api/v1/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const meData = await meRes.json();
    console.log('Success! /me returned:', meData);
  } catch (err) {
      console.error('Error:', err);
  }
}
testMe();
