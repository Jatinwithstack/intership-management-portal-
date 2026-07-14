// 1. Initial Data Setup
const initialStudents = [
    { id: 1, name: "Jatin", email: "jatin@gmail.com", course: "B.Tech CST", status: "Active" },
    { id: 2, name: "Rahul", email: "rahul@gmail.com", course: "B.Tech CSE", status: "Completed" }
];


// ==========================================
//  TASKS DATA SETUP
// ==========================================
const initialTasks = [
    { id: 101, title: "Create Dashboard Layout", assignedTo: "Jatin", deadline: "18 July", status: "Pending" },
    { id: 102, title: "Fix Sidebar Navigation", assignedTo: "Rahul", deadline: "20 July", status: "Completed" }
];

let tasks = JSON.parse(localStorage.getItem('tasks')) || initialTasks;

if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ==========================================
//  ATTENDANCE DATA SETUP
// ==========================================
const initialAttendance = [
    { id: 1, name: "Jatin", status: "Present" },
    { id: 2, name: "Rahul", status: "Absent" }
];

let attendance = JSON.parse(localStorage.getItem('attendance')) || initialAttendance;

if (!localStorage.getItem('attendance')) {
    localStorage.setItem('attendance', JSON.stringify(attendance));
}

// ==========================================
//  PROJECTS DATA SETUP
// ==========================================
const initialProjects = [
    { id: 201, title: "E-Commerce Website", tech: "HTML, CSS, JavaScript" },
    { id: 202, title: "Chat Application", tech: "React, Firebase" }
];

let projects = JSON.parse(localStorage.getItem('projects')) || initialProjects;

if (!localStorage.getItem('projects')) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Local Storage se data check karna
let students = JSON.parse(localStorage.getItem('students')) || initialStudents;

if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify(students));
}

// 2. Select HTML Table Body
const tableBody = document.getElementById('student-table-body') || document.querySelector('table tbody');

