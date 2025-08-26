// public/js/auth.js

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || 'Login failed');
            return;
        }

        // Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('profile', JSON.stringify(data.profile));

        // Redirect to profile page
        window.location.href = '/profile.html';
    } catch (err) {
        console.error(err);
        alert('Something went wrong during login');
    }
});