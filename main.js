let allIssues = []; // Global store for filtering

// 1. Fetch All Issues on Load
const loadInitialData = async () => {
  const grid = document.getElementById("issues-grid");
  const spinner = document.getElementById("loading-spinner");

  // Show Loading Spinner
  spinner.classList.remove("hidden");

  try {
    const res = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const result = await res.json();
    allIssues = result.data; // Store data for tab filtering
    displayIssues(allIssues);
  } catch (error) {
    console.error("Error loading issues:", error);
  } finally {
    // Hide Loading Spinner
    spinner.classList.add("hidden");
  }
};

// 2. Display Function (Grid Generator)
const displayIssues = (issues) => {
  const grid = document.getElementById("issues-grid");
  const countElement = document.getElementById("issue-count");

  grid.innerHTML = ""; // Clear grid
  countElement.innerText = issues.length; // Update summary count

  issues.forEach((issue) => {
    const card = document.createElement("div");

    // Dynamic styling based on JSON 'status'
    const isOpen = issue.status === "open";
    const statusColor = isOpen ? './assets/Open-Status.png' : './assets/Closed-Status.png';
    const borderColor = isOpen ? "border-emerald-500" : "border-[#631dfa]";

    card.className = `card bg-white shadow-sm border border-slate-100 border-t-4 ${borderColor} p-5 space-y-4 hover:shadow-md transition-shadow cursor-pointer`;
    card.onclick = () => loadSingleIssue(issue.id);

    // Generate dynamic label spans from JSON array
    const labelHtml = issue.labels.map(label => {
    const lowerLabel = label.toLowerCase();
    
    // Default styling
    let icon = "fa-tag";
    let colors = "bg-emerald-50 text-emerald-500 border-emerald-100";

    // Specific styling for 'bug'
    if (lowerLabel === 'bug') {
        icon = "fa-bug";
        colors = "bg-rose-50 text-rose-500 border-rose-100";
    } 
    // Specific styling for 'help wanted'
    else if (lowerLabel === 'help wanted') {
        icon = "fa-circle-dot"; // Or fa-life-ring
        colors = "bg-amber-50 text-amber-500 border-amber-200";
    }

    else if (lowerLabel === 'documentation') {
        icon = "fa-book";
        colors = "bg-blue-50 text-blue-500 border-blue-100";
    }

    else if (lowerLabel === 'enhancement') {
        icon = "fa-wand-magic-sparkles";
        colors = "bg-green-50 text-green-500 border-green-100";
    }

    return `
        <span class="flex items-center gap-1.5 px-3 py-1 rounded-full border ${colors} text-[10px] font-bold uppercase tracking-tight">
            <i class="fa-solid ${icon} text-[9px]"></i> 
            ${label}
        </span>
    `;
}).join('');

    card.innerHTML = `
    <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center">
                <img src="${statusColor}" alt="${issue.status}" class="w-2 h-2">
            </div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ISSUE</span>
        </div>
        <div class="badge ${issue.priority === "high" ? "badge-error" : issue.priority === "medium" ? "badge-warning" : "badge-ghost"} badge-outline text-[10px] font-extrabold px-3 h-5 uppercase">
            ${issue.priority}
        </div>
    </div>

    <div>
        <h3 class="font-bold text-slate-800 text-sm leading-snug mb-2">${issue.title}</h3>
        <p class="text-slate-400 text-[11px] leading-relaxed ">${issue.description}</p>
    </div>

    <div class="flex flex-wrap gap-2">
        ${labelHtml}
    </div>

    <div class="border-t border-slate-50 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-medium">
        <span>#${issue.id} by <span class="text-slate-600 font-bold">${issue.author}</span></span>
        <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
    </div>
`;
    grid.appendChild(card);
  });
};

// 3. Tab Filtering
const filterIssues = (category) => {
  // Update Active Styles
  const tabs = ["all", "open", "closed"];
  tabs.forEach((tab) => {
    const btn = document.getElementById(`tab-${tab}`);
    if (tab === category) {
      btn.className =
        "btn bg-[#631dfa] hover:bg-[#5215d6] text-white border-none rounded-md px-10 h-11 min-h-0 text-sm font-bold shadow-md";
    } else {
      btn.className =
        "btn bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 rounded-md px-10 h-11 min-h-0 text-sm font-semibold";
    }
  });

  // Filter Logic
  if (category === "all") {
    displayIssues(allIssues);
  } else {
    const filtered = allIssues.filter((item) => item.status === category);
    displayIssues(filtered);
  }
};

// Search function
const handleSearch = async () => {
  const searchField = document.getElementById("search-input");
  const searchText = searchField.value.trim();
  const grid = document.getElementById("issues-grid");
  const spinner = document.getElementById("loading-spinner");

  
  spinner.classList.remove("hidden");
  grid.classList.add("opacity-50");

  try {
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`,
    );
    const result = await res.json();

    if (result.status === "success") {
      displayIssues(result.data); 
    }
  } finally {
    spinner.classList.add("hidden");
    grid.classList.remove("opacity-50");
  }
};

// Bonus: Trigger search when pressing 'Enter' key
document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// 5. Single Issue Modal Fetch
const loadSingleIssue = async (id) => {
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const result = await res.json();
        const issue = result.data;
        const modal = document.getElementById('issue_modal');

        const modalContainer = document.getElementById('modal-content');
        
        // 1. Logic for dynamic badges
        const isOpen = issue.status === 'open';
        const statusClass = isOpen ? 'bg-emerald-500' : 'bg-[#631dfa]';
        
        // 2. Format labels
        const labelsHtml = issue.labels.map(label => `
            <span class="flex items-center gap-1 px-2 py-0.5 rounded border border-rose-100 bg-rose-50 text-rose-500 text-[10px] font-bold uppercase">
                <i class="fa-solid fa-tag text-[8px]"></i> ${label}
            </span>
        `).join('');

        modalContainer.innerHTML = `
            <div class="p-2">
                <h2 class="text-2xl font-extrabold text-slate-800 mb-2">${issue.title}</h2>
                
                <div class="flex items-center gap-2 mb-6 text-sm">
                    <span class="${statusClass} text-white px-3 py-1 rounded-full text-xs font-bold capitalize">
                        ${issue.status}
                    </span>
                    <span class="text-slate-400 font-medium">•</span>
                    <span class="text-slate-500 font-medium">Opened by <span class="text-slate-700 font-bold">${issue.author}</span></span>
                    <span class="text-slate-400 font-medium">•</span>
                    <span class="text-slate-500 font-medium">${new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>

                <div class="flex gap-2 mb-6">
                    ${labelsHtml}
                </div>

                <p class="text-slate-500 leading-relaxed mb-8 text-sm">
                    ${issue.description}
                </p>

                <div class="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div>
                        <p class="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Assignee:</p>
                        <p class="text-slate-800 font-extrabold">${issue.assignee || 'Unassigned'}</p>
                    </div>
                    <div>
                        <p class="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Priority:</p>
                        <span class="bg-rose-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">
                            ${issue.priority}
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        modal.showModal();
    } catch (error) {
        console.error("Failed to load issue details:", error);
    }
};
// Initial API Call
loadInitialData();