// 3. EXACT FUNCTION THAT WAS MISSING (renderStudents)
// 3. UPDATED FUNCTION WITH EDIT & DELETE LOGIC
function renderStudents(studentsList) {
    if (!tableBody) return;
    
    tableBody.innerHTML = ""; // Clear existing table rows

    studentsList.forEach(student => {
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50/50 transition border-b border-gray-100";

        row.innerHTML = `
            <td class="py-3 font-medium text-gray-900">${student.name}</td>
            <td class="py-3 text-gray-500">${student.email}</td>
            <td class="py-3 text-gray-500">${student.course}</td>
            <td class="py-3">
                <span class="px-2 py-1 text-xs rounded-full ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}">
                    ${student.status}
                </span>
            </td>
            <td class="py-3">
                <button onclick="editStudent(${student.id})" class="text-blue-600 hover:underline mr-2">Edit</button>
                <button onclick="deleteStudent(${student.id})" class="text-red-600 hover:underline">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Initial Load
renderStudents(students);

// ==========================================
//  SEARCH LOGIC WITH CORRECT FUNCTION NAME
// ==========================================
const autoSearchInput = document.querySelector('input[placeholder="Search Students..."]');

if (autoSearchInput) {
    autoSearchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase().trim();
        
        const filteredStudents = students.filter(student => {
            return student.name.toLowerCase().includes(searchText) || 
                   student.email.toLowerCase().includes(searchText);
        });
        
        // Ab ye error nahi dega kyunki function upar defined hai!
        renderStudents(filteredStudents);
    });
}
// ==========================================
//  STUDENT REGISTRATION & UPDATE LOGIC
// ==========================================
const studentForm = document.getElementById('student-form');
const nameInput = document.getElementById('student-name');
const emailInput = document.getElementById('student-email');
const courseSelect = document.getElementById('student-course');
const statusSelect = document.getElementById('student-status');

let editMode = false;
let editStudentId = null;

if (studentForm) {
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const nameVal = nameInput ? nameInput.value.trim() : "";
        const emailVal = emailInput ? emailInput.value.trim() : "";
        const courseVal = courseSelect ? courseSelect.value : "B.Tech CST";
        const statusVal = statusSelect ? statusSelect.value : "Active";

        if (nameVal === "" || emailVal === "") {
            alert("Bhai, Name aur Email fill karna zaroori hai!");
            return;
        }

        if (editMode) {
            // Edit mode: Purane data ko update karo
            students = students.map(student => {
                if (student.id === editStudentId) {
                    return { ...student, name: nameVal, email: emailVal, course: courseVal, status: statusVal };
                }
                return student;
            });
            
            editMode = false;
            editStudentId = null;
            const submitBtn = studentForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.innerText = "Submit Registration";
            alert("Student details update ho gayi hain! 👍");
            
        } else {
            // New mode: Naya student add karo
            const newStudent = {
                id: Date.now(), 
                name: nameVal,
                email: emailVal,
                course: courseVal,
                status: statusVal
            };
            students.push(newStudent);
            alert("Student successfully add ho gaya hai! 🎉");
        }

        localStorage.setItem('students', JSON.stringify(students));
        renderStudents(students);
        studentForm.reset();
    });
}

// ==========================================
//  DELETE STUDENT LOGIC
// ==========================================
function deleteStudent(id) {
    if (confirm("Bhai, kya aap pakka is student ko delete karna chahte ho?")) {
        students = students.filter(student => student.id !== id);
        localStorage.setItem('students', JSON.stringify(students));
        renderStudents(students);
    }
}

// ==========================================
//  EDIT ACTION LOGIC
// ==========================================
function editStudent(id) {
    const studentToEdit = students.find(student => student.id === id);
    
    if (studentToEdit) {
        if (nameInput) nameInput.value = studentToEdit.name;
        if (emailInput) emailInput.value = studentToEdit.email;
        if (courseSelect) courseSelect.value = studentToEdit.course;
        if (statusSelect) statusSelect.value = studentToEdit.status;
        
        const submitBtn = studentForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.innerText = "Update Details";
        
        editMode = true;
        editStudentId = id;
        
        studentForm.scrollIntoView({ behavior: 'smooth' });
    }
}
// ==========================================
//  TASKS RENDER & MANAGEMENT LOGIC
// ==========================================
const tasksContainer = document.getElementById('tasks-container');
const taskForm = document.getElementById('task-form');

function renderTasks(taskList) {
    if (!tasksContainer) return;
    tasksContainer.innerHTML = ""; // Clear existing cards

    taskList.forEach(task => {
        const card = document.createElement('div');
        card.className = "flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition";
        
        card.innerHTML = `
            <div>
                <h4 class="font-semibold text-gray-800">${task.title}</h4>
                <p class="text-xs text-gray-400 mt-0.5">Assigned to: <span class="font-medium text-gray-600">${task.assignedTo}</span> • Deadline: ${task.deadline || 'Flexible'}</p>
            </div>
            <div class="flex items-center gap-3">
                <span class="px-2 py-0.5 text-xs rounded-full ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}">
                    ${task.status}
                </span>
                <button onclick="toggleTaskStatus(${task.id})" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition">
                    ${task.status === 'Completed' ? 'Mark Pending' : 'Mark Done'}
                </button>
                <button onclick="deleteTask(${task.id})" class="text-xs text-red-600 hover:underline ml-2 transition">Delete</button>
            </div>
        `;
        tasksContainer.appendChild(card);
    });
}

// Form logic to add a new task
if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleVal = document.getElementById('task-title').value.trim();
        const assigneeVal = document.getElementById('task-assignee').value.trim();

        const newTask = {
            id: Date.now(),
            title: titleVal,
            assignedTo: assigneeVal,
            deadline: "25 July", // Default sample deadline
            status: "Pending"
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
        taskForm.reset();
    });
}

// Toggle status between Pending & Completed
function toggleTaskStatus(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
}

// Delete Task
function deleteTask(id) {
    if (confirm("Kya aap is task ko delete karna chahte ho?")) {
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
    }
}

// Initial Tasks Load
renderTasks(tasks);
// ==========================================
//  ATTENDANCE MANAGEMENT LOGIC
// ==========================================
const attendanceTableBody = document.getElementById('attendance-table-body');

function renderAttendance() {
    const attendanceTableBody = document.getElementById('attendance-table-body');
    if (!attendanceTableBody) return;
    
    attendanceTableBody.innerHTML = "";

    const currentStudents = JSON.parse(localStorage.getItem('students')) || [];
    
    if (currentStudents.length === 0) {
        attendanceTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="py-4 text-center text-gray-500">
                    Bhai, abhi koi student registered nahi hai.
                </td>
            </tr>`;
        return;
    }

    currentStudents.forEach(student => {
        let currentStatus = student.attendanceStatus || 'Present';
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50/50 transition border-b border-gray-100";
        
        row.innerHTML = `
            <td class="py-3 font-medium text-gray-900">${student.name}</td>
            <td class="py-3">
                <span class="px-2 py-1 text-xs rounded-full font-semibold ${
                    currentStatus === 'Present' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-rose-100 text-rose-700'
                }">
                    ${currentStatus}
                </span>
            </td>
            <td class="py-3 text-right">
                <button class="toggle-attendance-btn text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-1.5 rounded-lg transition font-medium cursor-pointer">
                    Mark ${currentStatus === 'Present' ? 'Absent' : 'Present'}
                </button>
            </td>
        `;

        // 🎯 DIRECT CLICK LISTENER
        const btn = row.querySelector('.toggle-attendance-btn');
        btn.addEventListener('click', function() {
            let allStudents = JSON.parse(localStorage.getItem('students')) || [];
            allStudents = allStudents.map(s => {
                if ((s.id || s.name) === (student.id || student.name)) {
                    s.attendanceStatus = (s.attendanceStatus === 'Absent') ? 'Present' : 'Absent';
                    if (typeof showToast === 'function') {
                        showToast(`${s.name} ki attendance update ho gayi! ✔️`, "success");
                    }
                }
                return s;
            });
            localStorage.setItem('students', JSON.stringify(allStudents));
            renderAttendance(); 
        });

        attendanceTableBody.appendChild(row);
    });
}

// Global click handler function toggle karne ke liye
window.toggleAttendanceDirect = function(studentId) {
    let currentStudents = JSON.parse(localStorage.getItem('students')) || [];
    currentStudents = currentStudents.map(student => {
        if ((student.id || student.name) === studentId) {
            student.attendanceStatus = (student.attendanceStatus === 'Absent') ? 'Present' : 'Absent';
            if (typeof showToast === 'function') {
                showToast(`${student.name} ki attendance update ho gayi! ✔️`, "success");
            }
        }
        return student;
    });
    localStorage.setItem('students', JSON.stringify(currentStudents));
    renderAttendance();
};

// ==========================================
//  PROJECTS MANAGEMENT LOGIC
// ==========================================
const projectsContainer = document.getElementById('projects-container');
const projectForm = document.getElementById('project-form');

function renderProjects(projectList) {
    if (!projectsContainer) return;
    projectsContainer.innerHTML = "";

    projectList.forEach(project => {
        const card = document.createElement('div');
        card.className = "p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex justify-between items-start";
        
        card.innerHTML = `
            <div>
                <h4 class="font-bold text-gray-800 text-base">${project.title}</h4>
                <p class="text-xs text-gray-500 mt-1"><span class="font-medium text-gray-700">Tech:</span> ${project.tech}</p>
            </div>
            <button onclick="deleteProject(${project.id})" class="text-xs text-red-600 hover:underline transition">Delete</button>
        `;
        projectsContainer.appendChild(card);
    });
}

if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleVal = document.getElementById('project-title').value.trim();
        const techVal = document.getElementById('project-tech').value.trim();

        const newProject = {
            id: Date.now(),
            title: titleVal,
            tech: techVal
        };

        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));
        renderProjects(projects);
        projectForm.reset();
    });
}

