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