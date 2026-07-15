document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('student-form'); 

    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            // Sahi IDs jo humne aapke HTML mein check ki hain:
            const name = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            
            // In teeno fields ki IDs agar HTML mein alag hain toh brackets '' mein change kar lena:
            const status = document.getElementById('student-status') ? document.getElementById('student-status').value : 'Active';
            const attendance = document.getElementById('student-attendance') ? document.getElementById('student-attendance').value : '0';
            const performance = document.getElementById('student-performance') ? document.getElementById('student-performance').value : '0';

            // Validation check (validation.js se)
            const validation = validateStudentForm(name, email, attendance, performance);

            if (!validation.isValid) {
                alert("Form mein ye galtiyan hain:\n- " + validation.errors.join("\n- "));
                return; 
            }

            // Student add karna (student.js se)
            addStudent(name, email, status, attendance, performance);

            studentForm.reset();
            alert("Student safalata-purvak add ho gaya!");
        });
    }
});