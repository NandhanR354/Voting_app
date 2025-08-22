// Application Data with persistent storage
let appData = {
  alliances: [
    {id: 1, name: "TVK Alliance", votes: 0, icon: "", voterIds: []},
    {id: 2, name: "DMK Alliance", votes: 0, icon: "", voterIds: []},
    {id: 3, name: "ADMK Alliance", votes: 0, icon: "", voterIds: []}
  ],
  votedIds: [],
  adminPassword: "28121961",  // ← CHANGE YOUR PASSWORD HERE
  currentVoterId: "",
  isAdminLoggedIn: false
};

// Storage key for persistence
const STORAGE_KEY = 'politicalVotingSystemData';

// Save data to localStorage
function saveData() {
  try {
    const dataToSave = {
      alliances: appData.alliances,
      votedIds: appData.votedIds,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    console.log('Data saved successfully');
  } catch (e) {
    console.warn('Could not save data to localStorage:', e);
  }
}

// Load data from localStorage
function loadData() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      console.log('Loading saved data:', parsed);

      // Validate data structure
      if (parsed.alliances && Array.isArray(parsed.alliances) && parsed.alliances.length === 3) {
        appData.alliances = parsed.alliances;
        appData.votedIds = parsed.votedIds || [];

        console.log('Data loaded successfully');
        console.log('Total votes:', appData.alliances.reduce((sum, a) => sum + a.votes, 0));
        console.log('Voted IDs:', appData.votedIds.length);

        return true;
      }
    }
  } catch (e) {
    console.warn('Could not load saved data:', e);
  }
  return false;
}

// Initialize data on page load
function initializeData() {
  const dataLoaded = loadData();
  if (dataLoaded) {
    console.log('Using saved data');
    // Update any displayed data
    updateIconsFromData();
    if (appData.isAdminLoggedIn) {
      updateAdminDashboard();
    }
  } else {
    console.log('Starting with fresh data');
    // Save initial empty state
    saveData();
  }
}

// Update icons from loaded data
function updateIconsFromData() {
  appData.alliances.forEach(alliance => {
    if (alliance.icon) {
      // Update voting page icons
      const votingIcon = document.getElementById(`votingIcon${alliance.id}`);
      if (votingIcon) {
        votingIcon.src = alliance.icon;
        votingIcon.style.display = 'block';
      }

      // Update admin page icons
      const adminIcon = document.getElementById(`icon${alliance.id}`);
      if (adminIcon) {
        adminIcon.src = alliance.icon;
        adminIcon.style.display = 'block';
      }

      const adminIcon2 = document.getElementById(`adminIcon${alliance.id}`);
      if (adminIcon2) {
        adminIcon2.src = alliance.icon;
        adminIcon2.style.display = 'block';
      }
    }
  });
}

// Utility Functions
function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Show selected page
  const targetPage = document.getElementById(pageName + 'Page');
  if (targetPage) {
    targetPage.classList.add('active');
  }
}

function showAdminSection(sectionName) {
  // Hide all admin sections
  document.querySelectorAll('.admin-section').forEach(section => {
    section.classList.remove('active');
  });

  // Show selected section
  const targetSection = document.getElementById(sectionName === 'login' ? 'adminLogin' : 'adminDashboard');
  if (targetSection) {
    targetSection.classList.add('active');
  }
}

function showModal(modalName) {
  const modal = document.getElementById(modalName + 'Modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function hideModal(modalName) {
  const modal = document.getElementById(modalName + 'Modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
  }
}

function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.classList.add('hidden');
  }
}

function showLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.classList.remove('hidden');
  }
}

function hideLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.classList.add('hidden');
  }
}

// CSV Download Functions
function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generateAllianceCSV(allianceId) {
  const alliance = appData.alliances.find(a => a.id === allianceId);
  if (!alliance) return;

  // Create CSV header
  let csvContent = "Serial No,Voter ID,Voting Time,Alliance Name\n";

  // Add voter data
  alliance.voterIds.forEach((voterData, index) => {
    csvContent += `${index + 1},"${voterData.voterId}","${voterData.timestamp}","${alliance.name}"\n`;
  });

  // Generate filename with current date
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS format
  const filename = `${alliance.name.replace(/\s+/g, '_')}_voters_${dateStr}_${timeStr}.csv`;

  downloadCSV(filename, csvContent);
}

