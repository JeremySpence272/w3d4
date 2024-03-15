const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const { User, Post, Comment } = require("./classes.js");

let db = new sqlite3.Database("./data/database.db", sqlite3.OPEN_READWRITE);

function createTables() {
	db.run(`
        CREATE TABLE IF NOT EXISTS users(
            userID INT PRIMARY KEY, 
            name TEXT)
        `);

	db.run(`
        CREATE TABLE IF NOT EXISTS posts(
            postID INT PRIMARY KEY,
            title TEXT,
            body TEXT,
            userID INT,
            FOREIGN KEY (userID) references users(userID))
        `);

	db.run(`
        CREATE TABLE IF NOT EXISTS comments(
            commentID INT PRIMARY KEY,
            text TEXT,
            userID INT,
            postID INT,
            FOREIGN KEY (userID) references users(userID),
            FOREIGN KEY (postID) references posts(postID))
        `);
}

//createTables()

function writeToDatabase() {
	const rawdata = fs.readFileSync("./data/sampleData.json");
	const jsonData = JSON.parse(rawdata);

	const userRecords = jsonData.users;
	const postRecords = jsonData.posts;
	const commentRecords = jsonData.comments;

	userRecords.forEach((record) => {
		const insert = `INSERT INTO users (userID, name) values (?, ?)`;
		db.run(insert, [record.UserID, record.Name], (err) => {
			if (err)
				console.log(`couldn't log user: ${record.UserID} into the database`);
		});
	});

	postRecords.forEach((record) => {
		const insert = `INSERT INTO posts (postID, title, body, userID) values (?, ?, ?, ?)`;
		db.run(
			insert,
			[record.PostID, record.Title, record.Body, record.UserID],
			(err) => {
				if (err)
					console.log(`couldn't log post: ${record.PostID} into the database`);
			}
		);
	});

	commentRecords.forEach((record) => {
		const insert = `INSERT INTO comments (commentID, text, postID, userID) values (?, ?, ?, ?)`;
		db.run(
			insert,
			[record.CommentID, record.Text, record.PostID, record.UserID],
			(err) => {
				//prettier-ignore
				if (err) console.log(`couldn't log comment: ${record.CommentID} into the database`);
			}
		);
	});
}

//writeToDatabase()
