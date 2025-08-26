document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    try {
        const res = await fetch('/api/employee/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || 'Failed to fetch profile');
            localStorage.removeItem('token');
            window.location.href = '/index.html';
            return;
        }

        document.getElementById('empName').innerText = data.name;
        document.getElementById('empEmail').innerText = data.email;
        document.getElementById('empId').innerText = data.empId;
    } catch (err) {
        console.error(err);
        alert('Error loading profile');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    window.location.href = '/index.html';
});