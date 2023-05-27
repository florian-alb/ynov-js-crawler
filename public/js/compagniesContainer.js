import {database} from "../../database/database.js";

const companiesContainer = document.getElementById('companiesContainer');

database.runQuery(database.selectDataQueryEnterprises)
    .then((rows) => {

        rows.forEach((row) => {
            const { img, name, location, link } = row;


            const companyElement = document.createElement('div');
            const companyLink = document.createElement('a');
            companyLink.href = link; /// remplacer le link par le bon lien
            companyLink.appendChild(companyElement);
            companyElement.classList.add('company');
            companyElement.innerHTML = `
        <img src="${img}" alt="${name}" />
        <h3>${name}</h3>
        <p>Location: ${location}</p>
        <a href="${link}">More Info</a>
      `;

            companiesContainer.appendChild(companyElement);
        });
    })
    .catch((error) => {

        console.error('Error retrieving companies data:', error);
    });
