import os
from flask import *
from flask_sqlalchemy import SQLAlchemy
import json
import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow

# The CLIENT_SECRETS_FILE variable specifies the name of a file that contains
# the OAuth 2.0 information for this application, including its client_id and
# client_secret.
CLIENT_SECRETS_FILE = "client_secret_318090506706-empq7ve6ijjchv2q72t8mveqomd819v9.apps.googleusercontent.com.json"

# This OAuth 2.0 access scope allows for full read/write access to the
# authenticated user's account and requires requests to use an SSL connection.
SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
API_SERVICE_NAME = 'youtube'
API_VERSION = 'v3'

app = Flask(__name__)
app.debug = True
app.secret_key = 'somethingsecret'

DB_NAME = "module_page"
DB_USER = "postgres"
DB_PASS = "veda1997"
DB_SERVICE = "localhost"
DB_PORT = "5432"
SQLALCHEMY_DATABASE_URI = "postgresql://postgres:veda1997@localhost:5432/su_angular_flask"
# SQLALCHEMY_DATABASE_URI
SQLALCHEMY_TRACK_MODIFICATIONS = True

db = SQLAlchemy(app)
root = os.path.join(os.path.dirname(os.path.abspath(__file__)))

class users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    password = db.Column(db.String())
    email = db.Column(db.String())

    def __init__(self, name, password, email):
        self.name = name
        self.password = password
        self.email = email

    def __repr__(self):
        return '<id {}>'.format(self.id)

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
        return json.dumps({"result": results})
    except:
        errors.append("Unable to add user into database.")
        return json.dumps({"result": errors})

@app.route('/', methods=['GET', 'POST'])
def index():            
    return render_template('index.html')

@app.route('/gallery', methods=['GET', 'POST'])
def gallery():            
    return render_template('gallery.html')

@app.route('/watch', methods=['GET', 'POST'])
def watch():            
    return render_template('watch.html')

@app.route('/adminpage')
def adminpage():
    return render_template('admin.html')

@app.route('/editplaylist')
def editplaylist():
    return render_template('editplaylist.html')

@app.route('/css/<path:path>')
def send_stylesheets(path):
    return send_from_directory(root+"/css", path)

@app.route('/images/<path:path>')
def send_images(path):
    return send_from_directory(root+"/images", path)

@app.route('/js/<path:path>')
def send_javascripts(path):
    return send_from_directory(root+"/js", path)

@app.route('/mdb/<path:path>')
def send_mdb(path):
    return send_from_directory(root+"/mdb", path)

@app.route('/signup', methods=['POST'])
def signup():
    # get url
    data = json.loads(request.data.decode())
    name = data["name"]
    email = data["email"]
    password = data["password"]
    result = register(name,email,password)

    return result

@app.route('/youtubeapi/<id>', methods=['GET', 'POST'])
def youtubeapi(id):
    if 'credentials' not in session:
        return redirect('authorize')

      # Load the credentials from the session.
    credentials = google.oauth2.credentials.Credentials(
          **session['credentials'])

    client = googleapiclient.discovery.build(
          API_SERVICE_NAME, API_VERSION, credentials=credentials)
      
    return playlist_items_list_by_playlist_id(client,
        part='snippet,contentDetails',
        maxResults=25,
        playlistId=id)            
    # return render_template('youtubeapi.html')

@app.route('/authorize')
def authorize():
  # Create a flow instance to manage the OAuth 2.0 Authorization Grant Flow
  # steps.
  flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
      CLIENT_SECRETS_FILE, scopes=SCOPES)
  flow.redirect_uri = url_for('oauth2callback', _external=True)
  authorization_url, state = flow.authorization_url(
      # This parameter enables offline access which gives your application
      # both an access and refresh token.
      access_type='offline',
      # This parameter enables incremental auth.
      include_granted_scopes='true')

  # Store the state in the session so that the callback can verify that
  # the authorization server response.
  session['state'] = state

  return redirect(authorization_url)

@app.route('/oauth2callback')
def oauth2callback():
  # Specify the state when creating the flow in the callback so that it can
  # verify the authorization server response.
  state = session['state']
  flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
      CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
  flow.redirect_uri = url_for('oauth2callback', _external=True)

  # Use the authorization server's response to fetch the OAuth 2.0 tokens.
  authorization_response = request.url
  flow.fetch_token(authorization_response=authorization_response)

  # Store the credentials in the session.
  # ACTION ITEM for developers:
  #     Store user's access and refresh tokens in your data store if
  #     incorporating this code into your real app.
  credentials = flow.credentials
  session['credentials'] = {
      'token': credentials.token,
      'refresh_token': credentials.refresh_token,
      'token_uri': credentials.token_uri,
      'client_id': credentials.client_id,
      'client_secret': credentials.client_secret,
      'scopes': credentials.scopes
  }

  return redirect(request.referrer)

# Remove keyword arguments that are not set
def remove_empty_kwargs(**kwargs):
  good_kwargs = {}
  if kwargs is not None:
    for key, value in kwargs.iteritems():
      if value:
        good_kwargs[key] = value
  return good_kwargs

def playlist_items_list_by_playlist_id(client, **kwargs):
  # See full sample for function
  kwargs = remove_empty_kwargs(**kwargs)

  response = client.playlistItems().list(
    **kwargs
  ).execute()

  return jsonify(**response)

if __name__ == '__main__':
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    app.run('localhost', port=5001)
