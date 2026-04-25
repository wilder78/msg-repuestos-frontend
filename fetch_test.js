fetch('http://localhost:8080/api/rutas', {
  headers: {
    'Content-Type': 'application/json'
    // I don't know the token, but hopefully the backend doesn't need it or it gives 401. 
    // Wait, let's look at the frontend image, the user is logged in. But wait, I can just write a node script.
  }
}).then(res => res.text()).then(text => console.log('Response:', text)).catch(err => console.error('Fetch error:', err));
