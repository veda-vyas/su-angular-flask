import os
from flask import *
from rq import Queue
from rq.job import Job
from worker import conn
from flask.ext.sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)
db = SQLAlchemy(app)

from models import users

q = Queue(connection=conn)

def register(name, email, password):
    errors = []
    results = []
    try:
        user = users(
            name=name,
            password=password,
            email=email
        )
        db.session.add(user)
        db.session.commit()
        results.append("Successfully Registered")
        return {"result": results}
    except:
        errors.append("Unable to add user into database.")
        return {"error": errors}

@app.route('/', methods=['GET', 'POST'])
def index():            
    return render_template('index.html')

@app.route('/signup', methods=['POST'])
def signup():
    # get url
    data = json.loads(request.data.decode())
    name = data["name"]
    email = data["email"]
    password = data["password"]

    job = q.enqueue_call(
        func="app.register", args=(name,email,password), result_ttl=5000
    )
    return job.get_id()

@app.route("/results/<job_key>", methods=['GET'])
def get_results(job_key):

    job = Job.fetch(job_key, connection=conn)

    if job.is_finished:
        return jsonify(job.result)
    else:
        return "Still Processing", 202

if __name__ == '__main__':
    app.run()
