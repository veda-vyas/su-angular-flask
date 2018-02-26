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

@app.route('/', methods=['GET', 'POST'])
def index():
    errors = []
    results = []
    if request.method == "POST":
        try:
            name = request.form["name"]
            password = request.form["password"]
            email = request.form["email"]
            user = users(
                name=name,
                password=password,
                email=email
            )
            db.session.add(user)
            db.session.commit()
            results.append(
                "Successfully Registered."
            )
        except Exception as e:
            print e
            errors.append("Unable to add user into database.")            
        
    return render_template('index.html', errors=errors, results=results)

@app.route('/register',methods=['POST'])
def register():
    errors = []
    results = []
    if request.method == "POST":
        # get url that the user has entered
        try:
            name = request.form["name"]
            password = request.form["password"]
            email = request.form["email"]
            user = users(
                name=name,
                password=password,
                email=email
            )
            db.session.add(user)
            db.session.commit()
            results.append(
                "Successfully Registered."
            )
        except Exception as e:
            print e
            errors.append("Unable to add user into database.")
            
        return redirect(url_for('index', errors=errors, results=results))

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
