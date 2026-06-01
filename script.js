// Morning Routine Activities
const activities = [
    { id: 1, name: 'Bangun Pagi', time: '04:15', emoji: '⏰' },
    { id: 2, name: 'Solat Subuh', time: '04:45', emoji: '🕌' },
    { id: 3, name: 'Olahraga Pagi', time: '05:15', emoji: '🏃' },
    { id: 4, name: 'Produktif', time: '06:00', emoji: '⭐' },
    { id: 5, name: 'Mandi', time: '06:30', emoji: '🚿' }
];

// Motivasi Quotes
const quotes = [
    'Pagi yang produktif menghasilkan hari yang sukses! 🌟',
    'Disiplin adalah fondasi dari setiap pencapaian besar. 💪',
    'Mulai hari dengan semangat, akhiri dengan kebanggaan. ✨',
    'Rutinitas pagi adalah investasi untuk masa depan lebih baik. 🚀',
    'Setiap pagi adalah kesempatan baru untuk menjadi lebih baik. 🌅',
    'Konsistensi hari ini, kesuksesan besok! 🎯',
    'Pagi yang sehat, hidup yang produktif. 💚',
    'Investasi terbaik adalah investasi pada diri sendiri. 📈'
];

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    updateThemeToggle();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    updateThemeToggle();
}

function updateThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    toggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// Date and Time
function updateDateTime() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    document.getElementById('dayName').textContent = dayName;
    document.getElementById('dateDisplay').textContent = `${date} ${month} ${year}`;
    
    // Update greeting
    const hour = now.getHours();
    let greeting = '';
    if (hour < 5) {
        greeting = '🌙 Selamat Malam!';
    } else if (hour < 12) {
        greeting = '🌅 Selamat Pagi!';
    } else {
        greeting = '☀️ Selamat Siang!';
    }
    document.getElementById('greeting').textContent = greeting;
}

// Daily Quote
function setDailyQuote() {
    const today = new Date().toDateString();
    let savedQuote = localStorage.getItem('dailyQuote');
    let savedQuoteDate = localStorage.getItem('quoteDate');
    
    if (savedQuoteDate !== today) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        savedQuote = quotes[randomIndex];
        localStorage.setItem('dailyQuote', savedQuote);
        localStorage.setItem('quoteDate', today);
    }
    
    document.getElementById('dailyQuote').textContent = `"${savedQuote}"`;
}

// Initialize Checklist
function initChecklist() {
    const checklist = document.getElementById('checklist');
    const today = new Date().toDateString();
    const savedData = JSON.parse(localStorage.getItem('checklist')) || {};
    
    checklist.innerHTML = '';
    
    activities.forEach(activity => {
        const isCompleted = savedData[today] && savedData[today][activity.id];
        
        const item = document.createElement('div');
        item.className = `checklist-item ${isCompleted ? 'completed' : ''}`;
        item.innerHTML = `
            <input type="checkbox" id="activity-${activity.id}" ${isCompleted ? 'checked' : ''}>
            <label for="activity-${activity.id}">
                <span style="font-size: 18px; margin-right: 8px;">${activity.emoji}</span>
                ${activity.name}
            </label>
            <span class="time">${activity.time}</span>
        `;
        
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => saveActivity(activity.id, checkbox.checked, today));
        
        checklist.appendChild(item);
    });
}

// Save Activity
function saveActivity(activityId, isCompleted, date) {
    let savedData = JSON.parse(localStorage.getItem('checklist')) || {};
    
    if (!savedData[date]) {
        savedData[date] = {};
    }
    
    savedData[date][activityId] = isCompleted;
    localStorage.setItem('checklist', JSON.stringify(savedData));
    
    updateProgress();
    updateCharts();
    updateSummary();
}

// Update Progress
function updateProgress() {
    const today = new Date().toDateString();
    const savedData = JSON.parse(localStorage.getItem('checklist')) || {};
    const todayData = savedData[today] || {};
    
    const completed = Object.values(todayData).filter(Boolean).length;
    const total = activities.length;
    const percent = Math.round((completed / total) * 100);
    
    document.getElementById('progressText').textContent = `${completed}/${total}`;
    document.getElementById('progressPercent').textContent = `${percent}%`;
    document.getElementById('progressFill').style.width = `${percent}%`;
}

