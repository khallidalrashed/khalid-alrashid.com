document.addEventListener('DOMContentLoaded', () => {
    fetch('cms_data.json')
        .then(response => response.json())
        .then(data => {
            const cmsTable = document.getElementById('cmsTable').querySelector('tbody');
            
            data.forEach(cms => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${cms.name}</td>
                    <td>${cms.support}</td>
                    <td>${cms.technology}</td>
                    <td>${cms.capabilities}</td>
                    <td>${cms.limitations}</td>
                    <td><a href="${cms.example}" target="_blank">${cms.example}</a></td>
                `;
                
                cmsTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading CMS data:', error));
});
