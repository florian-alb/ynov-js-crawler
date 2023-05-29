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
            div.innerHTML = `
      <img src=${row.img} alt='${row.name}_image'>
      <p>Name: ${row.name}</p>
      <p>Subtitle: ${row.subtitle}</p>
      <p>Location: ${row.location}</p>
      <p>Email: ${row.email}</p>
    `;
            container.appendChild(div);
        });
    } else {
        container.innerHTML = '<p>No result found</p>'
    }
}