function downloadAllVotersCSV() {
  let csvContent = "Serial No,Voter ID,Alliance Name,Voting Time\n";
  let serialNo = 1;

  appData.alliances.forEach(alliance => {
    alliance.voterIds.forEach(voterData => {
      csvContent += `${serialNo},"${voterData.voterId}","${alliance.name}","${voterData.timestamp}"\n`;
      serialNo++;
    });
  });

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  const filename = `All_Voters_${dateStr}_${timeStr}.csv`;

  downloadCSV(filename, csvContent);
}

// Validation Functions
function validateVoterId(voterId) {
  // Check format: ABC0000000 (3 letters + 7 digits)
  const pattern = /^[A-Za-z]{3}\d{7}$/;
  return pattern.test(voterId);
}

function hasVoterAlreadyVoted(voterId) {
  return appData.votedIds.includes(voterId);
}

// Voting Functions
function handleLogin(event) {
  event.preventDefault();
  hideError('loginError');

  const voterIdInput = document.getElementById('voterId');
  const voterId = voterIdInput.value.trim().toUpperCase();

  // Validate voter ID format
  if (!validateVoterId(voterId)) {
    showError('loginError', 'Please enter a valid Voter ID (format: ABC0000000)');
    return;
  }

  // Check if already voted
  if (hasVoterAlreadyVoted(voterId)) {
    showError('loginError', 'This Voter ID has already voted');
    return;
  }

  // Store current voter ID and show voting page
  appData.currentVoterId = voterId;
  document.getElementById('currentVoterId').textContent = voterId;
  showPage('voting');

  // Clear the form
  voterIdInput.value = '';
}

