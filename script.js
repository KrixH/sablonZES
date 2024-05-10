document.addEventListener('DOMContentLoaded', async function() {
    const [oldData, newData] = await Promise.all([
        fetchDataAndParse('old_pos.txt'),
        fetchDataAndParse('new_pos.txt')
    ]);

    populateTable('oldTable', oldData);
    populateTable('newTable', newData);

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        searchTables(this.value);
        checkForEasterEgg(this.value);
    });
});

async function fetchDataAndParse(url) {
    const response = await fetch(url);
    const data = await response.text();
    const keyValuePairs = {};
    data.trim().split('\n').forEach(line => {
        const [value, key] = line.split('|');
        keyValuePairs[value] = (keyValuePairs[value] || []).concat(key);
    });
    return keyValuePairs;
}

function populateTable(tableId, data) {
    const table = document.getElementById(tableId);
    for (const [key, values] of Object.entries(data)) {
        for (const value of values) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${key}</td><td>${value}</td>`;
            table.appendChild(row);
        }
    }
}

function searchTables(searchTerm) {
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
        Array.from(table.querySelectorAll('tr')).forEach(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const matches = cells.some(cell => cell.textContent.trim().toUpperCase().includes(searchTerm.toUpperCase()));
            row.style.display = matches ? '' : 'none';
        });
    });
}

function checkForEasterEgg(searchTerm) {
    const easterEggMessages = {
        "DAVID": "Easter Egg: Legnagyobb koma!",
        "TOMI": "AZ IGAZI BOSS!",
        "ATTILA": "INKÁBB Ő A BOSS?!"
    };

    const upperCaseSearchTerm = searchTerm.toUpperCase();
    if (upperCaseSearchTerm in easterEggMessages) {
        alert(easterEggMessages[upperCaseSearchTerm]);
    }
}