function deleteProject(id) {
    if (confirm("Bhai, kya aap is project ko delete karna chahte ho?")) {
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('projects', JSON.stringify(projects));
        renderProjects(projects);
    }
}

// Initial Load Dono Ke Liye
renderAttendance();
renderProjects(projects);

// ==========================================
//  CERTIFICATES, REPORTS & SETTINGS LOGIC
// ==========================================
const certSelect = document.getElementById('cert-student-select');
const certForm = document.getElementById('certificate-form');

// 1. Load Students into Certificate Dropdown & Update Reports Count
function updatePortalAnalyticsAndDropdowns() {
    // Dropdown update
    if (certSelect) {
        certSelect.innerHTML = '<option value="">-- Choose Student --</option>';
        students.forEach(student => {
            const opt = document.createElement('option');
            opt.value = student.name;
            opt.innerText = `${student.name} (${student.course})`;
            certSelect.appendChild(opt);
        });
    }

    // Reports/Analytics counters update
    const totalStudEl = document.getElementById('report-total-students');
    const totalProjEl = document.getElementById('report-total-projects');
    const totalTaskEl = document.getElementById('report-total-tasks');

    if (totalStudEl) totalStudEl.innerText = students.length;
    if (totalProjEl) totalProjEl.innerText = projects.length;
    if (totalTaskEl) {
        const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
        totalTaskEl.innerText = pendingTasks;
    }
}

