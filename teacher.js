// Teacher dashboard logic for PocketBase
// - Requires a logged-in teacher (role = "teacher")
// - Uses collections: classes, quizBank, classQuizzes, results, users

const pb = new PocketBase("http://127.0.0.1:8090");

const state = {
    classes: [],
    quizzes: [],
    results: [],
};

function ensureTeacherAuth() {
    const model = pb.authStore.model;
    if (!pb.authStore.isValid || !model || model.role !== "teacher") {
        window.location.href = "login-page.html";
        return null;
    }
    return model;
}

function setTeacherHeader(user) {
    const name = user.fullName || user.email || "Teacher";
    const nameEl = document.getElementById("teacherName");
    const avatarEl = document.getElementById("teacherAvatar");

    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = (name[0] || "T").toUpperCase();
}

function showSection(sectionId) {
    document.querySelectorAll(".panel").forEach((panel) => {
        panel.classList.add("hidden");
    });
    const active = document.getElementById(sectionId);
    if (active) active.classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach((btn) => {
        const target = btn.getAttribute("data-section");
        btn.classList.toggle("active", target === sectionId);
    });
}

function setStatus(id, message, type = "") {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.classList.remove("success", "error");
    if (type) el.classList.add(type);
}

function formatDate(iso) {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch (e) {
        return iso;
    }
}

function safeNumber(n, fallback = 0) {
    const parsed = typeof n === "number" ? n : Number(n);
    return Number.isFinite(parsed) ? parsed : fallback;
}

async function loadClasses() {
    const classes = await pb.collection("classes").getFullList({
        sort: "-created",
    });
    state.classes = classes;
    renderClasses();
    renderStats();
    populateClassSelects();
}

function renderClasses() {
    const body = document.getElementById("classesTableBody");
    const table = document.getElementById("classesTable");
    const empty = document.getElementById("classesEmpty");
    if (!body || !table || !empty) return;

    body.innerHTML = "";
    if (!state.classes.length) {
        table.classList.add("hidden");
        empty.classList.remove("hidden");
        return;
    }

    empty.classList.add("hidden");
    table.classList.remove("hidden");

    state.classes.forEach((cls) => {
        const tr = document.createElement("tr");
        const studentCount = safeNumber(cls.studentCount);
        tr.innerHTML = `
            <td>${cls.name || "(no name)"}</td>
            <td>${studentCount}</td>
            <td>${formatDate(cls.created)}</td>
        `;
        body.appendChild(tr);
    });
}

async function loadQuizzes() {
    const quizzes = await pb.collection("quizBank").getFullList({
        sort: "-created",
    });
    state.quizzes = quizzes;
    renderQuizzes();
    renderStats();
    populateQuizSelect();
}

