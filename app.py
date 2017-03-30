#!user/bin/python

import csv
from flask import Flask render_template, request, session, url_for, redirect

app = Flask(__name__)

app.route("/", methods = ["POST", "GET"])
def root():
    render_teplate("route.html")

if __name__ == "main":
    app.debug = True
    app.run()
