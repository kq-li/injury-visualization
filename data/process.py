import injuries
import csv
from collections import OrderedDict

reports = injuries.get_reports()
states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']

def get_injury_counts():
    counts = OrderedDict([(state, 0) for state in states])

    for report in reports:
        state = report['address']['state']

        if state in states:
            counts[state] += 1

    return counts
    
def get_populations():
    reader = csv.reader(open('data/populations.csv'))
    return OrderedDict(map(lambda x: (x[0], int(x[1])), list(reader)[1:]))

def average(L):
    return sum(L) / len(L) if len(L) > 0 else 0
    
def get_average_days_away():
    days_away = OrderedDict([(state, []) for state in states])

    for report in reports:
        state = report['address']['state']

        if state in states:
            days_away[state].append(report['statistics']['days away'])

    for state in days_away:
        days_away[state] = average(days_away[state])

    return days_away

def get_state_industries(state):
    percents = {}
    
    for report in reports:
        if state == report['address']['state']:
            label = report['industry']['division']

            if len(label) > 50:
                label = label[:label.rfind(' ', 0, 20)] + ' ...'
            
            try:
                percents[label] += 1
            except:
                percents[label] = 1

    return OrderedDict(percents)
