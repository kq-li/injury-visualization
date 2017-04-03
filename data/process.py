import injuries
import csv
from collections import OrderedDict

reports = injuries.get_reports(True)
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

def get_injury_fractions():
    counts = get_injury_counts()
    populations = get_populations()

    for state in states:
        counts[state] = int(counts[state] * 10000000.0 / populations[state])

    print counts
        
    return counts
    
def average(L):
    return sum(L) / len(L) if len(L) > 0 else 0
    
def get_average_leave():
    counts = OrderedDict([(state, []) for state in states])

    for report in reports:
        state = report['address']['state']

        if state in states:
            counts[state].append(report['statistics']['days away'])

    for state in counts:
        counts[state] = average(counts[state])

    return counts

