// ===========================
// QUANTUM LEAP - APP LOGIC
// ===========================

// State Management with Local Storage
const AppState = {
    currentScreen: 'home',
    currentTab: {
        plan: 'quarters',
        visibility: 'essays'
    },
    data: loadData() || getDefaultData()
};

function getDefaultData() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    
    // Determine current quarter based on month
    let currentQuarter;
    if (currentMonth >= 0 && currentMonth <= 2) currentQuarter = 'q1';
    else if (currentMonth >= 3 && currentMonth <= 5) currentQuarter = 'q2';
    else if (currentMonth >= 6 && currentMonth <= 8) currentQuarter = 'q3';
    else currentQuarter = 'q4';
    
    return {
        year: currentYear,
        currentQuarter: currentQuarter,
        weeks: [],
        essays: [],
        visibilityActions: [],
        cycles: [],
        activeCycleId: null,
        quarters: {
            q1: {
                name: 'Q1',
                archetype: 'The Authority',
                identityStatement: 'I am the authority who leads with clarity and conviction. I build foundations that others trust.',
                constraint: 'Fear of being seen as an imposter',
                newBehaviors: ['Share expertise publicly', 'Say no to misaligned opportunities', 'Lead with confidence'],
                visibilityTheme: 'Establishing foundational authority',
                isComplete: currentMonth > 2
            },
            q2: {
                name: 'Q2',
                archetype: 'The Strategist',
                identityStatement: 'I am the architect of scalable authority. I build systems that compound visibility without depleting energy.',
                constraint: 'Perfectionism that delays publishing',
                newBehaviors: ['Ship weekly, refine later', 'Voice over polish', 'Visibility = generosity'],
                visibilityTheme: 'Thought leadership through authoritative essays',
                isComplete: currentMonth > 5
            },
            q3: {
                name: 'Q3',
                archetype: 'The Sovereign',
                identityStatement: 'I am the sovereign who claims my space unapologetically. I lead from wholeness, not hustle.',
                constraint: 'Burnout from overextension',
                newBehaviors: ['Rest as power move', 'Delegate with trust', 'Protect energy boundaries'],
                visibilityTheme: 'Sustainable leadership presence',
                isComplete: currentMonth > 8
            },
            q4: {
                name: 'Q4',
                archetype: 'The Majesty',
                identityStatement: 'I am the majesty who embodies mastery. I celebrate growth and claim my evolution.',
                constraint: 'Dismissing progress and achievements',
                newBehaviors: ['Celebrate wins publicly', 'Reflect without judgment', 'Integrate lessons'],
                visibilityTheme: 'Reflective authority and integration',
                isComplete: false
            }
        },
        currentEnergy: 3,
        completedToday: false,
        todayDate: now.toDateString(),
        priorityComplete: false,
        microActionComplete: false,
        practiceComplete: false,
        weekScore: 8.5,
        sprintProgress: 67,
        recoveryStreak: 12,
        dailyPriority: 'Finalize and publish Q2 essay draft',
        dailyAnchor: 'I move with authority and trust my decisions',
        visibilityMicroAction: 'Share one insight from essay on LinkedIn'
    };
}

// Local Storage Functions
function saveData() {
    localStorage.setItem('quantumLeapData', JSON.stringify(AppState.data));
}

function loadData() {
    const saved = localStorage.getItem('quantumLeapData');
    if (saved) {
        const data = JSON.parse(saved);
        // Reset daily items if it's a new day
        const today = new Date().toDateString();
        if (data.todayDate !== today) {
            data.todayDate = today;
            data.completedToday = false;
            data.priorityComplete = false;
            data.microActionComplete = false;
            data.practiceComplete = false;
        }
        return data;
    }
    return null;
}

// DOM Elements
let screenContainer;
let navItems;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    screenContainer = document.getElementById('screen-container');
    navItems = document.querySelectorAll('.nav-item');
    
    // Setup Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const screen = item.getAttribute('data-screen');
            navigateToScreen(screen);
        });
    });
    
    // Load initial screen
    navigateToScreen('home');
    
    // Setup Today's Date
    updateTodayDate();
});

