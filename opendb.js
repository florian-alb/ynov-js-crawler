import sqlite3 from "sqlite3";

// Create a new SQLite database
let db = new sqlite3.Database('./data.db');

// Execute SQL statements
const createFirstTable = `
    CREATE TABLE IF NOT EXISTS enterprises(
                                              Enterprises_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              nickname TEXT NOT NULL,
                                              profileImg TEXT NOT NULL,
                                              location TEXT NOT NULL,
                                              link TEXT NOT NULL UNIQUE
    );`;

 const createSecondTable = `
    CREATE TABLE IF NOT EXISTS employee(
        Employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
        link TEXT NOT NULL UNIQUE,
        profileImg TEXT NOT NULL,
        nickname TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        location TEXT NOT NULL,
        email TEXT NOT NULL
);`;

const insertDataQueryEnterprises = `
    INSERT OR IGNORE INTO enterprises VALUES (NULL,?,?,?,?)`;
const insertDataQueryEmployee = `
    INSERT OR IGNORE INTO employee VALUES (NULL,?,?,?,?,?,?)`;

const selectDataQueryEnterprises = `SELECT * FROM enterprises`;
const selectDataQueryEmployee = `SELECT * FROM employee`;

// Wrap the database operations in an async function
async function performDatabaseOperations() {
    // Create the tables
    await runQuery(createFirstTable);
    await runQuery(createSecondTable);

    const dataEnterprises = {
        nickname: 'Sample Nickname',
        profileImg: 'sample.jpg',
        location: 'Sample Location',
        link: 'sample-link',
    };

    const dataEmployee = {
        link: 'sample-link',
        profileImg: 'sample.jpg',
        nickname: 'Sample Name',
        subtitle: 'sample subtitle',
        location: 'Sample Location',
        email: 'sample-email',
    };

    // Insert data into enterprises table
    await runQuery(insertDataQueryEnterprises, Object.values(dataEnterprises));

    // Insert data into employee table
    await runQuery(insertDataQueryEmployee, Object.values(dataEmployee));

    // Query data from enterprises table
    const resultEnterprises = await runQuery(selectDataQueryEnterprises);

    // Query data from employee table
    const resultEmployee = await runQuery(selectDataQueryEmployee);

    // Handle the queried data
    console.log("Enterprises:", resultEnterprises);
    console.log("Employee:", resultEmployee);
}

// Helper function to run a query with optional parameters
function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve(this);
            }
        });
    });
}

// Call the function to perform the database operations
performDatabaseOperations()
    .then(() => {
        console.log("Database operations completed successfully.");
        // Close the database connection
        db.close();
    })
    .catch((error) => {
        console.error("Error performing database operations:", error);
        // Close the database connection in case of error
        db.close();
    });
