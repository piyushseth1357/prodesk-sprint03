// ── DOM Elements ──────────────────────────────
const searchInput    = document.getElementById('searchInput');
const searchBtn      = document.getElementById('searchBtn');
const themeToggle    = document.getElementById('themeToggle');
const loadingState   = document.getElementById('loadingState');
const errorState     = document.getElementById('errorState');
const errorUsername  = document.getElementById('errorUsername');
const profileCard    = document.getElementById('profileCard');
const reposSection   = document.getElementById('reposSection');
const reposList      = document.getElementById('reposList');
const battleToggle   = document.getElementById('battleToggle');
const battleInputs   = document.getElementById('battleInputs');
const battleUser1    = document.getElementById('battleUser1');
const battleUser2    = document.getElementById('battleUser2');
const battleSearchBtn = document.getElementById('battleSearchBtn');
const battleResults  = document.getElementById('battleResults');

// ── State ─────────────────────────────────────
let battleMode = false;

// ── GitHub API Base URL ───────────────────────
const API_BASE = 'https://api.github.com/users';

// ── Utility: Format Date ──────────────────────
// ISO date ko human readable mein convert karo
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// ── Utility: Show Loading ─────────────────────
function showLoading() {
  loadingState.classList.remove('hidden');
  errorState.classList.add('hidden');
  profileCard.classList.add('hidden');
  reposSection.classList.add('hidden');
  battleResults.classList.add('hidden');
}

// ── Utility: Hide Loading ─────────────────────
function hideLoading() {
  loadingState.classList.add('hidden');
}

// ── Utility: Show Error ───────────────────────
function showError(username) {
  hideLoading();
  errorUsername.textContent = `"${username}"`;
  errorState.classList.remove('hidden');
  profileCard.classList.add('hidden');
  reposSection.classList.add('hidden');
}

// ── Fetch GitHub User ─────────────────────────
async function fetchUser(username) {
  // API call karo
  const response = await fetch(`${API_BASE}/${username}`);

  // 404 check karo — user nahi mila
  if (response.status === 404) {
    throw new Error('User not found');
  }

  // JSON parse karo
  const data = await response.json();
  return data;
}

// ── Fetch User Repos ──────────────────────────
async function fetchRepos(reposUrl) {
  // Repos URL se API call karo
  const response = await fetch(`${reposUrl}?sort=updated&per_page=5`);
  const data = await response.json();
  return data;
}

// ── Render Profile Card ───────────────────────
function renderProfile(user) {
  // Avatar set karo
  document.getElementById('avatar').src = user.avatar_url;

  // Name set karo
  document.getElementById('userName').textContent =
    user.name || user.login;

  // Login/username set karo
  document.getElementById('userLogin').textContent =
    '@' + user.login;

  // Bio set karo
  document.getElementById('userBio').textContent =
    user.bio || 'No bio available';

  // Portfolio URL set karo
  const blogEl   = document.getElementById('userBlog');
  const blogText = document.getElementById('userBlogText');

  if (user.blog) {
    blogEl.href = user.blog.startsWith('http')
      ? user.blog
      : 'https://' + user.blog;
    blogText.textContent = user.blog;
    blogEl.classList.remove('hidden');
  } else {
    blogEl.classList.add('hidden');
  }

  // Stats set karo
  document.getElementById('userRepos').textContent =
    user.public_repos;
  document.getElementById('userFollowers').textContent =
    user.followers;
  document.getElementById('userFollowing').textContent =
    user.following;

  // Join date format karo
  document.getElementById('userJoined').textContent =
    formatDate(user.created_at);

  // Profile card dikhao
  profileCard.classList.remove('hidden');
}

// ── Render Repos List ─────────────────────────
function renderRepos(repos) {
  // List clear karo
  reposList.innerHTML = '';

  if (repos.length === 0) {
    reposList.innerHTML =
      '<li style="color:var(--text-muted)">No repositories found.</li>';
    reposSection.classList.remove('hidden');
    return;
  }

  // Top 5 repos render karo
  repos.forEach(function (repo) {
    const li = document.createElement('li');
    li.classList.add('repo-item');

    li.innerHTML = `
      <a href="${repo.html_url}" 
         target="_blank" 
         class="repo-name">
        <i class="fas fa-code-branch"></i> ${repo.name}
      </a>
      <p class="repo-desc">
        ${repo.description || 'No description available'}
      </p>
      <div class="repo-meta">
        <span>
          <i class="fas fa-star"></i> 
          ${repo.stargazers_count}
        </span>
        <span>
          <i class="fas fa-code-fork"></i> 
          ${repo.forks_count}
        </span>
        <span>
          <i class="fas fa-calendar"></i> 
          ${formatDate(repo.updated_at)}
        </span>
      </div>
    `;

    reposList.appendChild(li);
  });

  // Repos section dikhao
  reposSection.classList.remove('hidden');
}

// ── Main Search Function ──────────────────────
async function searchUser(username) {
  // Empty check karo
  if (!username.trim()) {
    alert('Please enter a GitHub username!');
    return;
  }

  // Loading dikhao
  showLoading();

  try {
    // User data fetch karo
    const user = await fetchUser(username);

    // Loading hide karo
    hideLoading();

    // Profile render karo
    renderProfile(user);

    // Repos fetch karo — Phase 2
    const repos = await fetchRepos(user.repos_url);

    // Repos render karo
    renderRepos(repos);

  } catch (error) {
    // Error handle karo — 404 ya network error
    showError(username);
  }
}

