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
    print(data)
    if (data[0]['eyetracker'] not in result.keys()):
        result[data[0]['eyetracker']] = []
    for pos in data:
        for _pos in result[data[0]['eyetracker']]:
            if (pos['position'] == _pos['position']):
                print(result[data[0]['eyetracker']])
                result[data[0]['eyetracker']]['data'].append(pos['data'])
                break
        result[data[0]['eyetracker']].append({'position': pos['position'], 'data': pos['data']})
            
            
json_object = json.dumps(result, indent=4)

# Writing to sample.json
with open("data.json", "w") as outfile:
    outfile.write(json_object)