// Reset Today
function resetToday() {
    if (confirm('Apakah Anda yakin ingin mereset checklist hari ini?')) {
        const today = new Date().toDateString();
        let savedData = JSON.parse(localStorage.getItem('checklist')) || {};
        delete savedData[today];
        localStorage.setItem('checklist', JSON.stringify(savedData));
        
        initChecklist();
        updateProgress();
        updateCharts();
        updateSummary();
    }
}

// Get Chart Data
function getChartData() {
    const savedData = JSON.parse(localStorage.getItem('checklist')) || {};
    const today = new Date();
    const weekData = {};
    const monthData = {};
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
        
        const dayData = savedData[dateStr] || {};
        const completed = Object.values(dayData).filter(Boolean).length;
        weekData[dayName] = (completed / activities.length) * 100;
    }
    
    // Get last 30 days
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const day = date.getDate();
        
        const dayData = savedData[dateStr] || {};
        const completed = Object.values(dayData).filter(Boolean).length;
        monthData[day] = (completed / activities.length) * 100;
    }
    
    return { weekData, monthData };
}

// Chart Configuration
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 100,
            ticks: {
                callback: function(value) {
                    return value + '%';
                }
            }
        }
    }
};

let weeklyChart = null;
let monthlyChart = null;

// Update Weekly Chart
function updateWeeklyChart() {
    const { weekData } = getChartData();
    const labels = Object.keys(weekData);
    const data = Object.values(weekData);
    
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Completion Rate (%)',
                data: data,
                backgroundColor: [
                    '#667eea', '#667eea', '#667eea', '#667eea',
                    '#667eea', '#667eea', '#764ba2'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: chartOptions
    });
}

// Update Monthly Chart
function updateMonthlyChart() {
    const { monthData } = getChartData();
    const labels = Object.keys(monthData).map(day => `${day}`);
    const data = Object.values(monthData);
    
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Completion Rate (%)',
                data: data,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: chartOptions
    });
}

// Update Summary
function updateSummary() {
    const savedData = JSON.parse(localStorage.getItem('checklist')) || {};
    const today = new Date();
    const summaryGrid = document.getElementById('summaryGrid');
    
    summaryGrid.innerHTML = '';
    
    // Calculate completion rate for each activity (last 7 days)
    const activityStats = {};
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const dayData = savedData[dateStr] || {};
        
        activities.forEach(activity => {
            if (!activityStats[activity.id]) {
                activityStats[activity.id] = { completed: 0, name: activity.name };
            }
            if (dayData[activity.id]) {
                activityStats[activity.id].completed++;
            }
        });
    }
    
    activities.forEach(activity => {
        const stats = activityStats[activity.id];
        const percent = Math.round((stats.completed / 7) * 100);
        let level = 'low';
        
        if (percent >= 70) level = 'high';
        else if (percent >= 40) level = 'medium';
        
        const item = document.createElement('div');
        item.className = `summary-item ${level}`;
        item.innerHTML = `
            <div class="activity-name">${activity.emoji} ${activity.name}</div>
            <div class="activity-percent">${percent}%</div>
            <div class="activity-label">7 hari terakhir</div>
        `;
        
        summaryGrid.appendChild(item);
    });
}

// Update Charts
function updateCharts() {
    updateWeeklyChart();
    updateMonthlyChart();
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Theme
    initTheme();
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Date and Time
    updateDateTime();
    
    // Quote
    setDailyQuote();
    
    // Checklist
    initChecklist();
    
    // Progress
    updateProgress();
    
    // Charts
    updateCharts();
    
    // Summary
    updateSummary();
    
    // Reset Button
    document.getElementById('resetBtn').addEventListener('click', resetToday);
    
    // Update time every minute
    setInterval(updateDateTime, 60000);
});

// Update progress when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        updateDateTime();
        const today = new Date().toDateString();
        const savedData = JSON.parse(localStorage.getItem('checklist')) || {};
        
        // Reset if it's a new day
        const lastDate = localStorage.getItem('lastVisitDate');
        if (lastDate !== today) {
            localStorage.setItem('lastVisitDate', today);
            initChecklist();
            updateProgress();
            updateCharts();
            updateSummary();
        }
    }
});
