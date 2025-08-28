// public/js/index.js

const apiBase = "http://localhost:3000/api"; // Make sure this matches your backend port

// ---------------- LOGIN ----------------
if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const res = await fetch(`${apiBase}/employee/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                window.location.href = "profile.html";
            } else {
                document.getElementById("loginError").innerText = data.message || "Login failed";
                document.getElementById("loginError").classList.remove("hidden");
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    });
}

// ---------------- PROFILE ----------------
if (document.getElementById("profileData")) {
    fetch(`${apiBase}/employee/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
        .then((res) => res.json())
        .then((data) => {
            const div = document.getElementById("profileData");
            div.innerHTML = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Emp ID:</strong> ${data.empId}</p>
        <p><strong>Position:</strong> ${data.position}</p>
        <p><strong>Base Salary:</strong> ₹${data.baseSalary}</p>
        <p><strong>Bonus:</strong> ₹${data.bonus}</p>
        <p><strong>Total Salary:</strong> ₹${data.totalSalary}</p>
      `;
        })
        .catch((err) => console.error("Profile fetch error:", err));
}

// ---------------- LEAVE ----------------
if (document.getElementById("leaveForm")) {
    const token = localStorage.getItem("token");

    document.getElementById("leaveForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const date = document.getElementById("date").value;
        const reason = document.getElementById("reason").value;

        try {
            const res = await fetch(`${apiBase}/employee/leave`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ date, reason }),
            });

            if (res.ok) {
                alert("Leave application submitted");
                document.getElementById("leaveForm").reset();
                loadLeaves();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to apply for leave");
            }
        } catch (err) {
            console.error("Leave error:", err);
        }
    });

    async function loadLeaves() {
        try {
            const res = await fetch(`${apiBase}/employee/leaves`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const leaves = await res.json();
            const list = document.getElementById("leaveList");
            list.innerHTML = leaves
                .map((leave) => {
                    return `<div class="p-4 border rounded bg-gray-50">
            <p><strong>Date:</strong> ${new Date(leave.date).toLocaleDateString()}</p>
            <p><strong>Reason:</strong> ${leave.reason}</p>
            <p><strong>Granted:</strong> ${leave.isGranted ? "Yes" : "No"}</p>
          </div>`;
                })
                .join("");
        } catch (err) {
            console.error("Load leaves error:", err);
        }
    }

    loadLeaves();
}

// ---------------- LOGOUT ----------------
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
