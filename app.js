const goals = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
const changeLog = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
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

    goals.forEach(goal => {
        const goalElement = document.getElementById(`goal-${goal}`);
        if (totalAmount >= goal) {
            goalElement.classList.add('achieved');
        } else {
            goalElement.classList.remove('achieved');
        }
    });

    logChange(`Betrag berechnet: ${totalAmount.toFixed(2)} CHF`);
}

function withdrawAmount() {
    const withdraw = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    const currentTotal = parseFloat(document.getElementById('totalAmount').innerText);
    const newTotal = currentTotal - withdraw;

    if (newTotal >= 0) {
        document.getElementById('totalAmount').innerText = newTotal.toFixed(2);
        logChange(`Betrag entnommen: ${withdraw.toFixed(2)} CHF`);
    } else {
        alert("Nicht genügend Guthaben.");
    }
}

function logChange(message) {
    const changeLogList = document.getElementById('changeLogList');
    const listItem = document.createElement('li');
    listItem.innerText = message;
    changeLogList.appendChild(listItem);
    changeLog.push(message);
}

function toggleChangeLog() {
    const changeLogDiv = document.getElementById('changeLog');
    changeLogDiv.classList.toggle('visible');
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
        changeLog: changeLog
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
                progress.changeLog.forEach(log => logChange(log));
                calculateTotal(); // Update the goals based on loaded progress
            };
            reader.readAsText(file);
        }
    };
    input.click();
}
