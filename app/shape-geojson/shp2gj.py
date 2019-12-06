#!/usr/bin/python
# -*- coding: latin-1 -*-

import sys, os, time, fcntl, csv
from osgeo import ogr , osr

daShapefile = r"/home/denis/workspaceNode/servertile/cours_deau/paot_ctxt_cours_deau.shp"
dataSource = ogr.Open(daShapefile )
daLayer = dataSource.GetLayer(0)
layerDefinition = daLayer.GetLayerDefn()


for i in range(layerDefinition.GetFieldCount()):
    fieldName =  layerDefinition.GetFieldDefn(i).GetName()
    fieldTypeCode = layerDefinition.GetFieldDefn(i).GetType()
    fieldType = layerDefinition.GetFieldDefn(i).GetFieldTypeName(fieldTypeCode)
    fieldWidth = layerDefinition.GetFieldDefn(i).GetWidth()
    GetPrecision = layerDefinition.GetFieldDefn(i).GetPrecision()

    #print fieldName + " - " + fieldType+ " " + str(fieldWidth) + " " + str(GetPrecision)

print daLayer