document.addEventListener('DOMContentLoaded', async function() {
    try {
        const [oldData, newData] = await Promise.all([
            fetchDataAndParse('old_pos.txt'),
            fetchDataAndParse('new_pos.txt')
        ]);

        populateTable('newTable', oldData, newData);

        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', function() {
            searchTables(this.value);
        });
    } catch (error) {
        console.error('Hiba az adatok betöltésekor:', error);
    }
});

async function fetchDataAndParse(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP hiba: ${response.status}`);
        }
        const data = await response.text();
        const keyValuePairs = {};

        data.trim().split('\n').forEach(line => {
            const [value, key] = line.split('|');
            if (key && value) {
                if (!keyValuePairs[key]) {
                    keyValuePairs[key] = [];
                }
                keyValuePairs[key].push(value);
            }
        });

        return keyValuePairs;
    } catch (error) {
        console.error('Hiba az adatfeldolgozás során:', error);
        return {}; // Üres objektumot ad vissza hiba esetén
    }
}

function populateTable(tableId, oldData, newData) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Törli a táblázat tartalmát az új adatok előtt

    for (const [key, newValues] of Object.entries(newData)) {
        if (oldData[key]) {
            newValues.forEach(newValue => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${key}</td><td>${newValue}</td>`;
                tbody.appendChild(row);
            });
        }
    }
}

function searchTables(searchTerm) {
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const matches = cells.some(cell => cell.textContent.trim().toUpperCase().includes(searchTerm.toUpperCase()));
            row.style.display = matches ? '' : 'none';
        });

        // Keep the header always visible
        const header = table.querySelector('thead');
        header.style.display = 'table-header-group';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.querySelector('.copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `© ${currentYear} ~ Sablon pozíció ~ by KriszH & AttiS. Minden jog fenntartva.`;
    }
});
