

const form = document.querySelector('#checkInForm');
const  nameInput = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');

// Track attendance
let count = 0;
const maxCount = 50;
let attendees = [];
let teamCounts = { water: 0, zero: 0, power: 0 };
let goalReached = false;

// Load saved data from localStorage
function loadData() {
    const savedCount = localStorage.getItem('attendeeCount');
    const savedAttendees = localStorage.getItem('attendees');
    const savedTeamCounts = localStorage.getItem('teamCounts');
    const savedGoalReached = localStorage.getItem('goalReached');

    if (savedCount) {
        count = parseInt(savedCount);
        document.getElementById('attendeeCount').textContent = count;

        // Update progress bar
        const percentage = Math.round((count / maxCount) * 100) + "%";
        document.getElementById('progressBar').style.width = percentage;
    }

    if (savedAttendees) {
        attendees = JSON.parse(savedAttendees);
        displayAttendeeList();
    }

    if (savedTeamCounts) {
        teamCounts = JSON.parse(savedTeamCounts);
        document.getElementById('waterCount').textContent = teamCounts.water;
        document.getElementById('zeroCount').textContent = teamCounts.zero;
        document.getElementById('powerCount').textContent = teamCounts.power;
    }

    if (savedGoalReached === 'true') {
        goalReached = true;
        // Re-display celebration if goal was already reached
        celebrateGoalReached();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('attendeeCount', count);
    localStorage.setItem('attendees', JSON.stringify(attendees));
    localStorage.setItem('teamCounts', JSON.stringify(teamCounts));
    localStorage.setItem('goalReached', goalReached);
}

// Display attendee list
function displayAttendeeList() {
    const listContainer = document.getElementById('attendeeList');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    attendees.forEach(attendee => {
        const listItem = document.createElement('div');
        listItem.className = 'attendee-item';
        listItem.innerHTML = `
            <span class="attendee-name">${attendee.name}</span>
            <span class="attendee-team ${attendee.team}">${attendee.teamName}</span>
        `;
        listContainer.appendChild(listItem);
    });
}

// Celebration when goal is reached
function celebrateGoalReached() {
    const teamNames = {
        water: 'Team Water Wise 🌊',
        zero: 'Team Net Zero 🌿',
        power: 'Team Renewables ⚡'
    };

    // Find winning team
    const winningTeam = Object.keys(teamCounts).reduce((a, b) =>
        teamCounts[a] > teamCounts[b] ? a : b
    );

    // Show celebration message
    const greetingElement = document.getElementById('greeting');
    greetingElement.innerHTML = `
        🎉 GOAL REACHED! 🎉<br>
        Congratulations to ${teamNames[winningTeam]} for leading the way!<br>
        Total Attendees: ${count}/${maxCount}
    `;
    greetingElement.style.fontSize = '1.3em';
    greetingElement.style.color = '#0071c5';
    greetingElement.style.background = 'linear-gradient(135deg, #fff7ed, #fef3c7)';
    greetingElement.style.border = '2px solid #f59e0b';
    greetingElement.style.padding = '20px';
    greetingElement.style.fontWeight = '600';

    // Highlight winning team card
    const teamCard = document.querySelector(`.team-card.${winningTeam}`);
    if (teamCard) {
        teamCard.style.border = '3px solid gold';
        teamCard.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
    }
}

// Check if form should be disabled based on capacity
function checkCapacity() {
    if (count >= maxCount) {
        nameInput.disabled = true;
        teamSelect.disabled = true;
        const checkInBtn = document.getElementById('checkInBtn');
        checkInBtn.disabled = true;
        checkInBtn.style.opacity = '0.5';
        checkInBtn.style.cursor = 'not-allowed';
        checkInBtn.innerHTML = '<i class="fas fa-lock"></i> Event Full';
    }
}

// Load data on page load
loadData();

// Check capacity on page load
checkCapacity();

// form submission
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Check if already at capacity
    if (count >= maxCount) {
        alert('⚠️ Event is at full capacity!\n\nNo more attendees can check in at this time.');
        return;
    }

    //get form values
    const name = nameInput.value;
    const team = teamSelect.value;
    const teamName = teamSelect.selectedOptions[0].text;

    console.log(name, teamName);

    //increment count
    count++;
    console.log("Total check-ins: ", count);

    // Update attendance count display
    const attendeeCountElement = document.getElementById('attendeeCount');
    attendeeCountElement.textContent = count;

    // Add to attendee list
    attendees.push({ name, team, teamName });
    displayAttendeeList();

    //update progress bar
    const percentage = Math.round((count / maxCount) * 100) + "%";
    console.log(`Progress:  ${percentage}`);

    // Update progress bar visual
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percentage;

    //team counter
    teamCounts[team]++;
    const teamCounter = document.getElementById(team + 'Count');
    teamCounter.textContent = teamCounts[team];


    //welcome message
    const message = `Welcome, ${name} from ${teamName}!`;
    console.log(message);
    const greetingElement = document.getElementById('greeting');

    // Check if goal is reached BEFORE setting welcome message
    if (count >= maxCount && !goalReached) {
        goalReached = true;
        celebrateGoalReached();
    } else {
        // Only show regular welcome if goal hasn't been reached
        greetingElement.textContent = message;
    }

    // Save data to localStorage
    saveData();

    // Check and disable form if at capacity
    checkCapacity();

    form.reset();
});

// Reset button functionality
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
    resetBtn.addEventListener('click', function() {
        if (confirm('⚠️ Are you sure you want to reset all check-in data?\n\nThis will clear:\n• All attendee records\n• Team counts\n• Progress tracking\n\nThis action cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    });
}