// Navigation
function navigateToScreen(screenName) {
    AppState.currentScreen = screenName;
    
    // Update nav active state
    navItems.forEach(item => {
        if (item.getAttribute('data-screen') === screenName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Load screen content
    loadScreen(screenName);
}

function loadScreen(screenName) {
    const template = document.getElementById(`${screenName}-screen`);
    if (!template) return;
    
    const content = template.content.cloneNode(true);
    screenContainer.innerHTML = '';
    screenContainer.appendChild(content);
    
    // Update dynamic content
    updateDynamicContent(screenName);
    
    // Setup screen-specific interactions
    setupScreenInteractions(screenName);
}

function updateDynamicContent(screenName) {
    if (screenName === 'home') {
        updateHomeScreen();
    } else if (screenName === 'plan') {
        updatePlanScreen();
    } else if (screenName === 'today') {
        updateTodayScreenContent();
    } else if (screenName === 'visibility') {
        setTimeout(() => renderVisibilityLog(), 10);
    }
}

function updateTodayScreenContent() {
    setTimeout(() => {
        const priorityText = document.getElementById('priority-text');
        const microText = document.getElementById('micro-text');
        
        if (priorityText) {
            priorityText.textContent = AppState.data.dailyPriority || 'Click Edit to set priority';
            priorityText.style.opacity = AppState.data.dailyPriority ? '1' : '0.5';
        }
        
        if (microText) {
            microText.textContent = AppState.data.visibilityMicroAction || 'Click Edit to set action';
            microText.style.opacity = AppState.data.visibilityMicroAction ? '1' : '0.5';
        }
    }, 10);
}

function updateHomeScreen() {
    const currentQ = AppState.data.quarters[AppState.data.currentQuarter];
    
    // Update identity card
    const badge = document.querySelector('.identity-badge');
    const archetype = document.querySelector('.identity-archetype');
    const statement = document.querySelector('.identity-statement');
    
    if (badge) badge.textContent = `${currentQ.name} ${AppState.data.year}`;
    if (archetype) archetype.textContent = currentQ.archetype.toUpperCase();
    if (statement) statement.textContent = currentQ.identityStatement;
    
    // Update sprint card with actual active sprint
    updateHomeSprintCard();
    
    // Update weekly score card
    updateHomeWeeklyScore();
}

function updateHomeSprintCard() {
    const sprintCard = document.querySelector('.sprint-card');
    if (!sprintCard) return;
    
    const activeCycle = AppState.data.cycles?.find(c => c.id === AppState.data.activeCycleId);
    
    if (!activeCycle) {
        // No active sprint - show empty state
        sprintCard.innerHTML = `
            <h3 class="card-title">CURRENT 12-WEEK SPRINT</h3>
            <p style="color: #718096; text-align: center; padding: 24px 0;">No active sprint set</p>
            <button class="btn btn-secondary" onclick="navigateTo('plan'); setTimeout(() => switchPlanTab('cycles'), 100)">Create Sprint</button>
        `;
    } else {
        // Calculate progress
        const startDate = new Date(activeCycle.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (12 * 7));
        
        const now = new Date();
        const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
        const daysPassed = Math.max(0, (now - startDate) / (1000 * 60 * 60 * 24));
        const progress = Math.min(100, Math.round((daysPassed / totalDays) * 100));
        const weekInSprint = Math.min(12, Math.ceil(daysPassed / 7));
        
        sprintCard.innerHTML = `
            <h3 class="card-title">CURRENT 12-WEEK SPRINT</h3>
            <p class="sprint-name">${activeCycle.title}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <p class="progress-text">Week ${weekInSprint} of 12 — ${progress}% Complete</p>
        `;
    }
}

function updateHomeWeeklyScore() {
    const scoreCard = document.querySelector('.score-card');
    if (!scoreCard) return;
    
    const score = AppState.data.weekScore;
    const scoreNumber = scoreCard.querySelector('.score-number');
    const scoreDetail = scoreCard.querySelector('.score-detail');
    
    if (scoreNumber) {
        scoreNumber.textContent = score > 0 ? score : '-';
    }
    
    if (scoreDetail) {
        if (score > 0) {
            const weeksWith7Plus = AppState.data.weeks?.filter(w => w.score >= 7).length || 0;
            if (weeksWith7Plus > 1) {
                scoreDetail.textContent = `🔥 ${weeksWith7Plus} week streak (score ≥7)`;
            } else {
                scoreDetail.textContent = score >= 7 ? '🎉 Great week!' : 'Keep going!';
            }
        } else {
            scoreDetail.textContent = 'Score your week in Plan → Weeks';
        }
    }
}

function updatePlanScreen() {
    const quartersTab = document.getElementById('quarters-tab');
    if (quartersTab) {
        // Update year in title
        const sectionTitle = quartersTab.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.textContent = `${AppState.data.year} IDENTITY ROADMAP`;
        }
        
        // Clear and rebuild quarter cards
        const quarterCards = quartersTab.querySelectorAll('.quarter-card');
        
        Object.keys(AppState.data.quarters).forEach((qKey, index) => {
            const quarter = AppState.data.quarters[qKey];
            const card = quarterCards[index];
            
            if (card) {
                const h3 = card.querySelector('h3');
                const dates = card.querySelector('.quarter-dates');
                const badge = card.querySelector('.status-badge');
                
                if (h3) h3.textContent = `${quarter.name}: ${quarter.archetype.toUpperCase()}`;
                
                // Determine status
                let status = 'Upcoming';
                let statusClass = '';
                let statusSymbol = '○';
                
                if (qKey === AppState.data.currentQuarter) {
                    status = 'Current';
                    statusClass = 'current';
                    statusSymbol = '◉';
                    card.classList.add('current');
                    card.classList.remove('completed');
                } else if (quarter.isComplete) {
                    status = 'Completed';
                    statusClass = 'completed';
                    statusSymbol = '✓';
                    card.classList.add('completed');
                    card.classList.remove('current');
                } else {
                    card.classList.remove('current', 'completed');
                }
                
                if (dates) {
                    const months = {
                        q1: 'Jan-Mar',
                        q2: 'Apr-Jun',
                        q3: 'Jul-Sep',
                        q4: 'Oct-Dec'
                    };
                    dates.textContent = `${months[qKey]} • ${status}`;
                }
                
                if (badge) {
                    badge.textContent = statusSymbol;
                    badge.className = `status-badge ${statusClass}`;
                }
                
                // Update onclick to pass correct quarter
                card.onclick = () => showQuarterDetail(qKey);
            }
        });
    }
    
    // Update weeks tab with real dates
    const weeksTab = document.getElementById('weeks-tab');
    if (weeksTab) {
        updateWeeksTab();
    }
    
    // Update cycles tab
    const cyclesTab = document.getElementById('cycles-tab');
    if (cyclesTab) {
        updateCyclesTab();
    }
}

function updateWeeksTab() {
    const weeksTab = document.getElementById('weeks-tab');
    if (!weeksTab) return;
    
    // Calculate current week
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysSinceStart = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);
    
    // Get week date range
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday
    
    const formatDate = (d) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}`;
    };
    
    const weekRange = `${formatDate(weekStart)}-${formatDate(weekEnd)}`;
    
    // Update section title
    const sectionTitle = weeksTab.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.textContent = `WEEK ${weekNumber} • ${weekRange}, ${now.getFullYear()}`;
    }
    
    // Clear existing content
    weeksTab.innerHTML = `
        <h2 class="section-title">WEEK ${weekNumber} • ${weekRange}, ${now.getFullYear()}</h2>
        
        <div class="card">
            <h3 class="card-title">THIS WEEK <button class="edit-btn" onclick="editWeekOutcomes()">✏️ Edit</button></h3>
            <p id="week-outcomes-text" style="white-space: pre-line; color: #4A5568; line-height: 1.6;">
                ${AppState.data.weekOutcomes || 'Click Edit to set this week\'s outcomes'}
            </p>
        </div>
        
        <div class="card score-card">
            <h3 class="card-title">WEEK SCORE <button class="edit-btn" onclick="editWeekScore()">✏️ Edit</button></h3>
            <div class="score-display">
                <span class="score-number">${AppState.data.weekScore || '0'}</span>
                <span class="score-total">/ 10</span>
            </div>
        </div>
        
        <div class="card">
            <h3 class="card-title">REFLECTION <button class="edit-btn" onclick="editWeekReflection()">✏️ Edit</button></h3>
            <p id="week-reflection-text" style="font-style: italic; color: #1A202C; line-height: 1.6;">
                ${AppState.data.weekReflection || 'Click Edit to add your weekly reflection'}
            </p>
        </div>
        
        <button class="btn btn-primary" onclick="completeWeek()">✓ Complete This Week</button>
        
        ${renderPastWeeks()}
    `;
}

function renderPastWeeks() {
    if (!AppState.data.weeks || AppState.data.weeks.length === 0) {
        return '<p style="text-align: center; color: #718096; margin-top: 32px;">No past weeks logged yet</p>';
    }
    
    const pastWeeksHTML = AppState.data.weeks
        .sort((a, b) => b.weekNumber - a.weekNumber)
        .map(week => `
            <div class="card week-history-card" style="margin-top: 16px; opacity: 0.85;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="margin: 0; font-size: 14px; font-weight: 600;">Week ${week.weekNumber} • ${week.dateRange}</h3>
                    <span style="font-size: 20px; font-weight: 700; color: ${week.score >= 7 ? '#38A169' : '#DD6B20'};">${week.score}/10</span>
                </div>
                ${week.outcomes ? `<p style="font-size: 13px; color: #4A5568; margin: 8px 0;">${week.outcomes}</p>` : ''}
                ${week.reflection ? `<p style="font-size: 13px; font-style: italic; color: #718096; margin-top: 8px;">"${week.reflection}"</p>` : ''}
            </div>
        `).join('');
    
    return `
        <div style="margin-top: 32px;">
            <h3 style="font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #4A5568; margin-bottom: 16px; text-transform: uppercase;">PAST WEEKS</h3>
            ${pastWeeksHTML}
        </div>
    `;
}

window.editWeekOutcomes = function() {
    const text = prompt('What are your top outcomes for this week?', AppState.data.weekOutcomes || '');
    if (text !== null) {
        AppState.data.weekOutcomes = text;
        saveData();
        updateWeeksTab();
        showToast('✓ Week outcomes updated');
    }
};

window.editWeekScore = function() {
    const score = prompt('Score this week (0-10):', AppState.data.weekScore || '0');
    if (score !== null) {
        const num = parseFloat(score);
        if (!isNaN(num) && num >= 0 && num <= 10) {
            AppState.data.weekScore = num;
            saveData();
            updateWeeksTab();
            showToast(`✓ Week scored: ${num}/10`);
        } else {
            showToast('⚠️ Please enter a number between 0 and 10');
        }
    }
};

window.editWeekReflection = function() {
    const text = prompt('Weekly reflection - what worked? What didn\'t?', AppState.data.weekReflection || '');
    if (text !== null) {
        AppState.data.weekReflection = text;
        saveData();
        updateWeeksTab();
        showToast('✓ Reflection saved');
    }
};

window.completeWeek = function() {
    if (!AppState.data.weekOutcomes || !AppState.data.weekScore) {
        showToast('⚠️ Please set outcomes and score before completing');
        return;
    }
    
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysSinceStart = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const formatDate = (d) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}`;
    };
    
    const weekData = {
        weekNumber: weekNumber,
        dateRange: `${formatDate(weekStart)}-${formatDate(weekEnd)}`,
        outcomes: AppState.data.weekOutcomes,
        score: AppState.data.weekScore,
        reflection: AppState.data.weekReflection,
        completedAt: new Date().toISOString()
    };
    
    if (!AppState.data.weeks) AppState.data.weeks = [];
    
    // Check if week already completed
    const existingIndex = AppState.data.weeks.findIndex(w => w.weekNumber === weekNumber);
    if (existingIndex >= 0) {
        AppState.data.weeks[existingIndex] = weekData;
    } else {
        AppState.data.weeks.push(weekData);
    }
    
    // Clear current week data for next week
    AppState.data.weekOutcomes = '';
    AppState.data.weekScore = 0;
    AppState.data.weekReflection = '';
    
    saveData();
    updateWeeksTab();
    showToast('✨ Week completed! Ready for next week.', 2000);
}

