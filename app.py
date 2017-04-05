from data import process, group
from flask import Flask, render_template, request, session, url_for, redirect
import json

app = Flask(__name__)

@app.route('/')
def root():
    return render_template("index.html")

@app.route('/data/injury_fractions', methods = ['POST'])
def injury_percents():
    fractions = process.get_injury_fractions()
    return json.dumps(fractions.items())

@app.route('/data/average_leave', methods = ['POST'])
def average_leave():
    counts = process.get_average_leave()
    return json.dumps(counts.items())

@app.route("/state", methods = ["GET"])
def post():
    data = request.args.get("text")
    result = group.getStateData(data);   
    return json.dumps(result)
    
if __name__ == '__main__':
    app.debug = True
    app.run()
