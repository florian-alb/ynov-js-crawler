import sqlite3 from 'sqlite3'
import { open} from 'sqlite'

(async () => {

    const db = await open({
        filename: './data.db',
        drive: sqlite3.Database
    })
    db.exec(`
        CREATE TABLE IF NOT EXISTS enterprises(
            nickname TEXT NOT NULL,
            location TEXT NOT NULL,
            profileImg TEXT NOT NULL,
            link TEXT NOT NULL,
        );

        CREATE TABLE IF NOT EXISTS employee(
            link TEXT NOT NULL UNIQUE,
            profileImg TEXT NOT NULL,
            nickname TEXT NOT NULL,
            subtitle TEXT NOT NULL,
            location TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE ,
            tel TEXT NOT NULL UNIQUE 
);
`
    )
})()
