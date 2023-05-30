document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/displayResult');
    const result = await response.json();
    console.log(result.data);
    displayEmployees(result.data);
});

const displayEmployees = (employees) => {
    const container = document.getElementById('employeeContainer');

    if (employees.length >= 1) {
        container.innerHTML = '';
        employees.forEach(row => {
            const div = document.createElement('div');
            div.className = "result_item";
            div.innerHTML = `
            <div class='result-image'>
                <img src=${row.img} alt='${row.name}_image'>
            </div>
            <div class='result-informations'>
                <p><b>Name: </b>${row.name}</p>
                <p><b>Subtitle: </b>${row.subtitle}</p>
                <p><b>Location: </b>${row.location}</p>
                <p><b>Email: </b>${row.email}</p>
                <a href='${row.link}' target="_blank"><b>Profile link</b></a>
            </div>
    `;
            container.appendChild(div);
        });
    } else {
        container.innerHTML = '<p>No result found</p>'
    }
}