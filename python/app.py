from flask import Flask, g
import sqlite3

app = Flask(__name__)


def get_db(): # apparently this makes it so this all happens on one thread?
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('../data/database.db')
    return db

@app.route('/data/users')
def get_users():
    cursor = get_db().cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    return users

@app.route('/data/posts')
def get_posts():
    cursor = get_db().cursor()
    cursor.execute("SELECT * FROM posts")
    posts = cursor.fetchall()
    cursor.close()
    return posts

@app.route('/data/comments')
def get_comments():
    cursor = get_db().cursor()
    cursor.execute("SELECT * FROM comments")
    comments = cursor.fetchall()
    cursor.close()
    return comments
    
@app.route('/data/user/<id>')
def get_user(id):
    cursor = get_db().cursor()
    postQuery = '''SELECT postID FROM posts WHERE userID = ? '''
    commentQuery = '''SELECT commentID FROM comments WHERE userID = ? '''
    userQuery = '''SELECT name FROM users WHERE userID = ?'''
    
    cursor.execute(userQuery, (id,))
    userResult = cursor.fetchall()
    username = userResult[0][0]

    cursor.execute(postQuery, (id,))
    postsResult = cursor.fetchall()
    posts = [row[0] for row in postsResult]

    cursor.execute(commentQuery, (id,))
    commentsResult = cursor.fetchall()
    comments = [row[0] for row in commentsResult]

    user = {
        "userID": id,
        "name": username,
        "posts": posts,
        "comments": comments
    }
    return user


@app.route('/data/post/<id>')
def get_post(id):
    cursor = get_db().cursor()
    postQuery = '''SELECT * FROM posts WHERE postID = ?'''
    commentQuery = '''SELECT commentID FROM comments WHERE postID = ?'''

    cursor.execute(postQuery, (id,))
    postsResult = cursor.fetchall()
    post = postsResult[0]

    cursor.execute(commentQuery, (id,))
    commentResult = cursor.fetchall()
    comments = [row[0] for row in commentResult]

    post_dict = {
        "postID": post[0],
        "userID": post[3],
        "title": post[1],
        "body": post[2],
        "comments": comments
    }

    return post_dict


@app.route('/data/comment/<id>')
def get_comment(id):
    cursor = get_db().cursor()
    query = '''SELECT * FROM comments WHERE commentID = ?'''
    cursor.execute(query, (id,))
    comment = cursor.fetchall()
    cursor.close()
    return comment

    
if __name__ == "__main__":
    app.run(debug=True)