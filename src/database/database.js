import sqlite3 from "sqlite3";

class DataBase {
    //db = new sqlite3.Database('database/database.db');

    insertDataQueryCompany = `INSERT INTO companies (img, name, location, link)
                              VALUES (?, ?, ?, ?) `;

    insertDataQueryEmployee = `INSERT INTO employees (CompanyId, link, img, name, subtitle, location, email)
                               VALUES (NULL, ?, ?, ?, ?, ?, ?)`;

    selectDataQueryCompanies = `SELECT *
                                  FROM companies`;

    selectDataQueryEmployees = `SELECT *
                               FROM employees`;

    createCompanyTable(db) {
        db.exec(`
            CREATE TABLE IF NOT EXISTS companies
            (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                img TEXT,
                name TEXT,
                location TEXT,
                link TEXT NULL
            );
        `);
    }

    createEmployeeTable(db) {
        db.exec(`
            CREATE TABLE IF NOT EXISTS employees
            (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                CompanyId INTEGER,
                link TEXT,
                img TEXT NULL,
                name TEXT,
                subtitle TEXT,
                location TEXT,
                email TEXT NULL
            );
        `);
    }

// Wrap the database operations in an async function
    async createDbConnection() {
        const db = new sqlite3.Database('src/database/database.db');
        await this.createCompanyTable(db);
        await this.createEmployeeTable(db);
        console.log("Connection with SQLite has been established");
        return db;
    }

// Helper function to run a query with optional parameters
    runQuery(db, query, params = []) {
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

    getFromDb = (query) => {
        const db = new sqlite3.Database('src/database/database.db');
        return new Promise((resolve, reject) => {
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err.message);
                    return;
                }
                resolve(rows);
            });
        });
    };

    clearTable(db, tableName) {
        db.serialize(() => {
            db.run(`DELETE
                    FROM ${tableName}`, (err) => {
                if (err) {
                    console.error("An error occurred:", err.message);
                } else {
                    console.log(`The ${tableName} table has been cleared.`);
                }
            });
        });
    }
}

export const database = new DataBase();
