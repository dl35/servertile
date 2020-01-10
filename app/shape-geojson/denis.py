
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




communeShape = "/nas/dmap/dev/install/cdp_2009/data/latlon/commune-a.shp"
communesGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/communes.geojson"
nonCouvertesGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/noncouvertes.geojson"

filterNonCouvertesGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/noncouvertesfilter.geojson"

communesCsv = "/nas/dmap/dev/install/cdp_2009/src/communes.csv"

depShape = "/nas/dmap/dev/install/cdp_2009/data/latlon/dep-a.shp"
depGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/dep.geojson"
depCsv = "/nas/dmap/dev/install/cdp_2009/src/deps.csv"

couverture = "/nas/dev/apic-apocs/couverture-apic/couverture-fr.20190312.csv"

noncouverte = "/home/denis/workspaceNode/servertile/app/map/noncouverte.json"
noncouverte2 = "/home/denis/workspaceNode/servertile/app/map/noncouverte2.json"


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
def doCouverture():
    res = []
    with open( couverture , mode='r' ) as csvfile:
        csv_reader = csv.DictReader( csvfile  , delimiter =';')
        
        for row in csv_reader:
            v = dict( row )
            
            if v['COUVERTE'] == '0':
                insee = v['INSEE'] #6 chars
                print( insee , v['COUVERTE'] )
                res.append( insee[:-1] )  #on garde 5 chars
               
               
    print ( str( len(res) ) + " communes non couverte ")    
    with open( noncouverte , 'w') as f:
         json.dump({'list': res }, f)

    f.close()
    print ( res )
    return  res
################################################################################################    
# format dep -> insee
def doCouverture2():
    res = {}
    with open( couverture , mode='r' ) as csvfile:
        csv_reader = csv.DictReader( csvfile  , delimiter =';')
        
        for row in csv_reader:
            v = dict( row )
            dep = v['INSEE']
            dep = dep[:2]

            if v['COUVERTE'] == '0':
                insee = v['INSEE'] #6 chars
                if dep in res:
                   l = res[dep] 
                else :
                    l = []   
            
                l.append( insee[2:5] ) 
                res[dep] = l 
               
               
    print ( str( len(res) ) + " communes non couverte ")    
    with open( noncouverte2 , 'w') as f:
         json.dump({'list': res }, f)

    f.close()
    print ( res )
    return  res  
######################################################################################################
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
        
        print ( entree.schema )  
        print ( entree.crs )    

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
                #sortie.write( elem )
            
    entree.close()
    sortie.close()           
               
    
    print ( liste )
    return  liste        
#######################################################################################################
def intersectionNonCouverteGeojson():
    deleteFile( filterNonCouvertesGeoJson )
    listgeo =[]
  
    with fiona.open( nonCouvertesGeoJson ) as entree:
            print("len: "+ str(len(entree)) )  
  
            i = 0  
            for elem in entree:
                print("i " + str(i) )
                i=i+1
                geom = elem['geometry'] 
                p1 = shape(geom)
                if not listgeo:
                    listgeo.append(geom) 
                    continue     

                ok = False
                for geo in listgeo:
                    p2 = shape(geo)
                    if p1.intersects(p2):
                       p = p1.union(p2) 
                       listgeo.remove( geo )
                       listgeo.append(mapping(p))
                       ok = True
                       break
                      
                if not ok :
                    listgeo.append(geom) 
                    print("listgeo: "+ str(len(listgeo)) ) 
           
    oschema_prop = OrderedDict([('id', 'str')])
    oschema = {'geometry': 'Polygon' , 'properties': oschema_prop }
    wgs84 = fiona.crs.from_epsg(4326)


    with fiona.open( filterNonCouvertesGeoJson ,'w', driver='GeoJSON' , crs= wgs84 ,schema= oschema ) as sortie:
                i=0
                for elem in listgeo:
                    sortie.write({'geometry':elem , 'properties':{'id': str(i) }  })       
                    i = i+1     
    sortie.close()              

    return
#######################################################################################################
# 
def intersectionNonCouverteGeojson2():
    deleteFile( filterNonCouvertesGeoJson )
    listgeo =[]
    
  
    with fiona.open( nonCouvertesGeoJson ) as entree:
            print("len: "+ str(len(entree)) )  
  
            i = 0  

            for elem in entree:
                #print("i " + str(i) )
                i=i+1
                geom = elem['geometry'] 
                insee = elem['properties']['insee'] 
                p1 = shape(geom)
                listgeo.append(p1)
    

    listgeo = cascaded_union(listgeo) 


    oschema_prop = OrderedDict([('id', 'str')])
    oschema = {'geometry': 'Polygon' , 'properties': oschema_prop }
    wgs84 = fiona.crs.from_epsg(4326)


    with fiona.open( filterNonCouvertesGeoJson ,'w', driver='GeoJSON' , crs= wgs84 ,schema= oschema ) as sortie:
                i=0
                for elem in listgeo:
                    sortie.write({'geometry':mapping(elem) , 'properties':{'id': 'cnc' }  })       
                    i = i+1     
    sortie.close()              

    return
   
