#!/usr/bin/python
# -*- coding: latin-1 -*-

import sys, os, time, fcntl, csv
from dmap import *
from ogrutils import *
from osgeo import ogr, osr
from re import compile
from simplejson.compat import StringIO
import geojson, json
os.chdir(execution_path('.'))

###############################################################################

encoder = json.JSONEncoder(separators=(',', ':'))
float_pat = compile(r'^-?\d+\.\d+(e-?\d+)?$')
charfloat_pat = compile(r'^[\[,\,]-?\d+\.\d+(e-?\d+)?$')
format = '%.4f'

###############################################################################

def process_departements():
    file_src = "/nas/dmap/dev/data/latlon/cdp_2009/dep-a.shp"
    file_dst = "./departements.json"
    
    begin_progress("process departements\t")

    csv = load_csv("/nas/dmap/dev/install/cdp_2009/src/deps.csv")
        
    data_src, layer_src = open_datasource(file_src)
    spatialReference = layer_src.GetSpatialRef()
    proj_src = spatialReference.ExportToProj4() if spatialReference else '' or proj_src
    index_dep = get_field_indexs(layer_src, "DEP")
        
    file = open(file_dst, 'w') 
    file.write('{"type":"FeatureCollection","features":[\n')
    
    fcpt = 0
    fcount = layer_src.GetFeatureCount()
    for index in xrange(fcount):
        feature = layer_src.GetFeature(index)
        geometry = feature.GetGeometryRef()
        fid = feature.GetFID()
        dep = feature.GetFieldAsString(index_dep)
        if dep not in csv:
            raise ShapeDataError(dep + " must be in csv file")
        nom = csv[dep]['NOM'].decode("utf-8")
    
        g = geojson.loads(geometry.ExportToJson())
        f = geojson.Feature(geometry=g, properties={ 'DEP': dep, 'NAME': nom }) 
        data = geojson.dumps(f)

        data = json.load(StringIO(data))
        encoded = encoder.iterencode(data)
        for token in encoded:
            if charfloat_pat.match(token):
                file.write(token[0] + format % float(token[1:]))
            elif float_pat.match(token):
                file.write(format % float(token))
            else:
                file.write(token)
     
        if index < fcount-1: file.write(',')     

        feature.Destroy()
        
        fcpt += 1
        pc = float(fcpt) / float(fcount) * 100.0
        set_progress(pc)
       
    file.write(']}')
    file.close()
    end_progress()

###############################################################################

def process_communes():
    file_src = "/nas/dmap/dev/data/latlon/cdp_2009/commune-a.shp"
    file_dst = "./communes.json"
    
    begin_progress("process communes\t")

    csv = load_csv("/nas/dmap/dev/install/cdp_2009/src/communes.csv")
        
    data_src, layer_src = open_datasource(file_src)
    spatialReference = layer_src.GetSpatialRef()
    proj_src = spatialReference.ExportToProj4() if spatialReference else '' or proj_src
    index_insee = get_field_indexs(layer_src, "INSEE")
        
    file = open(file_dst, 'w') 
    file.write('{"type":"FeatureCollection","features":[\n')
    
    fcpt = 0
    fcount = layer_src.GetFeatureCount()
    for index in xrange(fcount):
        feature = layer_src.GetFeature(index)
        geometry = feature.GetGeometryRef()
        fid = feature.GetFID()
        insee = feature.GetFieldAsString(index_insee)
        if insee not in csv:
            raise ShapeDataError(insee + " must be in csv file")
        nom = csv[insee]['NOM'].decode("utf-8")
        cp = csv[insee]['CP']
       
        g = geojson.loads(geometry.ExportToJson())
        f = geojson.Feature(geometry=g, properties={ 'INSEE': insee, 'NAME': nom, 'CP': cp}) 
        data = geojson.dumps(f)

        data = json.load(StringIO(data))
        encoded = encoder.iterencode(data)
        for token in encoded:
            if charfloat_pat.match(token):
                file.write(token[0] + format % float(token[1:]))
            elif float_pat.match(token):
                file.write(format % float(token))
            else:
                file.write(token)
     
        if index < fcount-1: file.write(',')     

        feature.Destroy()
        
        fcpt += 1
        pc = float(fcpt) / float(fcount) * 100.0
        set_progress(pc)
       
    file.write(']}')
    file.close()
    end_progress()

###############################################################################

def process_troncons():
    file_src = "/nas/dmap/dev/install/apoc/data/latlon/troncons.shp"
    file_dst = "./troncons.json"
    
    begin_progress("process troncons\t")

    # csv = load_csv("/nas/dmap/dev/install/cdp_2009/src/communes.csv")
        
    data_src, layer_src = open_datasource(file_src)
    spatialReference = layer_src.GetSpatialRef()
    proj_src = spatialReference.ExportToProj4() if spatialReference else '' or proj_src
    index_id = get_field_indexs(layer_src, "ID")
        
    file = open(file_dst, 'w') 
    file.write('{"type":"FeatureCollection","features":[\n')
    
    fcpt = 0
    fcount = layer_src.GetFeatureCount()
    for index in xrange(fcount):
        feature = layer_src.GetFeature(index)
        geometry = feature.GetGeometryRef()
        fid = feature.GetFID()
        id = feature.GetFieldAsString(index_id)
        # if insee not in csv:
        #     raise ShapeDataError(insee + " must be in csv file")
        # nom = csv[insee]['NOM'].decode("utf-8")
        # cp = csv[insee]['CP']
       
        g = geojson.loads(geometry.ExportToJson())
        f = geojson.Feature(geometry=g, properties={ 'ID': id }) 
        data = geojson.dumps(f)

        data = json.load(StringIO(data))
        encoded = encoder.iterencode(data)
        for token in encoded:
            if charfloat_pat.match(token):
                file.write(token[0] + format % float(token[1:]))
            elif float_pat.match(token):
                file.write(format % float(token))
            else:
                file.write(token)
     
        if index < fcount-1: file.write(',')     

        feature.Destroy()
        
        fcpt += 1
        pc = float(fcpt) / float(fcount) * 100.0
        set_progress(pc)
       
    file.write(']}')
    file.close()
    end_progress()

###############################################################################

try:
    # process_departements()
    process_communes()
    # process_troncons()

except Exception as e:
    print e