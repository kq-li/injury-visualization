from data import process
from flask import Flask, render_template, request, session, url_for, redirect
import json

app = Flask(__name__)

@app.route('/')
def root():
    return render_template("index.html")

@app.route('/data/injury_counts', methods = ['POST'])
def injury_counts():
    counts = process.get_injury_counts()
    return json.dumps(counts.items())

@app.route('/data/populations', methods = ['POST'])
def populations():
    populations = process.get_populations()
    return json.dumps(populations.items())
    
@app.route('/data/average_days_away', methods = ['POST'])
def average_days_away():
    days_away = process.get_average_days_away()
    return json.dumps(days_away.items())

@app.route('/data/industry_counts/<state>', methods = ['POST'])
def state_industries(state):
    counts = process.get_state_industries(state)
    print counts
    return json.dumps(sorted(counts.items(), key = lambda x: x[1], reverse = True))
    
if __name__ == '__main__':
    app.debug = True
    app.run()
