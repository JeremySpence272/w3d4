const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.set("json spaces", 4);

const db = new sqlite3.Database("./data/database.db", sqlite3.OPEN_READWRITE);

app.get("/data/users", (req, res) => {
	let query = `SELECT * FROM users`;
	db.all(query, [], (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		} else {
			res.json(rows);
		}
	});
});

app.get("/data/posts", (req, res) => {
	let query = `SELECT * FROM posts`;
	db.all(query, [], (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		} else {
			res.json(rows);
		}
	});
});
app.get("/data/comments", (req, res) => {
	let query = `SELECT * FROM comments`;
	db.all(query, [], (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		} else {
			res.json(rows);
		}
	});
});

app.get("/data/user/:id", async (req, res) => {
	const userId = req.params.id;
	const postQuery = `SELECT postID FROM posts WHERE userID = ? `;
	const commentQuery = `SELECT commentID FROM comments WHERE userID = ? `;
	const userQuery = `SELECT name FROM users WHERE userID = ?`;

	const queryAsync = (sql, params) =>
		new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows) => {
				if (err) reject(err);
				else resolve(rows);
			});
		});

	try {
		const [userRow, postRows, commentRows] = await Promise.all([
			queryAsync(userQuery, [userId]),
			queryAsync(postQuery, [userId]),
			queryAsync(commentQuery, [userId]),
		]);

		const userName = userRow[0].name;
		const posts = postRows.map((row) => row.postID);
		const comments = commentRows.map((row) => row.commentID);

		const user = {
			userID: userId,
			name: userName,
			posts: posts,
			comments: comments,
		};
		res.json(user);
	} catch (err) {
		console.error("error somewhere", err);
		res.status(500).send("couldnt fetch user");
	}
});

app.get("/data/post/:id", async (req, res) => {
	let postId = req.params.id;
	let postQuery = `SELECT * FROM posts WHERE postID = ?`;
	let commentQuery = `SELECT commentID FROM comments WHERE postID = ?`;

	const queryAsync = (sql, params) =>
		new Promise((resolve, reject) => {
			db.all(sql, params, (err, rows) => {
				if (err) reject(err);
				else resolve(rows);
			});
		});

	try {
		const [postResult, commentsRows] = await Promise.all([
			queryAsync(postQuery, postId),
			queryAsync(commentQuery, postId),
		]);

		let post = postResult[0];
		let comments = commentsRows.map((comment) => comment.commentID);

		post["comments"] = comments;

		res.json(post);
	} catch (err) {
		console.error("error somewhere", err);
		res.status(500).send("couldnt get post");
	}
});
app.get("/data/comment/:id", (req, res) => {
	const commentId = req.params.id;
	const query = `SELECT * FROM comments WHERE commentID = ?`;
	db.all(query, [commentId], (err, rows) => {
		if (err) {
			console.error("couldnt get the comment", err);
			res.status(500).send("no comment bud");
			return;
		} else {
			res.json(rows);
		}
	});
});

app.listen(4000, () => {
	console.log("server up and running on port 4000");
});
