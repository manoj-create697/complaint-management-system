// Initialize complaints from localStorage or empty array
let complaints = JSON.parse(localStorage.getItem('complaints')) || [];
const adminPassword = "admin123"; // Simple password for admin access

// Handle form submission
document.getElementById('complaintForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    
    // Create new complaint object
    const complaint = {
        id: Date.now(), // Unique ID based on timestamp
        name,
        email,
        category,
        description,
        status: 'Pending'
    };
    
    // Add to complaints array and save to localStorage
    complaints.push(complaint);
    localStorage.setItem('complaints', JSON.stringify(complaints));
    
    // Clear form
    document.getElementById('complaintForm').reset();
    
    // Update displayed complaints
    displayUserComplaints(email);
    displayAdminComplaints();
});

// Display complaints for the logged-in user
function displayUserComplaints(email) {
    const userComplaintsBody = document.getElementById('userComplaintsBody');
    userComplaintsBody.innerHTML = '';
    
    const userComplaints = complaints.filter(complaint => complaint.email === email);
    
    userComplaints.forEach(complaint => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${complaint.id}</td>
            <td>${complaint.name}</td>
            <td>${complaint.email}</td>
            <td>${complaint.category}</td>
            <td>${complaint.description}</td>
            <td>${complaint.status}</td>
        `;
        userComplaintsBody.appendChild(row);
    });
}

// Display all complaints for admin
function displayAdminComplaints() {
    const adminComplaintsBody = document.getElementById('adminComplaintsBody');
    adminComplaintsBody.innerHTML = '';
    
    complaints.forEach(complaint => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${complaint.id}</td>
            <td>${complaint.name}</td>
            <td>${complaint.email}</td>
            <td>${complaint.category}</td>
            <td>${complaint.description}</td>
            <td>
                <select onchange="updateStatus(${complaint.id}, this.value)">
                    <option value="Pending" ${complaint.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                </select>
            </td>
            <td><button onclick="deleteComplaint(${complaint.id})">Delete</button></td>
        `;
        adminComplaintsBody.appendChild(row);
    });
}

// Update complaint status
function updateStatus(id, status) {
    complaints = complaints.map(complaint => 
        complaint.id === id ? { ...complaint, status } : complaint
    );
    localStorage.setItem('complaints', JSON.stringify(complaints));
    displayAdminComplaints();
    // Update user complaints if email is available
    const email = document.getElementById('email').value;
    if (email) displayUserComplaints(email);
}

// Delete a complaint
function deleteComplaint(id) {
    complaints = complaints.filter(complaint => complaint.id !== id);
    localStorage.setItem('complaints', JSON.stringify(complaints));
    displayAdminComplaints();
    const email = document.getElementById('email').value;
    if (email) displayUserComplaints(email);
}

// Toggle between user and admin sections
function toggleAdmin() {
    const userSection = document.getElementById('userSection');
    const adminSection = document.getElementById('adminSection');
    userSection.style.display = userSection.style.display === 'none' ? 'block' : 'none';
    adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
}

// Admin login
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === adminPassword) {
        document.getElementById('adminControls').style.display = 'block';
        displayAdminComplaints();
    } else {
        alert('Incorrect password');
    }
}