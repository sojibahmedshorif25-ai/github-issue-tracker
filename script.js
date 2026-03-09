const issues = Array.from({length: 50}, (_, i) => ({
  title: "Fix Navigation Menu On Mobile Devices",
  description: "The navigation menu is not responsive on mobile devices and overlaps content.",
  status: i % 5 === 0 ? "closed" : "open",
  author: `user${(i % 6) + 1}`,
  priority: ["Low", "Medium", "High", "Urgent"][i % 4],
  label: ["bug", "enhancement", "help wanted", "question"][i % 4],
  createdAt: `1/${String((i % 28) + 1).padStart(2, '0')}/2024`
}));

let currentFilter = "all";
let searchTerm = "";

const loginPage = document.getElementById("loginPage");
const mainPage = document.getElementById("mainPage");
const signInBtn = document.getElementById("signInBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");
const issuesGrid = document.getElementById("issuesGrid");
const loading = document.getElementById("loading");
const issueCount = document.getElementById("issueCount");
const searchInput = document.getElementById("searchInput");

signInBtn.addEventListener("click", () => {
  if (username.value.trim() === "admin" && password.value.trim() === "admin123") {
    loginPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
    loadIssues();
  } else {
    alert("Invalid! Use admin / admin123");
  }
});

password.addEventListener("keypress", e => { if (e.key === "Enter") signInBtn.click(); });

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.status;
    loadIssues();
  });
});

searchInput.addEventListener("input", e => {
  searchTerm = e.target.value.toLowerCase().trim();
  loadIssues();
});

function loadIssues() {
  loading.classList.remove("hidden");
  issuesGrid.innerHTML = "";

  setTimeout(() => {
    loading.classList.add("hidden");

    let filtered = issues.filter(issue => {
      if (currentFilter === "open") return issue.status === "open";
      if (currentFilter === "closed") return issue.status === "closed";
      return true;
    });

    if (searchTerm) {
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(searchTerm) || i.description.toLowerCase().includes(searchTerm)
      );
    }

    issueCount.textContent = `${filtered.length} Issues`;

    filtered.forEach(issue => {
      const card = document.createElement("div");
      card.className = `card p-6 cursor-pointer ${issue.status === "open" ? "card-open" : "card-closed"}`;
      card.innerHTML = `
        <h2 class="font-semibold text-lg mb-2">${issue.title}</h2>
        <p class="text-sm text-base-content/70 line-clamp-2 mb-4">${issue.description}</p>
        <div class="flex flex-wrap gap-2 text-xs">
          <span class="badge badge-outline">${issue.author}</span>
          <span class="badge ${issue.priority === 'Urgent' ? 'badge-error' : issue.priority === 'High' ? 'badge-warning' : 'badge-info'}">${issue.priority}</span>
          <span class="badge badge-outline">${issue.label}</span>
          <span class="badge ${issue.status === 'open' ? 'badge-success' : 'badge-secondary'}">${issue.status}</span>
        </div>
        <p class="text-xs text-base-content/60 mt-4">${issue.createdAt}</p>
      `;
      card.onclick = () => {
        document.getElementById("modalTitle").textContent = issue.title;
        document.getElementById("modalDesc").textContent = issue.description;
        const st = document.getElementById("modalStatus");
        st.textContent = issue.status.toUpperCase();
        st.className = `badge px-4 py-2 ${issue.status === 'open' ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'}`;
        document.getElementById("modalAuthor").textContent = issue.author;
        document.getElementById("modalPriority").textContent = issue.priority;
        document.getElementById("modalLabel").textContent = issue.label;
        document.getElementById("modalCreated").textContent = issue.createdAt;
        document.getElementById("issueModal").showModal();
      };
      issuesGrid.appendChild(card);
    });
  }, 700);
}