// Screen-Specific Setup
function setupScreenInteractions(screenName) {
    switch(screenName) {
        case 'today':
            setupTodayScreen();
            break;
        case 'plan':
            setupPlanScreen();
            break;
        case 'visibility':
            setupVisibilityScreen();
            break;
        case 'recovery':
            setupRecoveryScreen();
            break;
    }
}

// TODAY SCREEN
function setupTodayScreen() {
    // Priority checkbox - restore state
    const priorityCheck = document.getElementById('priority-check');
    if (priorityCheck) {
        priorityCheck.checked = AppState.data.priorityComplete;
        priorityCheck.addEventListener('change', (e) => {
            AppState.data.priorityComplete = e.target.checked;
            saveData();
            if (e.target.checked) {
                showToast('✨ Primary action complete!');
            }
        });
    }
    
    // Render daily calendar
    renderDailyCalendar();
    
    // Complete day button - restore state
    const completeBtn = document.getElementById('complete-day-btn');
    if (completeBtn) {
        if (AppState.data.completedToday) {
            completeBtn.textContent = '✓ Day Complete';
            completeBtn.style.background = '#D946A6';
        }
        completeBtn.addEventListener('click', () => {
            completeDay();
        });
    }
}

function renderDailyCalendar() {
    const calendarContainer = document.getElementById('daily-calendar');
    if (!calendarContainer) return;
    
    // Initialize daily logs if not exists
    if (!AppState.data.dailyLogs) AppState.data.dailyLogs = [];
    
    // Get current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    let calendarHTML = `
        <div style="text-align: center; margin-bottom: 16px;">
            <h4 style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${monthNames[month]} ${year}</h4>
        </div>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">
            ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<div style="text-align: center; font-size: 11px; font-weight: 600; color: var(--text-secondary); padding: 8px 0;">${d}</div>`).join('')}
    `;
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div></div>';
    }
    
    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayLog = AppState.data.dailyLogs.find(log => log.date === dateStr);
        const isToday = day === today;
        const hasLog = dayLog && dayLog.completed;
        
        let dayStyle = 'text-align: center; padding: 8px; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 2px;';
        
        if (isToday) {
            dayStyle += 'background: var(--primary-gradient); color: white; font-weight: 700;';
        } else if (hasLog) {
            dayStyle += 'color: var(--primary-color); font-weight: 600;';
        } else {
            dayStyle += 'color: var(--text-secondary);';
        }
        
        // Show sparkle for completed days
        if (hasLog) {
            calendarHTML += `<div style="${dayStyle}" onclick="showDayDetail('${dateStr}')">
                <span>${day}</span>
                <span style="font-size: 12px;">✨</span>
            </div>`;
        } else {
            calendarHTML += `<div style="${dayStyle}" onclick="showDayDetail('${dateStr}')">${day}</div>`;
        }
    }
    
    calendarHTML += '</div>';
    
    calendarContainer.innerHTML = calendarHTML;
}

