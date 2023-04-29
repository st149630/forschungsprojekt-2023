import os
import json
files = [f for f in os.listdir('.') if os.path.isfile(f)]
json_data = []
for f in files:
    if (f.endswith('json')):
        of = open(os.path.abspath(os.getcwd()) +'\\' + f, 'r')
        data = json.load(of)
        json_data.append(data)
result = {}
for data in json_data:
    if (data[0]['eyetracker'] not in result.keys()):
        result[data[0]['eyetracker']] = []
    for pos in data:
        hit = False
        for i,_pos in enumerate(result[data[0]['eyetracker']]):
            if (pos['position'] == _pos['position']):
                print(pos['position'])
                print(_pos['position'])
                print(i)
                result[data[0]['eyetracker']][i]['data'].append(pos['data'])
                hit = True
        if not hit:
            result[data[0]['eyetracker']].append({'position': pos['position'], 'data': pos['data']})
            
    for pos in result[data[0]['eyetracker']]:
        print(pos['position'])
json_object = json.dumps(result, indent=4)

# Writing to sample.json
with open("data.json", "w") as outfile:
    outfile.write(json_object)