// 2. Certificate Generation Logic
if (certForm) {
    certForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedStudent = certSelect.value;
        if (!selectedStudent) {
            alert("Bhai, pehle kisi student ko toh select karo!");
            return;
        }
        alert(`🎉 Certificate Generated successfully for ${selectedStudent}! \n[Downloading simulated...]`);
    });
}

// 3. Reset Settings Logic
function resetAllPortalData() {
    if (confirm("Bhai, kya aap sach mein poora portal reset karna chahte ho? Saara data ud jayega!")) {
        localStorage.clear();
        alert("Saara data clear ho gaya hai! Page reload ho raha hai...");
        window.location.reload();
    }
}

// Har baar jab data update ho, analytics refresh honi chahiye
const originalRenderStudents = renderStudents;
renderStudents = function(list) {
    if (typeof originalRenderStudents === 'function') originalRenderStudents(list);
    updatePortalAnalyticsAndDropdowns();
};

const originalRenderProjects = renderProjects;
renderProjects = function(list) {
    if (typeof originalRenderProjects === 'function') originalRenderProjects(list);
    updatePortalAnalyticsAndDropdowns();
};

const originalRenderTasks = renderTasks;
renderTasks = function(list) {
    if (typeof originalRenderTasks === 'function') originalRenderTasks(list);
    updatePortalAnalyticsAndDropdowns();
};

// Initial run for Analytics & Dropdowns
updatePortalAnalyticsAndDropdowns();

// ==========================================
//  LOGOUT LOGIC
// ==========================================
function handleLogout() {
    if (confirm("Bhai, kya aap sach mein logout karna chahte ho?")) {
        alert("Aap successfully logout ho gaye hain! 👍");
        
        // Aap jis page par user ko bhejna chahte ho (jaise home.html ya login page), uska path yahan daal do
        window.location.href = "home.html"; 
    }
}

// ==========================================
//  NEW FLAT DARK MODE LOGIC
// ==========================================
// Page load hote hi purani saved theme apply karo
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Ye function ab HTML ke inline click se direct connect hai
function toggleMyTheme() {
    document.documentElement.classList.toggle('dark');
    
    // Status save karo local storage mein
    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// ==========================================
//  INTENSE DARK MODE TOGGLE
// ==========================================
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Initial theme check
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    if (darkModeToggle) {
        // Purana listener clear karne ke liye clone lagana agar zaroorat ho
        darkModeToggle.onclick = function() {
            document.documentElement.classList.toggle('dark');
            
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            console.log("Theme changed to:", localStorage.getItem('theme'));
        };
    } else {
        console.error("Bhai, 'dark-mode-toggle' ID wala button nahi mila HTML mein!");
    }
}

