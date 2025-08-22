// Application Data with CSV tracking
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

    // Clear current voter
    appData.currentVoterId = '';

    // Show success modal
    showModal('success');

    // Update admin dashboard if it's open
    if (appData.isAdminLoggedIn) {
      updateAdminDashboard();
    }
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
  document.getElementById('totalVotes').textContent = totalVotes;
  document.getElementById('totalVoters').textContent = appData.votedIds.length;

  appData.alliances.forEach(alliance => {
    const percentage = totalVotes > 0 ? ((alliance.votes / totalVotes) * 100).toFixed(1) : '0.0';

    document.getElementById(`alliance${alliance.id}Votes`).textContent = alliance.votes;
    document.getElementById(`alliance${alliance.id}Percentage`).textContent = percentage + '%';
    document.getElementById(`alliance${alliance.id}VoterCount`).textContent = alliance.voterIds.length;

    // Update progress bar
    const progressBar = document.getElementById(`alliance${alliance.id}Progress`);
    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }
  });
}

function resetPollData() {
  if (confirm('Are you sure you want to reset all poll data? This action cannot be undone.')) {
    // Reset all data
    appData.alliances.forEach(alliance => {
      alliance.votes = 0;
      alliance.voterIds = [];
    });
    appData.votedIds = [];

    // Update dashboard
    updateAdminDashboard();
    alert('Poll data has been reset successfully!');
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

      // Update the icon display
      const iconImg = document.getElementById(`icon${allianceId}`);
      if (iconImg) {
        iconImg.src = e.target.result;
        iconImg.style.display = 'block';
      }

      // Update voting page icon if visible
      const votingIcon = document.getElementById(`votingIcon${allianceId}`);
      if (votingIcon) {
        votingIcon.src = e.target.result;
        votingIcon.style.display = 'block';
      }
    }
  };
  reader.readAsDataURL(file);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
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

  // Load existing icons
  appData.alliances.forEach(alliance => {
    if (alliance.icon) {
      const iconImg = document.getElementById(`icon${alliance.id}`);
      if (iconImg) {
        iconImg.src = alliance.icon;
        iconImg.style.display = 'block';
      }
    }
  });
});

// Auto-save data periodically (optional)
setInterval(() => {
  // Save to localStorage as backup
  try {
    localStorage.setItem('votingAppData', JSON.stringify(appData));
  } catch (e) {
    console.warn('Could not save to localStorage');
  }
}, 30000); // Save every 30 seconds

// Load data on startup
window.addEventListener('load', () => {
  try {
    const savedData = localStorage.getItem('votingAppData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Only restore if data structure matches
      if (parsed.alliances && parsed.alliances.length === 3) {
        appData = { ...appData, ...parsed };
        // Restore icons
        appData.alliances.forEach(alliance => {
          if (alliance.icon) {
            const iconImg = document.getElementById(`icon${alliance.id}`);
            if (iconImg) {
              iconImg.src = alliance.icon;
              iconImg.style.display = 'block';
            }
          }
        });
      }
    }
  } catch (e) {
    console.warn('Could not load saved data');
  }
});