window.showDayDetail = function(dateStr) {
    if (!AppState.data.dailyLogs) AppState.data.dailyLogs = [];
    
    const dayLog = AppState.data.dailyLogs.find(log => log.date === dateStr);
    const date = new Date(dateStr);
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const dateDisplay = date.toLocaleDateString('en-US', options);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${dateDisplay}</h2>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                ${dayLog ? `
                    <div class="detail-section">
                        <h3>STATUS</h3>
                        <p style="color: var(--success); font-weight: 600;">✓ Day Completed</p>
                    </div>
                    ${dayLog.priority ? `
                        <div class="detail-section">
                            <h3>TOP PRIORITY</h3>
                            <p>${dayLog.priority}</p>
                        </div>
                    ` : ''}
                    ${dayLog.microAction ? `
                        <div class="detail-section">
                            <h3>MICRO-ACTION</h3>
                            <p>${dayLog.microAction}</p>
                        </div>
                    ` : ''}
                    <div class="detail-section">
                        <h3>ENERGY</h3>
                        <p>${dayLog.energy || 3}/5</p>
                    </div>
                ` : `
                    <p style="text-align: center; color: var(--text-light); padding: 24px 0;">No log for this day yet</p>
                `}
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

function completeDay() {
    AppState.data.completedToday = true;
    
    // Save daily log
    if (!AppState.data.dailyLogs) AppState.data.dailyLogs = [];
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // Check if log already exists for today
    const existingIndex = AppState.data.dailyLogs.findIndex(log => log.date === dateStr);
    
    const dayLog = {
        date: dateStr,
        completed: true,
        priority: AppState.data.dailyPriority,
        microAction: AppState.data.visibilityMicroAction,
        energy: AppState.data.currentEnergy,
        priorityComplete: AppState.data.priorityComplete,
        microActionComplete: AppState.data.microActionComplete
    };
    
    if (existingIndex >= 0) {
        AppState.data.dailyLogs[existingIndex] = dayLog;
    } else {
        AppState.data.dailyLogs.push(dayLog);
    }
    
    saveData();
    showToast('✨ Day completed! See you tomorrow.', 2000);
    
    // Add celebration effect
    const btn = document.getElementById('complete-day-btn');
    if (btn) {
        btn.textContent = '✓ Day Complete';
        btn.style.background = '#D946A6';
    }
    
    // Refresh calendar
    renderDailyCalendar();
}

// PLAN SCREEN
function setupPlanScreen() {
    const subNavItems = document.querySelectorAll('.plan-screen .sub-nav-item');
    
    subNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const tab = item.getAttribute('data-tab');
            switchPlanTab(tab);
        });
    });
}

function switchPlanTab(tabName) {
    AppState.currentTab.plan = tabName;
    
    // Update sub-nav
    const subNavItems = document.querySelectorAll('.plan-screen .sub-nav-item');
    subNavItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Show/hide tabs
    const tabs = document.querySelectorAll('.plan-screen .tab-content');
    tabs.forEach(tab => {
        if (tab.id === `${tabName}-tab`) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// VISIBILITY SCREEN
function setupVisibilityScreen() {
    const subNavItems = document.querySelectorAll('.visibility-screen .sub-nav-item');
    
    subNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const tab = item.getAttribute('data-tab');
            switchVisibilityTab(tab);
        });
    });
}