#######################################################################################################
def readDepCsv():
    res = {}
    with open( depCsv , mode='r' ) as csvfile:
        csv_reader = csv.DictReader( csvfile  , delimiter =';')
        
        for row in csv_reader:
            # DEP;NOM;NOMMAJ,ARTICLE;LIMITROPHES
            v = dict( row )
            dep =  v['DEP'] 
            nom =  v['NOMMAJ'] 
            res[dep] = nom 
   
    return  res
#######################################################################################################
    
#######################################################################################################
def traiteDepartements():
    deleteFile( depGeoJson )
    deps = readDepCsv()
    with fiona.open( depShape ) as entree:
        
        print ( entree.schema )   
        print ( entree.crs )  

        oschema_prop = OrderedDict([('dep', 'str:2'), ('nom', 'str')])
        oschema = {'geometry': entree.schema['geometry'] , 'properties': oschema_prop }

        with fiona.open( depGeoJson ,'w', driver='GeoJSON' , crs= entree.crs ,schema= oschema ) as sortie:
            
            for elem in entree:
                # conctruction du dictionnaire et sauvegarde 
                geom = elem['geometry'] # puisque c'est la meme geometrie
                prop = elem['properties'] 
                            #creduce = set_precision( geom['coordinates'], 8 ) 
                            #geom = {'type': geom['type'] , 'coordinates': creduce  }
                dep =  elem['properties']['DEP']      
                nom = deps[ dep ]             
                prop = {'dep': dep  , 'nom' : nom }
                sortie.write({'geometry':geom, 'properties': prop})
                            #sortie.write( elem )
            
    entree.close()
    sortie.close()
#################################################################################################
def readCommunesCsv():
    res = {}
    with open( communesCsv , mode='r' ) as csvfile:
        csv_reader = csv.DictReader( csvfile  , delimiter =';')
        
        for row in csv_reader:
            # INSEE;NOM;NOMMAJ,ARTICLE1;LIMITROPHES
            v = dict( row )
            insee =  v['INSEE'] 
            art =  v['ARTICLE1'] 
            nom =  v['NOMMAJ'] 
            if len(art) == 0:
                nom = art+' '+nom 
            res[insee] = nom 
   
    return  res
###################################################################################################    
def traiteCommunes():
    deleteFile( communesGeoJson )
    communes = readCommunesCsv()
    with fiona.open( communeShape ) as entree:
        
        print ( entree.schema )   

        oschema_prop = OrderedDict([('insee', 'str:5'),('nom', 'str')])
        oschema = {'geometry': entree.schema['geometry'] , 'properties': oschema_prop }

        with fiona.open( communesGeoJson ,'w', driver='GeoJSON' , crs= entree.crs ,schema= oschema ) as sortie:
            
            for elem in entree:
                # conctruction du dictionnaire et sauvegarde 
                geom = elem['geometry'] # puisque c'est la meme geometrie
                prop = elem['properties'] 
                #creduce = set_precision( geom['coordinates'], 8 ) 
                #geom = {'type': geom['type'] , 'coordinates': creduce  }
                insee = elem['properties']['INSEE']
                nom = communes[insee]
                prop = {'insee': insee ,'nom' : nom }
                sortie.write({'geometry':geom, 'properties': prop})
                #sortie.write( elem )
            
    entree.close()
    sortie.close()

#######################################################################################################

#readDepCsv()
#doCouverture2()
#traiteDepartements()
#traiteCommunes()

#doCouvertureGeojson()
intersectionNonCouverteGeojson2()



# definition des fonctions de calcul
# import math
# sind = lambda x: math.cos( math.radians(x))
# cosd = lambda x: math.cos( math.radians(x))
# definition du schema du nouveau shapefile
# schema = {'geometry': 'Point', 'properties': {'dip' : 'int:2', 'dip_dir' :'int:3', 'cosa': 'float:11.4','sina':'float:11.4'}}
# definition du crs du nouveau shapefile
# crs = from_epsg(31370) # ou en reprenant simplement le crs du shapefile en entree, comme dans la suite
# je le remplis avec le dictionnaire