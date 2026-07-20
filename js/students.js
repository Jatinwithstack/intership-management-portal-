// 1. LocalStorage se purana data nikalna ya khali array banana
let students = JSON.parse(localStorage.getItem('students')) || [];

// 2. Data ko LocalStorage mein hamesha save rakhne ka function
function saveToLocalStorage() {
    try {
        localStorage.setItem('students', JSON.stringify(students));
    } catch (error) {
        console.error("Data save karne mein error aaya:", error);
    }
}

// 3. Naya Student add karne ka function
function addStudent(name, email, status, attendance, performance) {
    const newStudent = {
        id: Date.now().toString(), // Unique ID generator
        name: name,
        email: email,
        status: status || 'Active',
        attendance: Number(attendance) || 0,
        performance: Number(performance) || 0
    };

    students.push(newStudent);
    saveToLocalStorage(); // LocalStorage mein data save karo
    return newStudent;
}

// 4. Delete Student Function (Confirmation Dialog ke saath)
function deleteStudentTrigger(id) {
    // Task Requirement: Confirmation Dialog before delete
    const confirmDelete = confirm("Kya aap pakka is student ko delete karna chahte hain?");
    
    if (confirmDelete) {
        students = students.filter(student => student.id !== id);
        saveToLocalStorage(); // LocalStorage update karo
        
        // Agar functions existing hain toh UI automatic update ho jaye
        if (typeof renderStudentTable === 'function') renderStudentTable();
        if (typeof updateDashboardStats === 'function') updateDashboardStats();
    }
}

// 5. Edit Student Trigger Function (Form data filling)
function editStudentTrigger(id) {
    const student = students.find(student => student.id === id);
    if (!student) return;

    // Check karo agar hum registration form waale page par hain
    if (document.getElementById('fullname')) {
        document.getElementById('fullname').value = student.name;
        document.getElementById('email').value = student.email;
        if(document.getElementById('student-status')) document.getElementById('student-status').value = student.status;
        if(document.getElementById('student-attendance')) document.getElementById('student-attendance').value = student.attendance;
        if(document.getElementById('student-performance')) document.getElementById('student-performance').value = student.performance;

        // Form par dataset store karna taaki edit trace ho sake
        const form = document.getElementById('student-form');
        form.dataset.editId = id;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = "Update Student";
    } else {
        alert("Student ko edit karne ke liye pahle Registration Form ('registration.html') waale page par jaaein!");
    }
}

// Global State for Pagination
let currentPage = 1;
const rowsPerPage = 5;

// Toast Notification
function showToast(message) {
    let toast = document.getElementById('toast-msg');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-msg';
        toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:#4f46e5; color:#fff; padding:10px 18px; border-radius:8px; z-index:1000; font-size:14px; box-shadow:0 4px 6px rgba(0,0,0,0.1);";
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2500);
}

// Render Table with Search, Filter & Pagination
function renderStudentTable() {
    const tableBody = document.querySelector('tbody') || document.querySelector('#studentTableBody');
    if (!tableBody) return;

    // Load from your 'students' localStorage key
    let studentList = JSON.parse(localStorage.getItem('students')) || [];

    // 1. Search Filter
    const searchVal = document.getElementById('searchInput')?.value.toLowerCase().trim() || '';
    if (searchVal) {
        studentList = studentList.filter(s => 
            (s.name && s.name.toLowerCase().includes(searchVal)) || 
            (s.email && s.email.toLowerCase().includes(searchVal))
        );
    }

    // 2. Status Filter
    const statusVal = document.getElementById('statusFilter')?.value || 'All';
    if (statusVal !== 'All' && statusVal !== 'All Status') {
        studentList = studentList.filter(s => s.status && s.status.toLowerCase() === statusVal.toLowerCase());
    }

    // 3. Pagination Logic
    const startIdx = (currentPage - 1) * rowsPerPage;
    const paginatedList = studentList.slice(startIdx, startIdx + rowsPerPage);

    tableBody.innerHTML = '';

    if (paginatedList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 15px;">No student records found</td></tr>`;
        return;
    }

    paginatedList.forEach(s => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${s.id ? s.id.toString().slice(-4) : 'N/A'}</td>
            <td><b>${s.name || ''}</b></td>
            <td>${s.domain || 'Full-Stack'}</td>
            <td>${s.email || ''}</td>
            <td>${s.attendance || 0}%</td>
            <td><span style="color:${s.status === 'Active' ? 'green' : 'red'}">${s.status || 'Active'}</span></td>
            <td>
                <button onclick="editStudentTrigger('${s.id}')">Edit</button>
                <button onclick="deleteStudentTrigger('${s.id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    renderPaginationControls(studentList.length);
}

// Pagination Controls UI
function renderPaginationControls(totalItems) {
    let container = document.getElementById('paginationControls');
    if (!container) {
        container = document.createElement('div');
        container.id = 'paginationControls';
        container.style.cssText = "margin-top: 15px; display:flex; gap:10px; align-items:center; justify-content:flex-end;";
        const table = document.querySelector('table');
        if (table) table.after(container);
    }

    const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
    container.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(-1)">Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button ${currentPage >= totalPages ? 'disabled' : ''} onclick="changePage(1)">Next</button>
    `;
}

function changePage(direction) {
    currentPage += direction;
    renderStudentTable();
}

// Page Load Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderStudentTable();

    document.getElementById('searchInput')?.addEventListener('input', () => {
        currentPage = 1;
        renderStudentTable();
    });

    document.getElementById('statusFilter')?.addEventListener('change', () => {
        currentPage = 1;
        renderStudentTable();
    });
});

// Toggle Spinner
function toggleSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'block' : 'none';
    }
}

// Export JSON
function exportJSON() {
    const data = JSON.parse(localStorage.getItem('students')) || [];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "student_data.json");
    dlAnchor.click();
    if (typeof showToast === 'function') showToast("Data exported successfully!");
}

// Import JSON Function
function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    toggleSpinner(true);

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                localStorage.setItem('students', JSON.stringify(importedData));
                setTimeout(() => {
                    toggleSpinner(false);
                    if (typeof showToast === 'function') showToast("Data imported successfully!");
                    if (typeof renderStudentTable === 'function') renderStudentTable();
                }, 600);
            } else {
                alert("Invalid JSON format! Must be an array.");
                toggleSpinner(false);
            }
        } catch (err) {
            alert("Error reading JSON file!");
            toggleSpinner(false);
        }
    };
    reader.readAsText(file);
}