// ── Search Button Click ───────────────────────
searchBtn.addEventListener('click', function () {
  const username = searchInput.value.trim();
  searchUser(username);
});

// ── Enter Key Press ───────────────────────────
searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const username = searchInput.value.trim();
    searchUser(username);
  }
});

// ── Battle Mode Toggle ────────────────────────
battleToggle.addEventListener('click', function () {
  battleMode = !battleMode;

  if (battleMode) {
    // Battle mode ON
    battleInputs.classList.remove('hidden');
    battleToggle.classList.add('active');
    battleToggle.innerHTML =
      '<i class="fas fa-xmark"></i> Disable Battle Mode';

    // Normal search hide karo
    profileCard.classList.add('hidden');
    reposSection.classList.add('hidden');
    errorState.classList.add('hidden');

  } else {
    // Battle mode OFF
    battleInputs.classList.add('hidden');
    battleToggle.classList.remove('active');
    battleToggle.innerHTML =
      '<i class="fas fa-sword"></i> Enable Battle Mode ⚔️';

    // Battle results hide karo
    battleResults.classList.add('hidden');
  }
});

// ── Fetch All Repos For Stars ─────────────────
async function fetchAllRepos(username) {
  const response = await fetch(
    `${API_BASE}/${username}/repos?per_page=100`
  );
  const repos = await response.json();
  return repos;
}

// ── Calculate Total Stars ─────────────────────
function calculateStars(repos) {
  // reduce() se sab stars add karo
  return repos.reduce(function (total, repo) {
    return total + repo.stargazers_count;
  }, 0);
}

// ── Render Battle Card ────────────────────────
// function renderBattleCard(cardEl, user, stars, isWinner) {
//   cardEl.className = 'battle-card ' +
//     (isWinner ? 'winner' : 'loser');

//   cardEl.innerHTML = `
//     <img src="${user.avatar_url}" alt="${user.login}" />
//     <h3>${user.name || user.login}</h3>
//     <p style="color:var(--text-muted); font-size:13px; margin-bottom:8px;">
//       @${user.login}
//     </p>
//     <div class="battle-stars">⭐ ${stars}</div>
//     <p style="color:var(--text-muted); font-size:12px; margin-bottom:12px;">
//       Total Stars
//     </p>
//     <span class="battle-badge ${isWinner ? 'winner-badge' : 'loser-badge'}">
//       ${isWinner ? '🏆 Winner' : '💔 Loser'}
//     </span>
//   `;
// }
function renderBattleCard(cardEl, user, stars, isWinner, repos) {
  cardEl.className = 'battle-card ' +
    (isWinner ? 'winner' : 'loser');

  // Top 3 repos HTML banao
  const reposHTML = repos.slice(0, 3).map(function(repo) {
    return `
      <a href="${repo.html_url}" 
         target="_blank" 
         class="battle-repo-link">
        <i class="fas fa-code-branch"></i> ${repo.name}
        <span class="battle-repo-stars">
          ⭐ ${repo.stargazers_count}
        </span>
      </a>
    `;
  }).join('');

  cardEl.innerHTML = `
    <img src="${user.avatar_url}" alt="${user.login}" />
    <h3>${user.name || user.login}</h3>
    <p style="color:var(--text-muted); font-size:13px; margin-bottom:8px;">
      @${user.login}
    </p>
    <div class="battle-stars">⭐ ${stars}</div>
    <p style="color:var(--text-muted); font-size:12px; margin-bottom:12px;">
      Total Stars
    </p>
    <span class="battle-badge ${isWinner ? 'winner-badge' : 'loser-badge'}">
      ${isWinner ? '🏆 Winner' : '💔 Loser'}
    </span>
    <div class="battle-repos">
      <p class="battle-repos-title">Top 3 Repos</p>
      ${reposHTML}
    </div>
  `;
}

// ── Battle Search ─────────────────────────────
battleSearchBtn.addEventListener('click', async function () {
  const username1 = battleUser1.value.trim();
  const username2 = battleUser2.value.trim();

  if (!username1 || !username2) {
    alert('Please enter both usernames!');
    return;
  }

  // Loading dikhao
  showLoading();

  try {
    // Promise.all — dono users ek saath fetch karo
    const [user1, user2] = await Promise.all([
      fetchUser(username1),
      fetchUser(username2)
    ]);

    // Dono ke repos fetch karo
    const [repos1, repos2] = await Promise.all([
      fetchAllRepos(username1),
      fetchAllRepos(username2)
    ]);

    // Stars calculate karo
    const stars1 = calculateStars(repos1);
    const stars2 = calculateStars(repos2);

    // Winner decide karo
    const user1Wins = stars1 >= stars2;

    // Loading hide karo
    hideLoading();

    // Battle cards render karo
    renderBattleCard(
      document.getElementById('battleCard1'),
      user1, stars1, user1Wins, repos1
    );
    renderBattleCard(
      document.getElementById('battleCard2'),
      user2, stars2, !user1Wins, repos2
    );

    // Battle results dikhao
    battleResults.classList.remove('hidden');

  } catch (error) {
    showError(username1 + ' or ' + username2);
  }
});

// ── Dark / Light Mode Toggle ──────────────────
themeToggle.addEventListener('click', function () {
  document.body.classList.toggle('dark');

  if (document.body.classList.contains('dark')) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', 'light');
  }
});

// ── Load Saved Theme ──────────────────────────
(function () {
  const saved = localStorage.getItem('theme');
  const prefersDark =
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved === 'dark' || (!saved && prefersDark)) {
    document.body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
})();