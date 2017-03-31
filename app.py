from data import process
from flask import Flask, render_template, request, session, url_for, redirect
import json

app = Flask(__name__)

@app.route('/')
def root():
    counts = process.get_state_counts()
    print counts
    return render_template("index.html",
                           counts = counts,
                           max_count = max([state['count'] for state in counts]))

if __name__ == '__main__':
    app.debug = True
    app.run()
