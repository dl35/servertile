<?php

$f = "/tmp/apic-fr.20191216103000.FPFR42_ATOS_161030" ;
$dir_json = "/meteo/shared/data/msp-apic/shp-data/fr";
$files = scandir('.');

foreach($files as $file) {
    if (  strpos($file ,"json" ) === false ){

        csv2json( $dir_json , "fr" , $file ) ;
    }
        
}




function set_error( $v ) {
echo $v ;

}

function csv2json( $dest , $origine , $file ) {

if( !file_exists($file)  ) {
    set_error("csv2json, file $file not exist");
    return false;
}

$lines = gzfile( $file );
$tdeps = array();
$tcommunes = array();
$first = true ;
$day = "" ;

$controle = 0 ;
$cpt = 0 ;
foreach ($lines as $line  ) {
    $tline = explode(";" , $line ) ;

    if( $first ) {
        if (  count($tline) != 2 ) {
            set_error("csv2json,$file first line count != 2");    
            return false;
        }
        $day = $tline[0];
        $controle = $tline[1];
        $first = false;
        continue ;
    }

    
    
 	// insee
     if ( count($tline) === 6 ) {
        $insee = $tline[0] ;
        $indice = $tline[3] ;
           
        $tinsee = array();
        $tinsee['id'] = $insee ;
        $tinsee['c'] = $indice ;
        $tcommunes[] = $tinsee ;
        $cpt++ ;		
    }
    
    // departements
    else if ( count($tline) === 4 ) {
        $dep = $tline[0] ;
        $indice = $tline[1] ;
        $tmp = array();
        $tmp['id'] = $dep ;
        $tmp['c'] = $indice ;
        $tdeps[] = $tmp;
        $cpt++ ;
    }
    
}	

if( $cpt != $controle ) {
set_error("csv2json , error controle ");
return false;
}


$res = array();
$res['communes'] =  $tcommunes ;
$res['deps'] =  $tdeps ;

$fdest = $dest."/apic-".$origine.".".$day."00.json";

$fp = fopen($fdest, 'w');
fwrite($fp,  json_encode( $res ));
fclose($fp);



return true ;

}


?>