function switchVisibilityTab(tabName) {
    AppState.currentTab.visibility = tabName;
    
    // Update sub-nav
    const subNavItems = document.querySelectorAll('.visibility-screen .sub-nav-item');
    subNavItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Show/hide tabs
    const tabs = document.querySelectorAll('.visibility-screen .tab-content');
    tabs.forEach(tab => {
        if (tab.id === `${tabName}-tab`) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// RECOVERY SCREEN
function setupRecoveryScreen() {
    // Emotional state buttons - restore state
    const stateBtns = document.querySelectorAll('.recovery-screen .energy-btn');
    const emotionalState = AppState.data.emotionalState || 3;
    stateBtns.forEach(btn => {
        if (parseInt(btn.getAttribute('data-value')) === emotionalState) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', (e) => {
            stateBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.data.emotionalState = parseInt(btn.getAttribute('data-value'));
            saveData();
            showToast(`Groundedness: ${AppState.data.emotionalState}/5`);
        });
    });
    
    // Reflection notes textarea - just clear it for new entry
    const reflectionInput = document.getElementById('reflection-notes');
    if (reflectionInput) {
        reflectionInput.value = '';
    }
    
    // Render reflection log
    renderReflectionLog();
    
    // Update streak display
    updateRecoveryStreak();
}

// Save reflection to log
window.saveReflection = function() {
    const notes = document.getElementById('reflection-notes').value;
    if (!notes || notes.trim().length === 0) {
        showToast('⚠️ Write something first');
        return;
    }
    
    if (!AppState.data.reflectionLog) AppState.data.reflectionLog = [];
    
    const reflection = {
        id: Date.now(),
        notes: notes,
        emotionalState: AppState.data.emotionalState || 3,
        date: new Date().toISOString()
    };
    
    AppState.data.reflectionLog.push(reflection);
    saveData();
    
    // Clear textarea
    document.getElementById('reflection-notes').value = '';
    
    // Refresh log
    renderReflectionLog();
    
    showToast('✨ Reflection saved!');
};

// Render reflection log
function renderReflectionLog() {
    const container = document.getElementById('reflection-log-container');
    if (!container) return;
    
    if (!AppState.data.reflectionLog || AppState.data.reflectionLog.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 16px 0;">No reflections saved yet.</p>';
        return;
    }
    
    // Sort by date, most recent first
    const sortedReflections = [...AppState.data.reflectionLog].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    const reflectionsHTML = sortedReflections.map(reflection => {
        const date = new Date(reflection.date);
        const dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
        
        // Truncate notes for preview
        const preview = reflection.notes.length > 100 
            ? reflection.notes.substring(0, 100) + '...' 
            : reflection.notes;
        
        return `
            <div class="reflection-item" onclick="showReflectionDetail('${reflection.id}')" style="cursor: pointer; padding: 12px; border-bottom: 1px solid var(--border-color); transition: background 0.2s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <p style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">${dateStr}</p>
                    <span style="font-size: 12px; color: var(--text-light);">Groundedness: ${reflection.emotionalState}/5</span>
                </div>
                <p style="font-size: 14px; color: var(--text-primary); line-height: 1.5;">${preview}</p>
            </div>
        `;
    }).join('');
    
    container.innerHTML = reflectionsHTML;
    
    // Add hover effect via CSS
    const style = document.createElement('style');
    style.textContent = `
        .reflection-item:hover {
            background: rgba(233, 30, 140, 0.05);
        }
    `;
    if (!document.getElementById('reflection-hover-style')) {
        style.id = 'reflection-hover-style';
        document.head.appendChild(style);
    }
}

// Show reflection detail modal
window.showReflectionDetail = function(reflectionId) {
    const reflection = AppState.data.reflectionLog.find(r => r.id == reflectionId);
    if (!reflection) return;
    
    const date = new Date(reflection.date);
    const dateDisplay = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Recovery Reflection</h2>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h3>DATE</h3>
                    <p>${dateDisplay}</p>
                </div>
                
                <div class="detail-section">
                    <h3>EMOTIONAL STATE</h3>
                    <p>Groundedness: ${reflection.emotionalState}/5</p>
                </div>
                
                <div class="detail-section">
                    <h3>REFLECTION</h3>
                    <p style="white-space: pre-wrap; line-height: 1.6;">${reflection.notes}</p>
                </div>
                
                <button class="btn btn-secondary" onclick="deleteReflection('${reflection.id}')">Delete Reflection</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.deleteReflection = function(reflectionId) {
    if (!confirm('Delete this reflection?')) return;
    
    AppState.data.reflectionLog = AppState.data.reflectionLog.filter(r => r.id != reflectionId);
    saveData();
    closeModal();
    renderReflectionLog();
    showToast('Reflection deleted');
};

function updateRecoveryStreak() {
    const streakText = document.querySelector('.streak-text strong');
    if (streakText) {
        streakText.textContent = `${AppState.data.recoveryStreak} days`;
    }
}

// Utility Functions
function updateTodayDate() {
    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);
    
    // This will be set when Today screen loads
    setTimeout(() => {
        const dateElement = document.getElementById('today-date');
        if (dateElement) {
            dateElement.textContent = dateString;
        }
    }, 100);
}

function showToast(message, duration = 1500) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Style toast
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1A202C',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '1000',
        maxWidth: '90%',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        animation: 'toastIn 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // Remove after duration
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes toastIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes toastOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// Global navigation function (for inline onclick handlers)
window.navigateTo = function(screen) {
    navigateToScreen(screen);
};

// Quarter Detail Modal
window.showQuarterDetail = function(quarterId) {
    const quarter = AppState.data.quarters[quarterId];
    if (!quarter) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${quarter.name}: ${quarter.archetype}</h2>
                <button class="modal-close" onclick="closeQuarterModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h3>IDENTITY DECLARATION</h3>
                    <p class="identity-text">${quarter.identityStatement}</p>
                </div>
                
                <div class="detail-section">
                    <h3>CONSTRAINT DISSOLVING</h3>
                    <p class="constraint-text">${quarter.constraint}</p>
                </div>
                
                <div class="detail-section">
                    <h3>NEW BEHAVIOR STANDARDS</h3>
                    <ul class="behavior-list">
                        ${quarter.newBehaviors.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h3>BIG PICTURE THEME</h3>
                    <p class="theme-text">${quarter.visibilityTheme || quarter.theme || 'Your quarterly focus'}</p>
                </div>
                
                ${quarterId === AppState.data.currentQuarter ? 
                    '<button class="btn btn-primary" onclick="closeQuarterModal()">Current Quarter</button>' :
                    `<button class="btn btn-secondary" onclick="setCurrentQuarter('${quarterId}')">Set as Current Quarter</button>`
                }
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeQuarterModal();
        }
    });
};

