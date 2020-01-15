#!/usr/bin/python
# -*- coding: latin-1 -*-

import fiona
from fiona.crs import from_epsg
from fiona.crs import from_string
from fiona.crs import to_string
from collections import OrderedDict
import pprint
import os , csv , json
from shapely.geometry import shape,mapping,Polygon
from shapely.ops import unary_union,cascaded_union



def info(c):
   #pprint.pprint( c.driver )
   #pprint.pprint( c.crs ) 
   #print(to_string(c.crs))
   print( c.schema)


HOME = os.environ['HOME']

communeShape = "/nas/dmap/dev/install/cdp_2009/data/latlon/commune-a.shp"

tronconShape = "/nas/dev/apic-apocs/shp-apocs/20191007/latlon/troncons.shp"
exutoiresShape = "/nas/dev/apic-apocs/shp-apocs/20191007/latlon/exutoires.shp"

tronconsGeoJson = HOME + "/workspaceNode/servertile/app/geojson/apoc/troncons.geojson"
exutoiresGeoJson = HOME+ "/workspaceNode/servertile/app/geojson/apoc/exutoires.geojson"


couverture = "/nas/dev/apic-apocs/couverture-apoc/couverture-fr.20191007.csv"
nonCouvertesGeoJson = HOME+ "/workspaceNode/servertile/app/geojson/apoc/noncouvertes.geojson"
unionNonCouvertesGeoJson = HOME+"/workspaceNode/servertile/app/geojson/apoc/unionnoncouvertes.geojson"


def deleteFile( file ):
    try:
        os.remove( file  )
    except:
        print("Error delete file ")

#########################################################################
#from pyproj import Proj, transform
#import fiona
#from fiona.crs import from_epsg
#shape = fiona.open('sample.shp')
#original = Proj(shape.crs) # EPSG:4326 in your case
#destination = Proj(init='EPSG:...') # your new EPSG
#with fiona.open('new.shp', 'w', 'ESRI Shapefile', shape.schema.copy(), crs=from_epsg(...)) as output:
#    for feat in shape:
#        long,lat =  feat['geometry']['coordinates']
#        x,y = transform(original, destination,long,lat)
        # change only the coordinates of the feature
#        feat['geometry']['coordinates'] = (x,y)
#        output.write(feat)
##########################################################################
def traiteTroncons():
   deleteFile( tronconsGeoJson )
   with fiona.open( tronconShape ) as entree:
        
        #print ( entree.schema )   
        #print ( entree.crs )  

        oschema_prop = OrderedDict([('id', 'str')])
        oschema = {'geometry': entree.schema['geometry'] , 'properties': oschema_prop }

        with fiona.open( tronconsGeoJson ,'w', driver='GeoJSON' , crs= entree.crs ,schema= oschema ) as sortie:
            
            for elem in entree:
                # conctruction du dictionnaire et sauvegarde 
                geom = elem['geometry'] # puisque c'est la meme geometrie
                id =  elem['properties']['ID']      
                prop = {'id': id }
                sortie.write({'geometry':geom, 'properties': prop})
             
        sortie.close()         
   entree.close()
   print("troncon geojson ok")
   
##############################################################################
def traiteExutoires():
   deleteFile( exutoiresGeoJson )
   with fiona.open( exutoiresShape ) as entree:
        
        #print ( entree.schema )   
        #print ( entree.crs )  

        oschema_prop = OrderedDict([('id', 'str')])
        oschema = {'geometry': entree.schema['geometry'] , 'properties': oschema_prop }

        with fiona.open( exutoiresGeoJson ,'w', driver='GeoJSON' , crs= entree.crs ,schema= oschema ) as sortie:
            
            for elem in entree:
                # conctruction du dictionnaire et sauvegarde 
                geom = elem['geometry'] # puisque c'est la meme geometrie
                id =  elem['properties']['ID']      
                prop = {'id': id }
                sortie.write({'geometry':geom, 'properties': prop})
             
        sortie.close()
   entree.close()
   print("exutoires geojson ok")
   
##################################################################################
def doCouvertureGeojson():
    deleteFile( nonCouvertesGeoJson )
    liste = []
    with open( couverture , mode='r' ) as csvfile:
        csv_reader = csv.DictReader( csvfile  , delimiter =';')
        
        for row in csv_reader:
            v = dict( row )
        
            if v['COUVERTE'] == '0':
                insee = v['INSEE'] #6 chars
                liste.append( insee[0:5] ) 
            
    with fiona.open( communeShape ) as entree:
        
        #print ( entree.schema )  
        #print ( entree.crs )    

        oschema_prop = OrderedDict([('insee', 'str:5')])
        oschema = {'geometry': entree.schema['geometry'] , 'properties': oschema_prop }

        with fiona.open( nonCouvertesGeoJson ,'w', driver='GeoJSON' , crs= entree.crs ,schema= oschema ) as sortie:
            
            for elem in entree:
                # conctruction du dictionnaire et sauvegarde 
                geom = elem['geometry'] # puisque c'est la meme geometrie
                prop = elem['properties'] 
                #creduce = set_precision( geom['coordinates'], 8 ) 
                #geom = {'type': geom['type'] , 'coordinates': creduce  }
                insee = elem['properties']['INSEE']
                if insee in liste:
                    prop = {'insee': insee }
                    sortie.write({'geometry':geom, 'properties': prop})
                
            
    entree.close()
    sortie.close()           
    print("couverture geojson ok")
    return    


############################################################################################################
def doCouvertureUnionNonCouverteGeojson():
    deleteFile( unionNonCouvertesGeoJson )
    listgeo =[]
    
  
    with fiona.open( nonCouvertesGeoJson ) as entree:
         
            for elem in entree:
                geom = elem['geometry'] 
                #insee = elem['properties']['insee'] 
                p1 = shape(geom)
                listgeo.append(p1)
    

    listgeo = cascaded_union(listgeo) 

    oschema_prop = OrderedDict([('id', 'str')])
    oschema = {'geometry': 'Polygon' , 'properties': oschema_prop }
    wgs84 = fiona.crs.from_epsg(4326)


    with fiona.open( unionNonCouvertesGeoJson ,'w', driver='GeoJSON' , crs= wgs84 ,schema= oschema ) as sortie:

                for elem in listgeo:
                    sortie.write({'geometry':mapping(elem) , 'properties':{'id': 'cnc' }  })       
               
    sortie.close()              
    print("union couverture geojson ok")
    return

#######################################################################################################    
traiteTroncons()
traiteExutoires()
doCouvertureGeojson()
doCouvertureUnionNonCouverteGeojson()