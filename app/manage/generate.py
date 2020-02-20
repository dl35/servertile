import requests
import time
from doxyz import dotiles
from config import BOUNDS,MAX_ZOOM,MIN_ZOOM,NUM_WORKERS
from config import BOUNDS_RE,MAX_ZOOM_RE,MIN_ZOOM_RE
from config import BOUNDS_GA,MAX_ZOOM_GA,MIN_ZOOM_GA
from config import BOUNDS_MA,MAX_ZOOM_MA,MIN_ZOOM_MA
from config import BOUNDS_NC,MAX_ZOOM_NC,MIN_ZOOM_NC
from config import MAX_ZOOM_CNS,MIN_ZOOM_CNS
from threading import Thread
import sys

try:
    import Queue as queue
except ImportError:
    import queue
import time



def testOrigin(origin) :
  lori= ["fr","re","ga","ma","nc","cns"]
  if (origin in lori):
      return True
  else:
      return False    




def appendTaskQueries( tiles , origin ):
    for t in tiles:
            query =  'http://127.0.0.1:6300/store/'+origin+'/'+str(t['z'])+'/'+str(t['x'])+'/'+str(t['y'])
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
if len(sys.argv) < 2:
    print("Veuillez saisir un argument , fr | re | ga | ma | nc | cns")
    sys.exit()
origin = sys.argv[1]
print( 'origin is ' + origin )

if not testOrigin( origin):
   print("origin not valid")
   sys.exit()
if origin == 'fr':
    tiles = dotiles(BOUNDS, MIN_ZOOM , MAX_ZOOM )
elif  origin == 're':
    tiles = dotiles(BOUNDS_RE, MIN_ZOOM_RE , MAX_ZOOM_RE )
elif  origin == 'ga':
    tiles = dotiles(BOUNDS_GA, MIN_ZOOM_GA , MAX_ZOOM_GA )
elif  origin == 'ma':
    tiles = dotiles(BOUNDS_MA, MIN_ZOOM_MA , MAX_ZOOM_MA )
elif  origin == 'nc':
    tiles = dotiles(BOUNDS_NC, MIN_ZOOM_NC , MAX_ZOOM_NC )
elif  origin == 'cns':
    # communes on couvertes
    tiles = dotiles(BOUNDS, MIN_ZOOM_CNS , MAX_ZOOM_CNS )


task_queue = queue.Queue()



appendTaskQueries (tiles , origin )
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