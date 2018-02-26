import os
from flask import *
from rq import Queue
from rq.job import Job
from worker import conn
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
db = SQLAlchemy(app)

from models import users

q = Queue(connection=conn)

def print_name(name):
    errors = []
    try:
      	return name
    except:
        errors.append(
            "Unable to get Name. Please make sure it's valid and try again."
        )
        return {"error": errors}

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/<name>')
def hello_name(name):
    results = {}
    job = q.enqueue_call(func="app.print_name", args=(name,), result_ttl=5000)
    jobid = job.get_id()
    return render_template('index.html', results=jobid)

@app.route("/results/<job_key>", methods=['GET'])
def get_results(job_key):

    job = Job.fetch(job_key, connection=conn)

    if job.is_finished:
        return str(job.result), 200
    else:
        return "Still Proceesing.", 202

if __name__ == '__main__':
    app.run()