function handleVote(allianceId) {
  const voterId = appData.currentVoterId;

  if (!voterId) {
    alert('Please login first');
    showPage('login');
    return;
  }

  // Record the vote
  const alliance = appData.alliances.find(a => a.id === allianceId);
  if (alliance) {
    // Increment vote count
    alliance.votes += 1;

    // Add voter ID to alliance's voter list with timestamp
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    alliance.voterIds.push({
      voterId: voterId,
      timestamp: timestamp
    });

    // Add to voted IDs list
    appData.votedIds.push(voterId);

    // IMPORTANT: Save data immediately after vote
    saveData();

    // Clear current voter
    appData.currentVoterId = '';

    // Show success modal
    showModal('success');

    // Update admin dashboard if it's open
    if (appData.isAdminLoggedIn) {
      updateAdminDashboard();
    }

    console.log('Vote recorded for:', voterId, 'Alliance:', alliance.name);
    console.log('Total votes now:', alliance.votes);
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  hideError('adminError');

  const passwordInput = document.getElementById('adminPassword');
  const password = passwordInput.value.trim();

  if (password === appData.adminPassword) {
    appData.isAdminLoggedIn = true;
    showAdminSection('dashboard');
    updateAdminDashboard();
    passwordInput.value = '';
  } else {
    showError('adminError', 'Invalid admin password');
  }
}

function updateAdminDashboard() {
  const totalVotes = appData.alliances.reduce((sum, alliance) => sum + alliance.votes, 0);

  // Update total statistics
  const totalVotesEl = document.getElementById('totalVotes');
  const totalVotersEl = document.getElementById('totalVoters');

  if (totalVotesEl) totalVotesEl.textContent = totalVotes;
  if (totalVotersEl) totalVotersEl.textContent = appData.votedIds.length;

  // Update individual alliance statistics
  appData.alliances.forEach(alliance => {
    const percentage = totalVotes > 0 ? ((alliance.votes / totalVotes) * 100).toFixed(1) : '0.0';

    const votesEl = document.getElementById(`alliance${alliance.id}Votes`);
    const percentageEl = document.getElementById(`alliance${alliance.id}Percentage`);
    const voterCountEl = document.getElementById(`alliance${alliance.id}VoterCount`);
    const progressBarEl = document.getElementById(`alliance${alliance.id}Progress`);

    if (votesEl) votesEl.textContent = alliance.votes;
    if (percentageEl) percentageEl.textContent = percentage + '%';
    if (voterCountEl) voterCountEl.textContent = alliance.voterIds.length;
    if (progressBarEl) progressBarEl.style.width = percentage + '%';
  });

  console.log('Dashboard updated - Total votes:', totalVotes);
}

function resetPollData() {
  if (confirm('Are you sure you want to reset all poll data? This action cannot be undone.')) {
    // Reset all data
    appData.alliances.forEach(alliance => {
      alliance.votes = 0;
      alliance.voterIds = [];
      // Keep icons
    });
    appData.votedIds = [];

    // Save the reset data immediately
    saveData();

    // Update dashboard
    updateAdminDashboard();
    alert('Poll data has been reset successfully!');

    console.log('Poll data reset');
  }
}

function handleImageUpload(allianceId, event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file');
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size should be less than 5MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const alliance = appData.alliances.find(a => a.id === allianceId);
    if (alliance) {
      alliance.icon = e.target.result;

      // Save data with new icon
      saveData();

      // Update all icon displays
      updateIconsFromData();
    }
  };
  reader.readAsDataURL(file);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');

  // Initialize data first
  initializeData();

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Admin login form
  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleAdminLogin);
  }

  // Admin access button
  const adminAccessBtn = document.getElementById('adminAccessBtn');
  if (adminAccessBtn) {
    adminAccessBtn.addEventListener('click', () => {
      showPage('admin');
      showAdminSection('login');
    });
  }

  // Back to voting buttons
  document.querySelectorAll('.back-to-voting').forEach(btn => {
    btn.addEventListener('click', () => {
      showPage('login');
      appData.isAdminLoggedIn = false;
    });
  });

  // Voting buttons
  document.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const allianceId = parseInt(e.target.dataset.alliance);
      handleVote(allianceId);
    });
  });

  // Modal close buttons
  document.querySelectorAll('.modal-close, .modal-backdrop').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-backdrop')) {
        hideModal('success');
        hideModal('confirm');
        showPage('login');
      }
    });
  });

  // CSV Download buttons
  const downloadTVKBtn = document.getElementById('downloadTVKCSV');
  if (downloadTVKBtn) {
    downloadTVKBtn.addEventListener('click', () => generateAllianceCSV(1));
  }

  const downloadDMKBtn = document.getElementById('downloadDMKCSV');
  if (downloadDMKBtn) {
    downloadDMKBtn.addEventListener('click', () => generateAllianceCSV(2));
  }

  const downloadADMKBtn = document.getElementById('downloadADMKCSV');
  if (downloadADMKBtn) {
    downloadADMKBtn.addEventListener('click', () => generateAllianceCSV(3));
  }

  const downloadAllBtn = document.getElementById('downloadAllCSV');
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', downloadAllVotersCSV);
  }

  // Reset button
  const resetBtn = document.getElementById('resetPollData');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetPollData);
  }

  // Image upload inputs
  for (let i = 1; i <= 3; i++) {
    const uploadInput = document.getElementById(`uploadIcon${i}`);
    if (uploadInput) {
      uploadInput.addEventListener('change', (e) => handleImageUpload(i, e));
    }
  }

  console.log('Event listeners attached');
});

// Auto-save data periodically
setInterval(() => {
  saveData();
}, 30000); // Save every 30 seconds

// Save data when page is about to be closed/refreshed
window.addEventListener('beforeunload', function() {
  saveData();
  console.log('Data saved before page unload');
});

// Save data when page becomes hidden (mobile/tab switching)
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    saveData();
    console.log('Data saved - page hidden');
  }
});

// Load and display data when page becomes visible again
window.addEventListener('focus', function() {
  console.log('Page focused - checking for data updates');
  loadData();
  updateIconsFromData();
  if (appData.isAdminLoggedIn) {
    updateAdminDashboard();
  }
});
