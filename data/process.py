import injuries

reports = injuries.get_reports(True)
states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']

def get_state_counts():
    counts = {state: 0 for state in states}

    for report in reports:
        state = report['address']['state']

        if state in states:
            counts[state] += 1

    return sorted([{'name': key, 'count': counts[key]} for key in counts], key = lambda x: x['name'])
    
