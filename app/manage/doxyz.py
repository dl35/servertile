import math 

# Generates a list of x/y/z Spherical Mercator tiles based on a bounding box and a zoom level.
# origine code xyz-affair
# tilz size 256  default

R = 6378137 
sphericalScale = 0.5 / ( math.pi * R)



def dotiles(bounds, minZoom, maxZoom):
    min = 0
    max = 0
    tiles = []

    if (maxZoom < minZoom):
        min = maxZoom
        max = minZoom
    else :
        min = minZoom
        max = maxZoom
    z = min 
    while ( z <= max ) :
        #tiles.append( xyz(bounds,z) )
        tiles.extend( xyz(bounds,z) )
        z += 1 
     
    return tiles

def project(lat,lng,zoom):
    d = math.pi  / 180 
    maxi = 1 - 1E-15
    sinus = max( min( math.sin(lat * d), maxi), -maxi)
    scale = 256 * math.pow(2, zoom)

    pt  = point( R * lng * d , R * math.log((1 + sinus) / (1 - sinus)) / 2 )
    pt.x = tiled(scale * (sphericalScale * pt.x + 0.5))
    pt.y = tiled(scale * (-sphericalScale * pt.y + 0.5))

   
    return pt





def tiled(num):
    return math.floor(num/256)

def xyz(bounds,zoom):
    mini = project(bounds[1][1],bounds[0][0], zoom)
#south,east
    maxi = project(bounds[0][1],bounds[1][0], zoom)
    tiles = []

    x = mini.x 
   
    
    while x <= maxi.x: 
        y = mini.y
        while y <= maxi.y:
            dico = { 'x': int(x),'y': int(y) ,'z': zoom }
            tiles.append( dico )
            y += 1
        x += 1
    
    
    return tiles



class point:  
    def __init__(self, x, y):  
        self.x = x  
        self.y = y 