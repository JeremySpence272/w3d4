import sqlite3
import json

conn = sqlite3.connect('./data/database.db')
cursor = conn.cursor()

def init_tables():
    cursor.execute('''
                CREATE TABLE IF NOT EXISTS users
                    (
                    userid INT PRIMARY KEY,
                    name   TEXT
                    ) 
                ''')
    cursor.execute('''
                CREATE TABLE IF NOT EXISTS posts
                    (
                    postID INT PRIMARY KEY,
                    title TEXT,
                    body TEXT,
                    userID INT,
                    FOREIGN KEY (userID) references users(userID)
                    )
                ''')
    cursor.execute('''
               CREATE TABLE IF NOT EXISTS comments
                (
                commentID INT PRIMARY KEY,
                text TEXT,
                userID INT,
                postID INT,
                FOREIGN KEY (userID) references users(userID),
                FOREIGN KEY (postID) references posts(postID)
                ) 
               ''')

def write_to_database():
    with open('./data/sampleData.json') as file:
        data = json.load(file)

    users = []
    posts = []
    comments = []

    for key, records in data.items():
        for record in records:
            if(key == "users"):
                users.append(record)
            elif(key == "posts"):
                posts.append(record)
            else:
                comments.append(record)

    for user in users:
        cursor.execute('''INSERT INTO users (userID, name) values (?, ?)''', (user["UserID"], user["Name"]))

    for post in posts:
        cursor.execute('''INSERT INTO posts (postID, title, body, userID) values (?, ?, ?, ?)''', 
                    (post["PostID"], post["Title"], post["Body"], post["UserID"]))
        
    for comment in comments:
        cursor.execute('''INSERT INTO comments (commentID, text, postID, userID) values (?, ?, ?, ?)''', 
                    (comment["CommentID"], comment["Text"], comment["PostID"], comment["UserID"]))

    conn.commit()

def main():
    print("nothing to do here :)")
    conn.close()


if __name__ == "__main__":
    main()