function renderQuizzes() {
    const body = document.getElementById("quizzesTableBody");
    const table = document.getElementById("quizzesTable");
    const empty = document.getElementById("quizzesEmpty");
    if (!body || !table || !empty) return;

    body.innerHTML = "";
    if (!state.quizzes.length) {
        table.classList.add("hidden");
        empty.classList.remove("hidden");
        return;
    }

    empty.classList.add("hidden");
    table.classList.remove("hidden");

    state.quizzes.forEach((quiz) => {
        let questionCount = 0;
        if (Array.isArray(quiz.questions)) questionCount = quiz.questions.length;
        else if (quiz.questions && typeof quiz.questions === "object") questionCount = Object.keys(quiz.questions).length;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${quiz.title || "Untitled"}</td>
            <td>${questionCount}</td>
            <td>${formatDate(quiz.created)}</td>
        `;
        body.appendChild(tr);
    });
}

async function loadResults() {
    const res = await pb.collection("results").getList(1, 50, {
        sort: "-created",
        expand: "classId,quizid,studentId",
    });
    state.results = res.items;
    renderResults();
    renderStats();
}

function renderResults() {
    const allTable = document.getElementById("resultsTable");
    const allBody = document.getElementById("resultsTableBody");
    const allEmpty = document.getElementById("resultsEmpty");
    const overviewTable = document.getElementById("overviewResultsTable");
    const overviewBody = document.getElementById("overviewResultsBody");
    const overviewEmpty = document.getElementById("overviewResultsEmpty");

    if (!allBody || !allTable || !allEmpty || !overviewBody || !overviewTable || !overviewEmpty) return;

    // Full results
    allBody.innerHTML = "";
    if (!state.results.length) {
        allTable.classList.add("hidden");
        allEmpty.classList.remove("hidden");
    } else {
        allEmpty.classList.add("hidden");
        allTable.classList.remove("hidden");

        state.results.forEach((r) => {
            const cls = r.expand?.classId;
            const quiz = r.expand?.quizid;
            const student = r.expand?.studentId;
            const displayScore = r.overwrittenScore ?? r.score;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${student?.fullName || student?.email || "Unknown"}</td>
                <td>${cls?.name || ""}</td>
                <td>${quiz?.title || ""}</td>
                <td>${displayScore}</td>
                <td>${formatDate(r.created)}</td>
            `;
            allBody.appendChild(tr);
        });
    }

    // Overview - only latest 5 results
    overviewBody.innerHTML = "";
    if (!state.results.length) {
        overviewTable.classList.add("hidden");
        overviewEmpty.classList.remove("hidden");
        return;
    }

    overviewEmpty.classList.add("hidden");
    overviewTable.classList.remove("hidden");

    state.results.slice(0, 5).forEach((r) => {
        const cls = r.expand?.classId;
        const quiz = r.expand?.quizid;
        const student = r.expand?.studentId;
        const displayScore = r.overwrittenScore ?? r.score;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${student?.fullName || student?.email || "Unknown"}</td>
            <td>${cls?.name || ""}</td>
            <td>${quiz?.title || ""}</td>
            <td>${displayScore}</td>
            <td>${formatDate(r.created)}</td>
        `;
        overviewBody.appendChild(tr);
    });
}

function renderStats() {
    const totalClasses = state.classes.length;
    const totalStudents = state.classes.reduce((sum, c) => sum + safeNumber(c.studentCount), 0);
    const totalQuizzes = state.quizzes.length;
    const totalSubmissions = state.results.length;

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
    };

    set("statClasses", totalClasses);
    set("statStudents", totalStudents);
    set("statQuizzes", totalQuizzes);
    set("statSubmissions", totalSubmissions);
}

function populateClassSelects() {
    const assignClassSelect = document.getElementById("assignClassSelect");
    const studentClassSelect = document.getElementById("studentClassId");
    const tempClassSelect = document.getElementById("tempClassId");
    const selects = [assignClassSelect, studentClassSelect, tempClassSelect].filter(Boolean);
    if (!selects.length) return;

    selects.forEach((sel) => {
        const current = sel.value;
        sel.innerHTML = '<option value="">Select class...</option>';
        state.classes.forEach((cls) => {
            const opt = document.createElement("option");
            opt.value = cls.id;
            opt.textContent = cls.name || cls.id;
            if (cls.id === current) opt.selected = true;
            sel.appendChild(opt);
        });
    });
}

function populateQuizSelect() {
    const sel = document.getElementById("assignQuizSelect");
    if (!sel) return;

    const current = sel.value;
    sel.innerHTML = '<option value="">Select quiz...</option>';
    state.quizzes.forEach((quiz) => {
        const opt = document.createElement("option");
        opt.value = quiz.id;
        opt.textContent = quiz.title || quiz.id;
        if (quiz.id === current) opt.selected = true;
        sel.appendChild(opt);
    });
}

function buildQuestionsFromForm() {
    const list = document.getElementById("questionList");
    if (!list) return [];

    const items = list.querySelectorAll("[data-question='true']");
    const questions = [];

    items.forEach((el) => {
        const type = el.getAttribute("data-type");
        if (type === "reading") {
            const passage = el.querySelector("[name='passage']")?.value.trim();
            const question = el.querySelector("[name='question']")?.value.trim();
            const opts = [0, 1, 2, 3].map((i) => el.querySelector(`[name='opt${i}']`)?.value.trim()).filter(Boolean);
            const correctIndex = Number(el.querySelector("[name='correct']")?.value || 0);
            if (passage && question && opts.length >= 2) {
                questions.push({ type: "reading", passage, question, options: opts, correct: correctIndex, explanation: "" });
            }
        } else if (type === "listening") {
            const audioText = el.querySelector("[name='audioText']")?.value.trim();
            const question = el.querySelector("[name='question']")?.value.trim();
            const opts = [0, 1, 2, 3].map((i) => el.querySelector(`[name='opt${i}']`)?.value.trim()).filter(Boolean);
            const correctIndex = Number(el.querySelector("[name='correct']")?.value || 0);
            if (audioText && question && opts.length >= 2) {
                questions.push({ type: "listening", audioText, question, options: opts, correct: correctIndex, explanation: "" });
            }
        } else if (type === "writing") {
            const prompt = el.querySelector("[name='prompt']")?.value.trim();
            const minWords = Number(el.querySelector("[name='minWords']")?.value || 0) || 0;
            const maxWords = Number(el.querySelector("[name='maxWords']")?.value || 0) || 0;
            if (prompt) {
                questions.push({
                    type: "writing",
                    prompt,
                    minWords,
                    maxWords,
                    rubric: {},
                });
            }
        }
    });

    return questions;
}

function addQuestionBlock(type) {
    const list = document.getElementById("questionList");
    if (!list) return;

    const wrapper = document.createElement("div");
    wrapper.className = "question-item";
    wrapper.setAttribute("data-question", "true");
    wrapper.setAttribute("data-type", type);

    let title = "";
    if (type === "reading") title = "Reading question";
    else if (type === "listening") title = "Listening question";
    else title = "Writing prompt";

    if (type === "reading") {
        wrapper.innerHTML = `
            <div class="question-item-header">
                <span class="question-badge">Reading</span>
                <button type="button" class="btn-secondary" data-remove>Remove</button>
            </div>
            <div class="form-group">
                <label>Passage</label>
                <textarea name="passage" rows="3" placeholder="Reading passage..."></textarea>
            </div>
            <div class="form-group">
                <label>Question</label>
                <input type="text" name="question" placeholder="Question text">
            </div>
            <div class="form-row">
                <div class="form-group"><label>A</label><input type="text" name="opt0" placeholder="Option A"></div>
                <div class="form-group"><label>B</label><input type="text" name="opt1" placeholder="Option B"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>C</label><input type="text" name="opt2" placeholder="Option C"></div>
                <div class="form-group"><label>D</label><input type="text" name="opt3" placeholder="Option D"></div>
            </div>
            <div class="form-group">
                <label>Correct option</label>
                <select name="correct">
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                </select>
            </div>
        `;
    } else if (type === "listening") {
        wrapper.innerHTML = `
            <div class="question-item-header">
                <span class="question-badge">Listening</span>
                <button type="button" class="btn-secondary" data-remove>Remove</button>
            </div>
            <div class="form-group">
                <label>Audio text (what will be read aloud)</label>
                <textarea name="audioText" rows="3" placeholder="Text that will be converted to audio..."></textarea>
            </div>
            <div class="form-group">
                <label>Question</label>
                <input type="text" name="question" placeholder="Question text">
            </div>
            <div class="form-row">
                <div class="form-group"><label>A</label><input type="text" name="opt0" placeholder="Option A"></div>
                <div class="form-group"><label>B</label><input type="text" name="opt1" placeholder="Option B"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>C</label><input type="text" name="opt2" placeholder="Option C"></div>
                <div class="form-group"><label>D</label><input type="text" name="opt3" placeholder="Option D"></div>
            </div>
            <div class="form-group">
                <label>Correct option</label>
                <select name="correct">
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                </select>
            </div>
        `;
    } else {
        wrapper.innerHTML = `
            <div class="question-item-header">
                <span class="question-badge">Writing</span>
                <button type="button" class="btn-secondary" data-remove>Remove</button>
            </div>
            <div class="form-group">
                <label>Prompt</label>
                <textarea name="prompt" rows="3" placeholder="Writing prompt..."></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Min words</label>
                    <input type="number" name="minWords" min="0" placeholder="e.g. 40">
                </div>
                <div class="form-group">
                    <label>Max words</label>
                    <input type="number" name="maxWords" min="0" placeholder="e.g. 90">
                </div>
            </div>
        `;
    }

    const removeBtn = wrapper.querySelector("[data-remove]");
    if (removeBtn) {
        removeBtn.addEventListener("click", () => {
            wrapper.remove();
        });
    }

    list.appendChild(wrapper);
}

function attachEventListeners() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            pb.authStore.clear();
            window.location.href = "login-page.html";
        });
    }

    const classForm = document.getElementById("classForm");
    if (classForm) {
        classForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            setStatus("classStatus", "Creating class...", "");
            const nameInput = document.getElementById("className");
            const name = nameInput?.value.trim();
            if (!name) return;

            try {
                const user = pb.authStore.model;
                const created = await pb.collection("classes").create({
                    name,
                    teacherId: user.id,
                    studentCount: 0,
                });
                state.classes.unshift(created);
                renderClasses();
                renderStats();
                populateClassSelects();
                nameInput.value = "";
                setStatus("classStatus", "Class created.", "success");
            } catch (err) {
                setStatus("classStatus", "Failed to create class: " + err.message, "error");
            }
        });
    }

    const quizForm = document.getElementById("quizForm");
    if (quizForm) {
        const addReadingBtn = document.getElementById("addReadingQuestion");
        const addListeningBtn = document.getElementById("addListeningQuestion");
        const addWritingBtn = document.getElementById("addWritingQuestion");

        if (addReadingBtn) addReadingBtn.addEventListener("click", () => addQuestionBlock("reading"));
        if (addListeningBtn) addListeningBtn.addEventListener("click", () => addQuestionBlock("listening"));
        if (addWritingBtn) addWritingBtn.addEventListener("click", () => addQuestionBlock("writing"));

        quizForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            setStatus("quizStatus", "Saving quiz...", "");
            const titleInput = document.getElementById("quizTitle");
            const title = titleInput?.value.trim();
            if (!title) {
                setStatus("quizStatus", "Please enter a quiz title.", "error");
                return;
            }

            const questions = buildQuestionsFromForm();

            try {
                const user = pb.authStore.model;
                const created = await pb.collection("quizBank").create({
                    title,
                    questions,
                    createdBy: user.id,
                });
                state.quizzes.unshift(created);
                renderQuizzes();
                renderStats();
                populateQuizSelect();
                titleInput.value = "";
                const list = document.getElementById("questionList");
                if (list) list.innerHTML = "";
                setStatus("quizStatus", "Quiz saved.", "success");
            } catch (err) {
                setStatus("quizStatus", "Failed to save quiz: " + err.message, "error");
            }
        });
    }

    const assignForm = document.getElementById("assignForm");
    if (assignForm) {
        assignForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            setStatus("assignStatus", "Assigning quiz...", "");
            const classSel = document.getElementById("assignClassSelect");
            const quizSel = document.getElementById("assignQuizSelect");
            const classId = classSel?.value;
            const quizId = quizSel?.value;
            if (!classId || !quizId) return;

            try {
                const user = pb.authStore.model;
                await pb.collection("classQuizzes").create({
                    classId,
                    quizId,
                    assignedBy: user.id,
                });
                setStatus("assignStatus", "Quiz assigned to class.", "success");
            } catch (err) {
                setStatus("assignStatus", "Failed to assign quiz: " + err.message, "error");
            }
        });
    }

    const studentForm = document.getElementById("studentForm");
    if (studentForm) {
        studentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            setStatus("studentStatus", "Creating student account...", "");

            const nameEl = document.getElementById("studentName");
            const emailEl = document.getElementById("studentEmail");
            const classEl = document.getElementById("studentClassId");
            const codeEl = document.getElementById("studentCode");
            const pwdEl = document.getElementById("studentPassword");
            const pwd2El = document.getElementById("studentPasswordConfirm");

            const fullName = nameEl?.value.trim();
            const email = emailEl?.value.trim();
            const classId = classEl?.value;
            const studentCode = codeEl?.value.trim() || undefined;
            const pwd = pwdEl?.value || "";
            const pwd2 = pwd2El?.value || "";

            if (!fullName || !email || !classId) {
                setStatus("studentStatus", "Please fill all required fields.", "error");
                return;
            }
            if (!pwd || pwd !== pwd2) {
                setStatus("studentStatus", "Passwords do not match.", "error");
                return;
            }

            try {
                await pb.collection("users").create({
                    email,
                    password: pwd,
                    passwordConfirm: pwd2,
                    fullName,
                    role: "student",
                    class: classId,
                    studentCode,
                    // NOTE: we don't touch the built-in `verified` field here;
                    // PocketBase manages it, and forcing it from the browser causes validation errors.
                });

                nameEl.value = "";
                emailEl.value = "";
                codeEl.value = "";
                pwdEl.value = "";
                pwd2El.value = "";
                classEl.value = "";

                setStatus("studentStatus", "Student account created.", "success");
            } catch (err) {
                setStatus("studentStatus", "Failed to create student: " + err.message, "error");
            }
        });
    }

    const tempForm = document.getElementById("tempAccountsForm");
    if (tempForm) {
        tempForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            setStatus("tempStatus", "Generating accounts...", "");
            const classEl = document.getElementById("tempClassId");
            const countEl = document.getElementById("tempCount");
            const pwdEl = document.getElementById("tempPassword");
            const output = document.getElementById("tempAccountsList");

            const classId = classEl?.value;
            const count = Number(countEl?.value || 0);
            let basePassword = (pwdEl?.value || "").trim();

            if (!classId) {
                setStatus("tempStatus", "Please choose a class.", "error");
                return;
            }
            if (!Number.isFinite(count) || count < 1 || count > 40) {
                setStatus("tempStatus", "Number of accounts must be between 1 and 40.", "error");
                return;
            }

            if (!basePassword) {
                basePassword = Math.random().toString(36).slice(-10); // auto strong password
            }
            if (basePassword.length < 8) {
                setStatus("tempStatus", "Password must be at least 8 characters.", "error");
                return;
            }

            const lines = [];

            try {
                for (let i = 1; i <= count; i++) {
                    const code = `${classId.slice(0, 5).toUpperCase()}-${String(i).padStart(2, "0")}`;
                    const email = `temp_${classId}_${Date.now()}_${i}@example.com`;

                    await pb.collection("users").create({
                        email,
                        password: basePassword,
                        passwordConfirm: basePassword,
                        fullName: "",
                        role: "student",
                        // omit `class` here because the current schema rejects this value;
                        // students will still be linked to a class via assignments and results.
                        studentCode: code,
                        // same as above: let PocketBase manage `verified`.
                    });

                    lines.push(`${code}  |  password: ${basePassword}`);
                }

                if (output) {
                    output.textContent = lines.join("\n");
                }
                setStatus("tempStatus", "Temporary accounts created. Share the codes and password with students.", "success");
            } catch (err) {
                console.error("Failed to create temporary accounts", err);
                let message = err?.message || "Failed to create record.";
                if (err?.data?.data) {
                    const fieldErrors = Object.entries(err.data.data)
                        .map(([field, info]) => `${field}: ${info?.message || "invalid"}`)
                        .join(", ");
                    if (fieldErrors) {
                        message += " (" + fieldErrors + ")";
                    }
                }
                setStatus("tempStatus", "Failed to create temporary accounts: " + message, "error");
            }
        });
    }
}

async function initTeacherDashboard() {
    const user = ensureTeacherAuth();
    if (!user) return;

    setTeacherHeader(user);
    attachEventListeners();

    try {
        await Promise.all([loadClasses(), loadQuizzes(), loadResults()]);
    } catch (err) {
        console.error("Failed to load dashboard data", err);
    }
}

document.addEventListener("DOMContentLoaded", initTeacherDashboard);

// Expose for inline nav buttons
window.showSection = showSection;
