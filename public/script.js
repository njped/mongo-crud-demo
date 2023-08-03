function addUser() {
  fetch ('/newUser', {
    method: 'POST', 
    headers:{'Content-Type': 'application/json'}, 
    body: JSON.stringify({
      username: document.getElementById('name').value,
      password: document.getElementById('name').value
    }),
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.errorMessage) {
      document.getElementById('serverMessage').innerHTML = data.errorMessage
    }
    else {
      document.getElementById('serverMessage').innerHTML = 'You are logged in'
      localStorage.setItem('myToken', data.token)
    }
  })
}
