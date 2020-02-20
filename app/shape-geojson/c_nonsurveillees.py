


from collections import OrderedDict
import pprint
import os , csv , json
import sys





c_fr = "/data/nas/data/msp-apic/couverture/couverture-fr.20191022.csv"
c_re = "/data/nas/data/msp-apic/couverture/couverture-re.20161106.csv"
c_ga = "/data/nas/data/msp-apic/couverture/couverture-ga.20170101.csv"
c_ma = "/data/nas/data/msp-apic/couverture/couverture-ma.20170101.csv"
c_nc = "/data/nas/data/msp-apic/couverture/couverture-nc.20190301.csv"

day = "17022020"

################################################################################################    
# format dep -> insee
def doNonSurveilleesfr():


    cns = "/home/denis/workspaceNode/servertile/app/couverture/fr-" + day + ".json"

    res = {}
    with open( c_fr , mode='r' ) as csvfile:
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
            
                l.append( insee[2:6] ) 
                res[dep] = l 
               
               
    print ( str( len(res) ) + " communes non couverte ")    
    with open( cns , 'w') as f:
         json.dump({'list': res }, f)

    f.close()
    #print ( res )
    return  res  


################################################################################################    
# format dep -> insee
def doNonSurveilleesOm( origin ):
    cr = ''
    l = []
    if origin == 're':
        cr = c_re
    elif origin == 'ma':
        cr= c_ma    
    elif origin == 'ga':
        cr= c_ga
    elif origin == 'nc':
        cr= c_nc



    cns = "/home/denis/workspaceNode/servertile/app/couverture/"+origin+"-"+day+".json"

    res = {}
    with open( cr , mode='r' ) as csvfile:
        csv_reader = csv.DictReader( csvfile  , delimiter =';')
      
        for row in csv_reader:
            v = dict( row )
            print ( v ) 
            insee = v['INSEE']
            if len(insee) == 5:
                insee = str(insee) + '0'
            
            if v['COUVERTE'] == '0':
               l.append( insee ) 
               
    print ( str( len(l) ) + " communes non couverte "+ origin )    
    with open( cns , 'w') as f:
         json.dump({'list': l }, f)

    f.close()
    #print ( res )
    return  res 


#################################################################################
def testOrigin(origin) :
  lori= ["fr","re","ga","ma","nc"]
  if (origin in lori):
      return True
  else:
      return False

###############################################################################      

if len(sys.argv) < 2:
    print("Veuillez saisir un argument , fr | re | ga | ma | nc | cns")
    sys.exit()
origin = sys.argv[1]
print( 'origin is ' + origin )

if not testOrigin( origin):
   print("origin not valid")
   sys.exit()

if origin == 'fr':
    doNonSurveilleesfr()
else:
    doNonSurveilleesOm(origin)    
