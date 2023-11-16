import os
import re

IFCONFIG = os.popen('ifconfig').read()
START_SEARCH_PHRASE = 'inet '
END_SEARCH_PHRASE = '  netmask'

start_ipListIndexes = [index.end() for index in re.finditer(START_SEARCH_PHRASE, IFCONFIG)]
end_ipListIndexes = [index.start() for index in re.finditer(END_SEARCH_PHRASE, IFCONFIG)]

ips = []

i = 0
while i < len(start_ipListIndexes):
    ips.append(IFCONFIG[start_ipListIndexes[i]:end_ipListIndexes[i]])
    i += 1

os.system(f'python src/manage.py runserver {ips[-1]}:8000')