window.closeQuarterModal = function() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
};

window.setCurrentQuarter = function(quarterId) {
    AppState.data.currentQuarter = quarterId;
    saveData();
    closeQuarterModal();
    showToast(`✨ Set ${quarterId.toUpperCase()} as current quarter`);
    
    // Refresh current screen
    if (AppState.currentScreen === 'home') {
        navigateToScreen('home');
    } else if (AppState.currentScreen === 'plan') {
        navigateToScreen('plan');
    }
};

// Add essay form
window.showEssayForm = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>New Essay</h2>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="essay-title" class="form-input" placeholder="Essay title...">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="essay-status" class="form-select">
                        <option value="idea">Idea</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="saveEssay()">Save</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.saveEssay = function() {
    const title = document.getElementById('essay-title').value;
    const status = document.getElementById('essay-status').value;
    if (!title) { showToast('⚠️ Enter title'); return; }
    
    if (!AppState.data.essays) AppState.data.essays = [];
    AppState.data.essays.push({
        id: Date.now(),
        title: title,
        status: status,
        date: new Date().toISOString()
    });
    saveData();
    closeModal();
    showToast('✨ Essay added!');
};

// Visibility Action Form with Fear/Confidence Tracking
window.showVisibilityForm = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Log Visibility Action</h2>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>What visibility action did you take?</label>
                    <input type="text" id="visibility-action-name" class="form-input" placeholder="e.g., Published LinkedIn post, Sent cold email, Hosted workshop">
                </div>
                
                <div class="form-group">
                    <label>Fear Level BEFORE (1-5)</label>
                    <p style="font-size: 12px; color: var(--text-light); margin: 4px 0 8px 0;">How much fear or resistance did you feel?</p>
                    <div class="energy-scale" id="fear-scale">
                        <button class="energy-btn" data-value="1">1</button>
                        <button class="energy-btn" data-value="2">2</button>
                        <button class="energy-btn" data-value="3">3</button>
                        <button class="energy-btn" data-value="4">4</button>
                        <button class="energy-btn" data-value="5">5</button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Confidence Level AFTER (1-5)</label>
                    <p style="font-size: 12px; color: var(--text-light); margin: 4px 0 8px 0;">How confident do you feel now?</p>
                    <div class="energy-scale" id="confidence-scale">
                        <button class="energy-btn" data-value="1">1</button>
                        <button class="energy-btn" data-value="2">2</button>
                        <button class="energy-btn" data-value="3">3</button>
                        <button class="energy-btn" data-value="4">4</button>
                        <button class="energy-btn" data-value="5">5</button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Outcome (optional)</label>
                    <textarea id="visibility-outcome" class="form-textarea" placeholder="What happened? How did people respond?"></textarea>
                </div>
                
                <button class="btn btn-primary" onclick="saveVisibilityAction()">Track Courage</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Setup scale interactions
    let fearLevel = 3;
    let confidenceLevel = 3;
    
    const fearBtns = document.querySelectorAll('#fear-scale .energy-btn');
    fearBtns.forEach(btn => {
        if (parseInt(btn.getAttribute('data-value')) === 3) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
            fearBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            fearLevel = parseInt(btn.getAttribute('data-value'));
        });
    });
    
    const confidenceBtns = document.querySelectorAll('#confidence-scale .energy-btn');
    confidenceBtns.forEach(btn => {
        if (parseInt(btn.getAttribute('data-value')) === 3) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
            confidenceBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            confidenceLevel = parseInt(btn.getAttribute('data-value'));
        });
    });
    
    // Store in modal for access by save function
    modal.fearLevel = fearLevel;
    modal.confidenceLevel = confidenceLevel;
    Object.defineProperty(modal, 'getFearLevel', {
        value: () => {
            const activeBtn = document.querySelector('#fear-scale .energy-btn.active');
            return activeBtn ? parseInt(activeBtn.getAttribute('data-value')) : 3;
        }
    });
    Object.defineProperty(modal, 'getConfidenceLevel', {
        value: () => {
            const activeBtn = document.querySelector('#confidence-scale .energy-btn.active');
            return activeBtn ? parseInt(activeBtn.getAttribute('data-value')) : 3;
        }
    });
};

window.saveVisibilityAction = function() {
    const name = document.getElementById('visibility-action-name').value;
    if (!name) { 
        showToast('⚠️ Enter visibility action'); 
        return; 
    }
    
    const modal = document.querySelector('.modal-overlay');
    const fearLevel = modal.getFearLevel();
    const confidenceLevel = modal.getConfidenceLevel();
    
    if (!AppState.data.visibilityActions) AppState.data.visibilityActions = [];
    
    const action = {
        id: Date.now(),
        name: name,
        fearBefore: fearLevel,
        confidenceAfter: confidenceLevel,
        outcome: document.getElementById('visibility-outcome').value,
        date: new Date().toISOString(),
        growth: confidenceLevel - fearLevel // Track emotional growth
    };
    
    AppState.data.visibilityActions.push(action);
    saveData();
    closeModal();
    
    // Refresh visibility screen if we're on it
    if (AppState.currentScreen === 'visibility') {
        renderVisibilityLog();
    }
    
    showToast('✨ Courage tracked!');
};

