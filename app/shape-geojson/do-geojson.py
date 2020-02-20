import fiona
from fiona.crs import from_epsg
from fiona.crs import from_string
from fiona.crs import to_string
from collections import OrderedDict
import pprint
import os , csv , json
from shapely.geometry import shape,mapping,Polygon
from shapely.ops import unary_union,cascaded_union
import sys


def info(c):
   #pprint.pprint( c.driver )
   #pprint.pprint( c.crs ) 
   #print(to_string(c.crs))
   print( c.schema)






folderGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/apic"


#communeShape = "/home/denis/Download/APIC/COMMUNES_APIC202001_WGS84/mycommunes.shp"
#communeShape = "/home/denis/Download/APIC/COMMUNES_APIC202001_WGS84/communes_apic_202001.shp"
#communeShape = "/nas/dmap/dev/install/cdp_2009/data/latlon/commune-a.shp"

communeShape = "/home/denis/Download/APIC/ref/mycommunes.shp"


communesCsv = "/nas/dmap/dev/install/cdp_2009/src/communes.csv"

depShape = "/nas/dmap/dev/install/cdp_2009/data/latlon/dep-a.shp"
#depGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/dep.geojson"
depCsv = "/nas/dmap/dev/install/cdp_2009/src/deps.csv"

couverture = "/nas/dev/apic-apocs/couverture-apic/couverture-fr.20191022.csv"

#noncouverte = "/home/denis/workspaceNode/servertile/app/map/noncouverte.json"
#nonCouvertesGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/noncouvertes.geojson"
#filterNonCouvertesGeoJson = "/home/denis/workspaceNode/servertile/app/geojson/noncouvertesfilter.geojson"



####################################################################################################
def deleteFile( file ):
    try:
        os.remove( file  )
    except:
        print("Error delete file ")


####################################################################################################
# union de plygones non couvertes...
def doCommunesNonSurveillees():
    file = folderGeoJson +"/"+"nonsurveillees.geojson"
    deleteFile( file )
    print(file)
    liste = []
    listgeo = []
    with open( couverture , mode='r' ) as csvfile:
        csv_reader = csv.DictReader( csvfile  , delimiter =';')
        
        for row in csv_reader:
            v = dict( row )
        
            if v['COUVERTE'] == '0':
                vinsee = v['INSEE'] #sur 6 chars
                liste.append( vinsee ) 

    
    with fiona.open( communeShape ) as entree:
        for elem in entree:
            insee = elem['properties']['INSEE_COM']
            insee = insee + "0"
            if insee in liste:
            
                geom = elem['geometry'] 
                p1 = shape(geom)
               
                if p1.is_valid :
                   listgeo.append(p1)
    listgeo = cascaded_union(listgeo)  
    

    oschema_prop = OrderedDict([('id', 'str')])
    oschema = {'geometry': 'Polygon' , 'properties': oschema_prop }
    wgs84 = fiona.crs.from_epsg(4326)

    with fiona.open( file ,'w', driver='GeoJSON' , crs= wgs84 ,schema= oschema ) as sortie:
                i=0

                for elem in listgeo:
                    elem = elem.simplify(0.0005, preserve_topology=True)
                    sortie.write({'geometry':mapping(elem) , 'properties':{'id': 'cnc' }  })       

                    i = i+1     
    sortie.close()              

    return




####################################################################################################
def doCommunesFr():
    file = folderGeoJson +"/"+"communes.geojson"
    deleteFile( file )
    print(file)
    
    with fiona.open( communeShape ) as entree:
        
      
        oschema_prop = OrderedDict([('id', 'str:6'),('nom', 'str')])
        oschema = {'geometry': entree.schema['geometry'] , 'properties': oschema_prop }

        with fiona.open( file ,'w', driver='GeoJSON' , crs= entree.crs ,schema= oschema ) as sortie:
            
            for elem in entree:
                # conctruction du dictionnaire et sauvegarde 
                geom = elem['geometry'] # puisque c'est la meme geometrie
                insee = elem['properties']['INSEE_COM']
                nom = elem['properties']['NOM_COM']
                nom = nom.encode('utf-8').strip()
                #nom = nom.decode('ascii','ignore').strip()
                dep = elem['properties']['INSEE_DEP']
                
                if( len(str(dep)) > 2 ): 
                     continue

                if( len(str(insee)) == 5 ):
                    insee = str(insee) + "0"
                prop = {'id': insee ,'nom' : nom }
                sortie.write({'geometry':geom, 'properties': prop})
                #sortie.write( elem )
            
    entree.close()
    sortie.close()
    print( file +" ok ")
####################################################################################################
def doCommunesOm(code):
    file = ""   
    if code == '971':
         file = folderGeoJson +"/"+"guadeloupe.geojson"
    elif code == '972':
         file = folderGeoJson +"/"+"martinique.geojson"    
    elif code == '973' :
         file = folderGeoJson +"/"+"guyane.geojson"    
    elif code == '974' :
         file = folderGeoJson +"/"+"reunion.geojson"    
    elif code == '988' :
            file = folderGeoJson +"/"+"caledonie.geojson"    

    if not file:
        print( "file is empty...")
        sys.exit()

    deleteFile( file )
    print( file )
    
    with fiona.open( communeShape ) as entree:
        
        #print ( entree.schema )   

        oschema_prop = OrderedDict([('id', 'str:6'),('nom', 'str')])
        oschema = {'geometry': entree.schema['geometry'] , 'properties': oschema_prop }

        with fiona.open( file ,'w', driver='GeoJSON' , crs= entree.crs ,schema= oschema ) as sortie:
            
            for elem in entree:
                # conctruction du dictionnaire et sauvegarde 
                geom = elem['geometry'] # puisque c'est la meme geometrie
                insee = elem['properties']['INSEE_COM']
                nom = elem['properties']['NOM_COM']
                nom = nom.encode('utf-8').strip()
                #nom = nom.decode('ascii','ignore').strip()
                dep = elem['properties']['INSEE_DEP']
               
                if( (str(dep)) != code ): 
                     continue

                if( len(str(insee)) == 5 ):
                    print (insee)
                    insee = str(insee) + "0"
                prop = {'id': insee ,'nom' : nom }
                sortie.write({'geometry':geom, 'properties': prop})
                #sortie.write( elem )
            
    entree.close()
    sortie.close()
####################################################################################################




doCommunesFr()
doCommunesOm('971')
doCommunesOm('972')
doCommunesOm('974')
doCommunesOm('988')
doCommunesNonSurveillees()