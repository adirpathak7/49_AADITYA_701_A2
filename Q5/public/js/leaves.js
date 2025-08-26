const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/index.html';
}

document.getElementById('leaveForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const date = document.getElementById('leaveDate').value;
    const reason = document.getElementById('leaveReason').value.trim();

    try {
        const res = await fetch('/api/leaves', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ date, reason })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || 'Failed to apply leave');
            return;
        }

        alert('Leave applied successfully');
        document.getElementById('leaveForm').reset();
        loadLeaves();
    } catch (err) {
        console.error(err);
        alert('Error applying leave');
    }
});

async function loadLeaves() {
    try {
        const res = await fetch('/api/leaves', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const leaves = await res.json();

        const list = document.getElementById('leavesList');
        list.innerHTML = '';

        leaves.forEach(l => {
            const li = document.createElement('li');
            li.textContent = `${l.date} - ${l.reason} (Granted: ${l.grant ? 'Yes' : 'No'})`;
            list.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        alert('Error loading leaves');
    }
}

document.addEventListener('DOMContentLoaded', loadLeaves);

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});
