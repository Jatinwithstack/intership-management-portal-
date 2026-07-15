document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('student-form'); 

    // --- FORM SUBMISSION (ADD or EDIT UPDATE) ---
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const name = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const status = document.getElementById('student-status') ? document.getElementById('student-status').value : 'Active';
            const attendance = document.getElementById('student-attendance') ? document.getElementById('student-attendance').value : '0';
            const performance = document.getElementById('student-performance') ? document.getElementById('student-performance').value : '0';

            // Validation Call
            const validation = validateStudentForm(name, email, attendance, performance);
            if (!validation.isValid) {
                alert("Form mein ye galtiyan hain:\n- " + validation.errors.join("\n- "));
                return; 
            }

            // Check karo ki Add ho raha hai ya Edit update
            const editId = studentForm.dataset.editId;
            if (editId) {
                // Edit mode: purane student ka data update karo
                const studentIndex = students.findIndex(s => s.id === editId);
                if (studentIndex > -1) {
                    students[studentIndex] = { id: editId, name, email, status, attendance: Number(attendance), performance: Number(performance) };
                    alert("Student data update ho gaya!");
                }
                delete studentForm.dataset.editId; // Edit state clear karo
                const submitBtn = studentForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.textContent = "Register";
            } else {
                // Normal Add mode
                addStudent(name, email, status, attendance, performance);
                alert("Student safalata-purvak add ho gaya!");
            }

            studentForm.reset();
            if (typeof renderStudentTable === 'function') renderStudentTable();
            if (typeof updateDashboardStats === 'function') updateDashboardStats();
        });
    }

    // --- SEARCH, FILTER & SORT CONTROLS ---
    const searchInput = document.getElementById('search-student');
    const filterStatus = document.getElementById('filter-status');
    const sortSelect = document.getElementById('sort-students');

    // Live search event listen karna
    if (searchInput) {
        searchInput.addEventListener('input', () => renderStudentTable(searchInput.value, filterStatus?.value, sortSelect?.value));
    }
    // Filter status event listen karna
    if (filterStatus) {
        filterStatus.addEventListener('change', () => renderStudentTable(searchInput?.value, filterStatus.value, sortSelect?.value));
    }
    // Sorting event listen karna
    if (sortSelect) {
        sortSelect.addEventListener('change', () => renderStudentTable(searchInput?.value, filterStatus?.value, sortSelect.value));
    }

    // Page load hote hi table aur dashboard initial run karne ke liye
    if (typeof renderStudentTable === 'function') renderStudentTable();
    if (typeof updateDashboardStats === 'function') updateDashboardStats();
});

// --- ADVANCED TABLE RENDER FUNCTION WITH SEARCH, FILTER & SORT ---
function renderStudentTable(searchQuery = '', statusFilter = '', sortBy = '') {
    const tableBody = document.getElementById('student-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = ''; 

    // 1. Filter Layer (Search aur Status mix)
    let filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              student.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === '' || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // 2. Sort Layer (Name, Attendance, Performance)
    if (sortBy === 'name') {
        filteredStudents.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'attendance') {
        filteredStudents.sort((a, b) => b.attendance - a.attendance); // High to Low
    } else if (sortBy === 'performance') {
        filteredStudents.sort((a, b) => b.performance - a.performance); // High to Low
    }

    // 3. Render HTML UI
    filteredStudents.forEach((student) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${String(student.id).slice(-4)}</td>
            <td><strong>${student.name}</strong></td>
            <td>Full-Stack Web</td>
            <td>${student.email}</td>
            <td>${student.attendance}%</td>
            <td><span class="status-badge ${student.status.toLowerCase()}">${student.status}</span></td>
            <td>
                <button class="btn-edit" onclick="editStudentTrigger('${String(student.id)}')">Edit</button>
                <button class="btn-delete" onclick="deleteStudentTrigger('${String(student.id)}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // 4. Update Counters UI
    const totalCountElement = document.getElementById('total-students-count');
    const activeCountElement = document.getElementById('active-students-count');

    if (totalCountElement) {
       totalCountElement.innerText = filteredStudents.length;
    }

    const activeInterns = filteredStudents.filter(s => String(s.status).toLowerCase() === 'active');
    if (activeCountElement) {
       activeCountElement.innerText = activeInterns.length;
    }

}

// 5. Search, Filter aur Sorting Events Connect Karna
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('input[placeholder*="Name ya Email"]');
    const statusFilter = document.querySelector('select[id*="status"]') || document.querySelector('select'); // Pehla dropdown filter ke liye
    const sortBySelect = document.querySelector('select[id*="sort"]') || document.querySelectorAll('select')[1]; // Doosra dropdown sort ke liye

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderStudentTable(e.target.value, statusFilter?.value, sortBySelect?.value);
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            renderStudentTable(searchInput?.value, e.target.value, sortBySelect?.value);
        });
    }

    if (sortBySelect) {
        sortBySelect.addEventListener('change', (e) => {
            renderStudentTable(searchInput?.value, statusFilter?.value, e.target.value);
        });
    }
});