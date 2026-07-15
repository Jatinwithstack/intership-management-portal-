// Form validate karne ka function
function validateStudentForm(name, email, attendance, performance) {
    const errors = [];

    // 1. Name Check
    if (!name || name.trim() === "") {
        errors.push("Name likhna zaroori hai!");
    }

    // 2. Email Check (Regex validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Kripya ek valid Email ID dalein!");
    }

    // 3. Attendance Check (0 se 100 ke beech honi chahiye)
    if (attendance === "" || isNaN(attendance) || attendance < 0 || attendance > 100) {
        errors.push("Attendance 0 se 100% ke beech honi chahiye!");
    }

    // 4. Performance Check (0 se 10 ke beech rating)
    if (performance === "" || isNaN(performance) || performance < 0 || performance > 10) {
        errors.push("Performance Score 0 se 10 ke beech hona chahiye!");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}