// Page load hote hi chalao
document.addEventListener("DOMContentLoaded", initDarkMode);
// Direct call backup ke liye
initDarkMode();

// ==========================================
//  SIDEBAR & MOBILE MENU TOGGLE
// ==========================================
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        // Toggle mobile view positioning
        sidebar.classList.toggle('-translate-x-full');
        sidebar.classList.toggle('translate-x-0');
    });
}

// =========================================================
//  1. SIDEBAR & MOBILE TOGGLE MECHANISM
// =========================================================
const sidebarToggleBtn = document.getElementById('sidebar-toggle');
const mainSidebar = document.getElementById('sidebar');

if (sidebarToggleBtn && mainSidebar) {
    sidebarToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mainSidebar.classList.toggle('-translate-x-full');
        // Smooth slide transition ke liye classes handle karein
        if(!mainSidebar.classList.contains('-translate-x-full')) {
            mainSidebar.style.transform = "translateX(0)";
        } else {
            mainSidebar.style.transform = "";
        }
    });
}

// =========================================================
//  2. BEAUTIFUL CUSTOM TOAST NOTIFICATIONS
// =========================================================
function showToast(message, type = 'success') {
    // Pehle se agar koi toast wrapper nahi hai toh banao
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-slate-700';
    
    toast.className = `${bgColor} text-white px-5 py-3 rounded-xl shadow-lg font-medium text-sm flex items-center gap-2 transform translate-y-4 opacity-0 transition-all duration-300`;
    toast.innerHTML = `
        <span>${type === 'success' ? '🚀' : '⚠️'}</span>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Fade-in effect animation
    setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// purane dynamic alert functions ko fully custom toast se hook/override kar do!
window.alert = function(msg) {
    if(msg.includes('successfully') || msg.includes('Generated') || msg.includes('👍')) {
        showToast(msg, 'success');
    } else if(msg.includes('Bhai') || msg.includes('reset') || msg.includes('karo')) {
        showToast(msg, 'error');
    } else {
        showToast(msg, 'info');
    }
};

// =========================================================
//  3. FORM VALIDATION & MODAL SIMULATION INTERACTION
// =========================================================
// Agar aap student registration submit handle kar rahe hain:
studentForm = document.querySelector('form');
if (studentForm) {
    studentForm.addEventListener('submit', function(e) {
        const nameInput = studentForm.querySelector('input[type="text"]');
        const emailInput = studentForm.querySelector('input[type="email"]');
        
        if (nameInput && nameInput.value.trim() === "") {
            e.preventDefault();
            showToast('Bhai, Name field empty nahi ho sakti!', 'error');
            return false;
        }
        
        if (emailInput && !emailInput.value.includes('@')) {
            e.preventDefault();
            showToast("Bhai, sahi aur valid Email address daalo!", "error");
            return false;
        }
    });
}

// Global toggle function for Jatin's Attendance Portal
window.toggleAttendanceDirect = function(studentIdentifier) {
    // 1. Local storage se data nikalen
    let allStudents = JSON.parse(localStorage.getItem('students')) || [];
    
    // 2. Loop karke status toggle karen (Present <-> Absent)
    allStudents = allStudents.map(student => {
        let idToCheck = student.id || student.name;
        if (idToCheck === studentIdentifier) {
            student.attendanceStatus = (student.attendanceStatus === 'Absent') ? 'Present' : 'Absent';
            
            // Notification toast check
            if (typeof showToast === 'function') {
                showToast(`${student.name} status updated! ✔️`, "success");
            }
        }
        return student;
    });
    
    // 3. Updated data ko local storage me save karen
    localStorage.setItem('students', JSON.stringify(allStudents));
    
    // 4. Table ko instantly refresh karen
    if (typeof renderAttendance === 'function') {
        renderAttendance();
    }
};