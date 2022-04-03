#!/usr/bin/env python3

import json
import requests

f = open('reqs.json')
 
# Read in the current file -- this will be overwritten
oldreqs = json.load(f)

link = "https://raw.githubusercontent.com/microsoft/api-guidelines/vNext/azure/Guidelines.md"
response = requests.get(link)

lines = response.text.splitlines()

reqlines = [x for x in lines if x.startswith(':white_check_mark:') or x.startswith(':no_entry:')]

reqs = []

for reqline in reqlines:
    oldreq = next((x for x in oldreqs if x['reqline'] == reqline), None)
    if oldreq is not None:
        reqs.append(oldreq)
    else:
        reqs.append({ 'reqline': reqline })

with open('reqs.json', 'w') as outfile:
    json.dump(reqs, outfile, indent=2)