// Render visibility actions with emotional journey
function renderVisibilityLog() {
    const container = document.getElementById('visibility-log-container');
    if (!container) return;
    
    if (!AppState.data.visibilityActions || AppState.data.visibilityActions.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #C794BF; margin: 32px 0;">No visibility actions logged yet. Track your first courageous action!</p>';
        return;
    }
    
    // Sort by date, most recent first
    const sortedActions = [...AppState.data.visibilityActions].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    const actionsHTML = sortedActions.map(action => {
        const date = new Date(action.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        // Create dots for fear level
        const fearDots = Array.from({length: 5}, (_, i) => 
            `<span class="dot ${i < action.fearBefore ? 'filled' : ''}"></span>`
        ).join('');
        
        // Create dots for confidence level
        const confidenceDots = Array.from({length: 5}, (_, i) => 
            `<span class="dot ${i < action.confidenceAfter ? 'filled' : ''}"></span>`
        ).join('');
        
        // Determine growth message
        let growthMessage = '';
        if (action.growth > 0) {
            growthMessage = `<p class="growth-text">+${action.growth} courage growth 🌱</p>`;
        } else if (action.growth === 0) {
            growthMessage = `<p style="font-size: 13px; color: var(--text-secondary);">Maintained confidence</p>`;
        }
        
        return `
            <div class="visibility-item" onclick="showVisibilityDetail('${action.id}')">
                <div class="visibility-icon">📣</div>
                <div class="visibility-content">
                    <h4>${action.name}</h4>
                    <p class="visibility-date">${dateStr}</p>
                    
                    <div class="confidence-track">
                        <span class="confidence-label">Fear:</span>
                        <div class="dots">${fearDots}</div>
                        <span class="confidence-arrow">→</span>
                        <span class="confidence-label">Confidence:</span>
                        <div class="dots">${confidenceDots}</div>
                    </div>
                    
                    ${growthMessage}
                    
                    ${action.outcome ? `<p class="outcome-text">${action.outcome}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = actionsHTML;
}

// Show visibility action detail
window.showVisibilityDetail = function(actionId) {
    const action = AppState.data.visibilityActions.find(a => a.id == actionId);
    if (!action) return;
    
    const date = new Date(action.date);
    const dateDisplay = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Visibility Action</h2>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="detail-section">
                    <h3>ACTION</h3>
                    <p>${action.name}</p>
                </div>
                
                <div class="detail-section">
                    <h3>DATE</h3>
                    <p>${dateDisplay}</p>
                </div>
                
                <div class="detail-section">
                    <h3>EMOTIONAL JOURNEY</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                        <div style="text-align: center;">
                            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">FEAR BEFORE</p>
                            <p style="font-size: 32px; font-weight: 700; color: var(--warning);">${action.fearBefore}</p>
                        </div>
                        <span style="font-size: 24px; color: var(--text-light);">→</span>
                        <div style="text-align: center;">
                            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">CONFIDENCE AFTER</p>
                            <p style="font-size: 32px; font-weight: 700; color: var(--success);">${action.confidenceAfter}</p>
                        </div>
                    </div>
                    ${action.growth > 0 ? `<p class="growth-text" style="text-align: center; margin-top: 12px;">+${action.growth} courage growth 🌱</p>` : ''}
                </div>
                
                ${action.outcome ? `
                    <div class="detail-section">
                        <h3>OUTCOME</h3>
                        <p>${action.outcome}</p>
                    </div>
                ` : ''}
                
                <button class="btn btn-secondary" onclick="deleteVisibilityAction('${action.id}')">Delete Action</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.deleteVisibilityAction = function(actionId) {
    if (!confirm('Delete this visibility action?')) return;
    
    AppState.data.visibilityActions = AppState.data.visibilityActions.filter(a => a.id != actionId);
    saveData();
    closeModal();
    renderVisibilityLog();
    showToast('Action deleted');
};

// Keep old function name for backwards compatibility
window.showActionForm = showVisibilityForm;

window.closeModal = function() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
};

// Make priority editable
window.editPriority = function() {
    const text = prompt('Enter your top priority for today:', AppState.data.dailyPriority || '');
    if (text !== null) {
        AppState.data.dailyPriority = text;
        saveData();
        navigateToScreen('today');
        showToast('✓ Priority updated');
    }
};

// Make micro-action editable
window.editMicroAction = function() {
    const text = prompt('Enter visibility micro-action:', AppState.data.visibilityMicroAction || '');
    if (text !== null) {
        AppState.data.visibilityMicroAction = text;
        saveData();
        navigateToScreen('today');
        showToast('✓ Micro-action updated');
    }
};

// ===========================
// CYCLES (12-WEEK SPRINTS)
// ===========================

function updateCyclesTab() {
    const cyclesTab = document.getElementById('cycles-tab');
    if (!cyclesTab) return;
    
    if (!AppState.data.cycles) AppState.data.cycles = [];
    
    // Build cycles HTML
    let cyclesHTML = '<h2 class="section-title">12-WEEK SPRINTS</h2>';
    
    if (AppState.data.cycles.length === 0) {
        cyclesHTML += '<p style="text-align: center; color: #718096; margin: 32px 0;">No 12-week sprints yet. Create your first one!</p>';
    } else {
        AppState.data.cycles.forEach(cycle => {
            const isActive = cycle.id === AppState.data.activeCycleId;
            const currentQ = AppState.data.quarters[AppState.data.currentQuarter];
            
            // Calculate progress
            const startDate = new Date(cycle.startDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + (12 * 7)); // 12 weeks
            
            const now = new Date();
            const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
            const daysPassed = Math.max(0, (now - startDate) / (1000 * 60 * 60 * 24));
            const progress = Math.min(100, Math.round((daysPassed / totalDays) * 100));
            
            // Calculate current week in sprint
            const weekInSprint = Math.min(12, Math.ceil(daysPassed / 7));
            
            cyclesHTML += `
                <div class="cycle-card ${isActive ? 'active' : ''}" onclick="showCycleDetail('${cycle.id}')">
                    <h3>${cycle.title}</h3>
                    ${isActive ? `
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <p class="cycle-meta">Week ${weekInSprint} of 12 • ${currentQ.name} ${currentQ.archetype}</p>
                        <span class="status-badge active">ACTIVE</span>
                    ` : `
                        <p class="cycle-meta">${cycle.status || 'Planned'} • ${cycle.quarter || AppState.data.currentQuarter.toUpperCase()}</p>
                        <span class="status-badge">${cycle.status?.toUpperCase() || 'PLANNED'}</span>
                    `}
                </div>
            `;
        });
    }
    
    cyclesHTML += '<button class="btn btn-secondary" onclick="showCycleForm()">+ New 12-Week Sprint</button>';
    
    cyclesTab.innerHTML = cyclesHTML;
}

window.showCycleForm = function() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>New 12-Week Sprint</h2>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Sprint Title</label>
                    <input type="text" id="cycle-title" class="form-input" placeholder="e.g., Scale Authority Platform">
                </div>
                <div class="form-group">
                    <label>Primary Objective</label>
                    <textarea id="cycle-objective" class="form-textarea" placeholder="What's the main goal?"></textarea>
                </div>
                <div class="form-group">
                    <label>Success Metrics</label>
                    <textarea id="cycle-metrics" class="form-textarea" placeholder="How will you measure success?"></textarea>
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="date" id="cycle-start" class="form-input" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="cycle-set-active" style="width: auto; margin-right: 8px;">
                        Set as active sprint
                    </label>
                </div>
                <button class="btn btn-primary" onclick="saveCycle()">Create Sprint</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

window.saveCycle = function() {
    const title = document.getElementById('cycle-title').value;
    const objective = document.getElementById('cycle-objective').value;
    const metrics = document.getElementById('cycle-metrics').value;
    const startDate = document.getElementById('cycle-start').value;
    const setActive = document.getElementById('cycle-set-active').checked;
    
    if (!title) {
        showToast('⚠️ Enter sprint title');
        return;
    }
    
    if (!AppState.data.cycles) AppState.data.cycles = [];
    
    const cycle = {
        id: Date.now().toString(),
        title: title,
        objective: objective,
        metrics: metrics,
        startDate: startDate || new Date().toISOString().split('T')[0],
        status: setActive ? 'active' : 'planned',
        quarter: AppState.data.currentQuarter.toUpperCase(),
        createdAt: new Date().toISOString()
    };
    
    AppState.data.cycles.push(cycle);
    
    if (setActive) {
        AppState.data.activeCycleId = cycle.id;
    }
    
    saveData();
    closeModal();
    updateCyclesTab();
    showToast('✨ 12-week sprint created!');
};

window.showCycleDetail = function(cycleId) {
    const cycle = AppState.data.cycles.find(c => c.id === cycleId);
    if (!cycle) return;
    
    const isActive = cycle.id === AppState.data.activeCycleId;
    
    // Calculate dates
    const startDate = new Date(cycle.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (12 * 7));
    
    const formatDate = (d) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    };
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${cycle.title}</h2>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                ${isActive ? '<div class="status-badge active" style="display: inline-block; margin-bottom: 16px;">ACTIVE SPRINT</div>' : ''}
                
                <div class="detail-section">
                    <h3>DATES</h3>
                    <p>${formatDate(startDate)} → ${formatDate(endDate)}</p>
                </div>
                
                ${cycle.objective ? `
                    <div class="detail-section">
                        <h3>PRIMARY OBJECTIVE</h3>
                        <p>${cycle.objective}</p>
                    </div>
                ` : ''}
                
                ${cycle.metrics ? `
                    <div class="detail-section">
                        <h3>SUCCESS METRICS</h3>
                        <p style="white-space: pre-line;">${cycle.metrics}</p>
                    </div>
                ` : ''}
                
                <div style="display: flex; gap: 8px; margin-top: 24px;">
                    ${!isActive ? 
                        `<button class="btn btn-primary" onclick="setActiveCycle('${cycle.id}')">Set as Active</button>` :
                        `<button class="btn btn-secondary" onclick="closeModal()">Close</button>`
                    }
                    <button class="btn btn-secondary" onclick="deleteCycle('${cycle.id}')" style="background: #E53E3E;">Delete</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.setActiveCycle = function(cycleId) {
    AppState.data.activeCycleId = cycleId;
    
    // Update status
    AppState.data.cycles = AppState.data.cycles.map(c => ({
        ...c,
        status: c.id === cycleId ? 'active' : 'planned'
    }));
    
    saveData();
    closeModal();
    updateCyclesTab();
    showToast('✨ Active sprint updated!');
};

window.deleteCycle = function(cycleId) {
    if (!confirm('Delete this 12-week sprint?')) return;
    
    AppState.data.cycles = AppState.data.cycles.filter(c => c.id !== cycleId);
    
    if (AppState.data.activeCycleId === cycleId) {
        AppState.data.activeCycleId = null;
    }
    
    saveData();
    closeModal();
    updateCyclesTab();
    showToast('Sprint deleted');
};

// Add styles for forms
const formStyles = document.createElement('style');
formStyles.textContent = `
    .form-input, .form-textarea, .form-select, .form-range {
        width: 100%;
        padding: 12px;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        font-size: 15px;
        font-family: inherit;
        margin-top: 8px;
    }
    .form-input:focus, .form-textarea:focus, .form-select:focus {
        outline: none;
        border-color: #3182CE;
    }
    .form-textarea {
        min-height: 80px;
        resize: vertical;
    }
    .form-group {
        margin-bottom: 20px;
    }
    .form-group label {
        font-size: 12px;
        font-weight: 600;
        color: #4A5568;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: block;
    }
    .form-range {
        padding: 8px 0;
    }
`;
document.head.appendChild(formStyles);

// Console greeting
console.log(`
╔═══════════════════════════════════════╗
║   QUANTUM LEAP                        ║
║   Identity-Based Productivity         ║
║                                       ║
║   Who are you becoming?               ║
╚═══════════════════════════════════════╝
`);
