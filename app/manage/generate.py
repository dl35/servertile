import requests
import time
from doxyz import dotiles
from config import BOUNDS,MAX_ZOOM,MIN_ZOOM,NUM_WORKERS
from threading import Thread
import sys

try:
    import Queue as queue
except ImportError:
    import queue
import time




def appendTaskQueries( tiles ):
    for t in tiles:
            query =  'http://127.0.0.1:6300/store/'+str(t['z'])+'/'+str(t['x'])+'/'+str(t['y'])
            task_queue.put( query ) 

def runQuery( query ):
      print( query )
      requests.get( query)
     

def worker():
     while True:
        query = task_queue.get()
        if query is None:
            break
        runQuery( query )
        # Mark the processed task as done
        task_queue.task_done()         




######################################################################################################


tiles = dotiles(BOUNDS, MIN_ZOOM , MAX_ZOOM )
print( tiles )
#sys.exit()

task_queue = queue.Queue()



appendTaskQueries (tiles)
start_time = time.time()
         
# Create the worker threads
threads = [Thread(target=worker) for _ in range(NUM_WORKERS)]

# Start all the workers
[thread.start() for thread in threads]


# Wait for all the tasks in the queue to be processed
task_queue.join()
 
         
end_time = time.time()        
 
print("Time generate: %ssecs" % (end_time - start_time))

# stop workers
for i in range(NUM_WORKERS):
    task_queue.put(None)
for t in threads:
    t.join()