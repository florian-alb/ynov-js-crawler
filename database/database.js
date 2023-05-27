import sqlite3 from "sqlite3";

class DataBase {
    db = new sqlite3.Database('database/database.db');

    insertDataQueryCompany = `
        INSERT INTO companies (img, name, location, link)
        VALUES (?, ?, ?, ?)
    `;

    insertDataQueryEmployee = `
        INSERT INTO employees (CompanyId, link, img, name, subtitle, location, email)
        VALUES (NULL, ?, ?, ?, ?, ?, ?)
    `;

    selectDataQueryEnterprises = `SELECT *
                                  FROM companies`;

    selectDataQueryEmployee = `SELECT *
                               FROM employees`;

    createCompanyTable(db) {
        db.exec(`
            CREATE TABLE IF NOT EXISTS companies
            (
                ID       INTEGER PRIMARY KEY AUTOINCREMENT,
                img      TEXT,
                name     TEXT,
                location TEXT,
                link     TEXT NULL
            );
        `);
    }

    createEmployeeTable(db) {
        db.exec(`
            CREATE TABLE IF NOT EXISTS employees
            (
                ID        INTEGER PRIMARY KEY AUTOINCREMENT,
                CompanyId INTEGER,
                link      TEXT,
                img       TEXT,
                name      TEXT,
                subtitle  TEXT,
                location  TEXT,
                email     TEXT
            );
        `);
    }

// Wrap the database operations in an async function
    async createDbConnection() {
        await this.createCompanyTable(this.db);
        await this.createEmployeeTable(this.db);
        console.log("Connection with SQLite has been established");
    }

// Helper function to run a query with optional parameters
    runQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(this);
                }
            });
        });
    }

    closeDatabase(error = null){
        if (error){
            console.error("Error performing database operations:", error);
            this.db.close();
        } else {
            console.log("Database closed successfully.");
            this.db.close();
        }
    }
}

export const database = new DataBase();
