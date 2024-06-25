const goals = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
const history = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    updateGoals(parseFloat(document.getElementById('totalAmount').innerText));
});

function calculateTotal() {
    const rappen5 = parseInt(document.getElementById('rappen5').value) || 0;
    const rappen10 = parseInt(document.getElementById('rappen10').value) || 0;
    const rappen20 = parseInt(document.getElementById('rappen20').value) || 0;
    const rappen50 = parseInt(document.getElementById('rappen50').value) || 0;
    const franken1 = parseInt(document.getElementById('franken1').value) || 0;
    const franken2 = parseInt(document.getElementById('franken2').value) || 0;
    const franken5 = parseInt(document.getElementById('franken5').value) || 0;

    const totalAmount = (rappen5 * 0.05) + (rappen10 * 0.1) + (rappen20 * 0.2) +
        (rappen50 * 0.5) + (franken1 * 1) + (franken2 * 2) + (franken5 * 5);

    document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);

    updateGoals(totalAmount);
    addHistoryEntry(`Hinzugefügt: ${totalAmount.toFixed(2)} CHF`);
}

function withdrawAmount() {
    const amount = parseFloat(prompt('Wie viel möchten Sie abheben?'));
    if (!isNaN(amount) && amount > 0) {
        const totalElement = document.getElementById('totalAmount');
        const currentTotal = parseFloat(totalElement.innerText);
        const newTotal = currentTotal - amount;

        if (newTotal >= 0) {
            totalElement.innerText = newTotal.toFixed(2);
            addHistoryEntry(`Abgehoben: ${amount.toFixed(2)} CHF`);
            updateGoals(newTotal);
        } else {
            alert('Sie haben nicht genügend Geld in der Kasse.');
        }
    } else {
        alert('Bitte geben Sie einen gültigen Betrag ein.');
    }
}

function updateGoals(totalAmount) {
    goals.forEach(goal => {
        const goalElement = document.getElementById(`goal-${goal}`);
        if (totalAmount >= goal) {
            goalElement.classList.add('achieved');
        } else {
            goalElement.classList.remove('achieved');
        }
    });
}

function saveProgress() {
    const progress = {
        rappen5: document.getElementById('rappen5').value,
        rappen10: document.getElementById('rappen10').value,
        rappen20: document.getElementById('rappen20').value,
        rappen50: document.getElementById('rappen50').value,
        franken1: document.getElementById('franken1').value,
        franken2: document.getElementById('franken2').value,
        franken5: document.getElementById('franken5').value,
        totalAmount: document.getElementById('totalAmount').innerText,
        history: history
    };
    const progressString = JSON.stringify(progress);
    const date = new Date();
    const timestamp = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
    const filename = `progress_${timestamp}.sparen`;
    const blob = new Blob([progressString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function loadProgress() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sparen';
    input.onchange = event => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                const progress = JSON.parse(e.target.result);
                document.getElementById('rappen5').value = progress.rappen5;
                document.getElementById('rappen10').value = progress.rappen10;
                document.getElementById('rappen20').value = progress.rappen20;
                document.getElementById('rappen50').value = progress.rappen50;
                document.getElementById('franken1').value = progress.franken1;
                document.getElementById('franken2').value = progress.franken2;
                document.getElementById('franken5').value = progress.franken5;
                document.getElementById('totalAmount').innerText = progress.totalAmount;
                history.splice(0, history.length, ...progress.history); // Load history
                updateHistory(); // Update history display
                updateGoals(parseFloat(progress.totalAmount)); // Update the goals based on loaded progress
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function addHistoryEntry(entry) {
    const date = new Date();
    const timestamp = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    history.push(`${timestamp}: ${entry}`);
    updateHistory();
}

function updateHistory() {
    const historyContent = document.getElementById('historyContent');
    historyContent.innerHTML = '<ul>' + history.map(entry => `<li>${entry}</li>`).join('') + '</ul>';
}

function toggleHistory() {
    const historyContent = document.getElementById('historyContent');
    historyContent.style.display = historyContent.style.display === 'none' ? 'block' : 'none';
}
