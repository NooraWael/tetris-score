document.getElementById('nameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const playerName = document.getElementById('playerName').value;
    localStorage.setItem('playerName', playerName); // Store the name in local storage
    window.location.href = 'index.html'; // Redirect to the main game page
});
