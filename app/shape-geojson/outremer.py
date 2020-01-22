
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
from shapely.ops import cascaded_union

def info(c):
   #pprint.pprint( c.driver )
   #pprint.pprint( c.crs ) 
   #print(to_string(c.crs))
   print( c.schema)


reunionShape = "/nas/dmap/dev/install/apic/data/latlon/reunion_infra.shp"
caledonieShape = "/nas/dmap/dev/install/apic/data/latlon/caledonie_commune.shp"
guadeloupeShape = "/nas/dmap/dev/install/apic/data/latlon/guadeloupe_commune.shp"
martiniqueShape = "/nas/dmap/dev/install/apic/data/latlon/martinique_commune.shp"
caledonieShape = "/nas/dmap/dev/install/apic/data/latlon/caledonie_commune.shp"


reunionGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/reunion.geojson"
guadeloupeGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/guadeloupe.geojson"
martiniqueGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/martinique.geojson"
caledonieGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/caledonie.geojson"

####################################################################################################
def deleteFile( file ):
    try:
        os.remove( file  )
    except:
        print("Error delete file ")
#######################################################################################################
def set_precision(coords, precision):
    result = []
    try:
        return round(coords, int(precision))
    except TypeError:
        for coord in coords:
            result.append( set_precision(coord, precision))
    return result
#######################################################################################################
#######################################################################################################
def traiteReunion():
    deleteFile( reunionGeoJson )
    
    with fiona.open( reunionShape ) as entree:
        
        #print ( entree.schema )   
        #print ( entree.crs )  

        oschema_prop = OrderedDict([('id', 'str:6'), ('nom', 'str')])
        oschema = {'geometry': entree.schema['geometry'] , 'properties': oschema_prop }

        with fiona.open( reunionGeoJson ,'w', driver='GeoJSON' , crs= entree.crs ,schema= oschema ) as sortie:
            
            for elem in entree:
                # conctruction du dictionnaire et sauvegarde 
                geom = elem['geometry'] # puisque c'est la meme geometrie
                #prop = elem['properties'] 
                            #creduce = set_precision( geom['coordinates'], 8 ) 
                            #geom = {'type': geom['type'] , 'coordinates': creduce  }
                nom =  elem['properties']['NOM']      
                insee =  elem['properties']['INSEE']  
                if( len(str(insee)) == 5 ):
                    insee = str(insee) + "0"     
                prop = {'id': insee  , 'nom' : nom }
                sortie.write({'geometry':geom, 'properties': prop})
                            #sortie.write( elem )
            
    entree.close()
    sortie.close()
    print("Reunion ok")
#################################################################################################
def traiteGuadeloupe():
    deleteFile( guadeloupeGeoJson )
    
    with fiona.open( guadeloupeShape ) as entree:
        
        #print ( entree.schema )   
        #print ( entree.crs )  

        oschema_prop = OrderedDict([('id', 'str:6'), ('nom', 'str')])
        oschema = {'geometry': entree.schema['geometry'] , 'properties': oschema_prop }

        with fiona.open( guadeloupeGeoJson ,'w', driver='GeoJSON' , crs= entree.crs ,schema= oschema ) as sortie:
            
            for elem in entree:
                # conctruction du dictionnaire et sauvegarde 
                geom = elem['geometry'] # puisque c'est la meme geometrie
                #prop = elem['properties'] 
                            #creduce = set_precision( geom['coordinates'], 8 ) 
                            #geom = {'type': geom['type'] , 'coordinates': creduce  }
                nom =  elem['properties']['NOM']      
                insee =  elem['properties']['INSEE']    
                if( len(str(insee)) == 5 ):
                    insee = str(insee) + "0" 
                prop = {'id': insee  , 'nom' : nom }
                sortie.write({'geometry':geom, 'properties': prop})
                            #sortie.write( elem )
            
    entree.close()
    sortie.close()
    print("Guadeloupe ok")
###################################################################################################    
def traiteMartinique():
    deleteFile( martiniqueGeoJson )
    
    with fiona.open( martiniqueShape ) as entree:
        
        #print ( entree.schema )   
        #print ( entree.crs )  

        oschema_prop = OrderedDict([('id', 'str:6'), ('nom', 'str')])
        oschema = {'geometry': entree.schema['geometry'] , 'properties': oschema_prop }

        with fiona.open( martiniqueGeoJson ,'w', driver='GeoJSON' , crs= entree.crs ,schema= oschema ) as sortie:
            
            for elem in entree:
                # conctruction du dictionnaire et sauvegarde 
                geom = elem['geometry'] # puisque c'est la meme geometrie
                #prop = elem['properties'] 
                            #creduce = set_precision( geom['coordinates'], 8 ) 
                            #geom = {'type': geom['type'] , 'coordinates': creduce  }
                nom =  elem['properties']['NOM']      
                insee =  elem['properties']['INSEE']   
                if( len(str(insee)) == 5 ):
                    insee = str(insee) + "0"    
                prop = {'id': insee  , 'nom' : nom }
                sortie.write({'geometry':geom, 'properties': prop})
                            #sortie.write( elem )
            
    entree.close()
    sortie.close()
    print("Martinique ok")

#######################################################################################################
def traiteCaledonie():
    deleteFile( caledonieGeoJson )
    
    with fiona.open( caledonieShape ) as entree:
        
        #print ( entree.schema )   
        #print ( entree.crs )  

        oschema_prop = OrderedDict([('id', 'str:6'), ('nom', 'str')])
        oschema = {'geometry': entree.schema['geometry'] , 'properties': oschema_prop }

        with fiona.open( caledonieGeoJson ,'w', driver='GeoJSON' , crs= entree.crs ,schema= oschema ) as sortie:
            
            for elem in entree:
                # conctruction du dictionnaire et sauvegarde 
                geom = elem['geometry'] # puisque c'est la meme geometrie
                #prop = elem['properties'] 
                            #creduce = set_precision( geom['coordinates'], 8 ) 
                            #geom = {'type': geom['type'] , 'coordinates': creduce  }
                nom =  elem['properties']['NOM']      
                insee =  elem['properties']['INSEE']
                if( len(str(insee)) == 5 ):
                    insee = str(insee) + "0"       
                prop = {'id': insee  , 'nom' : nom }
                sortie.write({'geometry':geom, 'properties': prop})
                            #sortie.write( elem )
            
    entree.close()
    sortie.close()
    print("Caledonie ok")
##############################################################################################

traiteReunion()
traiteGuadeloupe()
traiteMartinique()
traiteCaledonie()



# definition des fonctions de calcul
# import math
# sind = lambda x: math.cos( math.radians(x))
# cosd = lambda x: math.cos( math.radians(x))
# definition du schema du nouveau shapefile
# schema = {'geometry': 'Point', 'properties': {'dip' : 'int:2', 'dip_dir' :'int:3', 'cosa': 'float:11.4','sina':'float:11.4'}}
# definition du crs du nouveau shapefile
# crs = from_epsg(31370) # ou en reprenant simplement le crs du shapefile en entree, comme dans la suite
# je le remplis avec le dictionnaire