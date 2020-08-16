/**
 * BackEnd app Logic
 * 
 * functions (specific for this App)
 * getSheetUrl //trick per ottenere la url del file indicato dal chiamante
 * getFolderUrl //trick per ottenere la url del folder  da aprire nel browser (relativo al game selezionato)
 * gsArrayReadTable(qry)//lancia la query specificata nel database maoAmm
 * gsUpdateRecord(db, table, values)//aggiornamento di tabella
 * gsGameCreate (gameValues,idAppFolder, templates)//creazione di Game su gDrive e su database
 */

function getSheetUrl(codiceGame, folderId, fileNameValue, sheetName){

  //get with a trick the specified file url
  
  //vedi la funzione getFolderUrl 
  //fileName=nome del file da aprire
  //------- vedi test4 
  // recupera id del folder relativo al game con codice == codiceGame  
    //init
  console.log('in getSheetUrl');
  let folderGame=DriveApp.getFolderById(folderId);
  let folders=folderGame.getFolders();
  
  //loop 1 ricerca folder
  while (folders.hasNext()) {
    var folder = folders.next();
    let folderName=folder.getName();
    let folderId=folder.getId();
    let folderUrl=folder.getUrl();
    //console.log(folderId+' la url relativa e '+folderUrl);//test
    //test on codiceGame  and action
    let inizioNomeGame = folderName.substring(0, 5);//primi 5 caratteri del nome del folder desiderato
    
    if(inizioNomeGame==codiceGame){
      let folderGameId=folderId;
      console.log (folderUrl);
      console.log('trovato folder '+folderName+'url= '+folderUrl);
      // break; perchè perde il valore di folderUrl se esco dal ciclo???      
      //codice aggiuntivo per ricerca url del file da usare
      let files=folder.getFiles();
      
      //loop 2 ricerca files
      while (files.hasNext()) {
        var file = files.next();
        let fileName=file.getName();
        //seleziono il file 'controlloProcesso'
        if (fileName==fileNameValue){
          let fileUrl=file.getUrl();
          let ss=SpreadsheetApp.openByUrl(fileUrl);
          let ssUrl=ss.getUrl();
          console.log('ssurl =  '+ssUrl); 

        //choosing  sheet doesn't work up to now
          if (sheetName=='log&todo'){   
            ss.setActiveSheet(ss.getSheets()[0]);  
            return ssUrl;
          }else if (sheetName=='gestioneDoc'){
            ss.setActiveSheet(ss.getSheets()[1]); 
            return ssUrl; 
          }   //end 2nd if condition       
        return ssUrl;
        } //end 1st if condition    
    
   
      }//end while loop 2 (internal)
    }
  //vorrei tornare la funzione da qui, ma da errore!! 
  }//end while loop 1 

//semplifica con getFolderUrl!! e attiva la apertura dello ss sullo ssheet indicato

}




 /********************/
function getFolderUrl(codiceGame, folderId){
  //get with a trick the specified game folder url
  
  //ottieni  id  del folder relativo al codiceGame passato 
  //folderId=id del folder Games hc passato dal chiamante
  //------- vedi test4 
  
  
  // recupera id del folder relativo al game con codice == codiceGame  
    //init
  let folderGame=DriveApp.getFolderById(folderId);
  let folders=folderGame.getFolders();
  
  while (folders.hasNext()) {
    var folder = folders.next();
    let folderName=folder.getName();
    let folderId=folder.getId();
    let folderUrl=folder.getUrl();
    console.log(folderId+' la url relativa e '+folderUrl);
    //test on codiceGame  and action
    let inizioNomeGame = folderName.substring(0, 5);//primi 5 caratteri del nome del folder desiderato
    
    if(inizioNomeGame==codiceGame){
      let folderGameId=folderId;
      console.log (folderUrl);
      console.log('trovato folder '+folderName+'url= '+folderUrl);
      // break; perchè perde il valore di folderUrl se esco dal ciclo???
      return folderUrl;
    }
  }
  //vorrei tornare la funzione da qui, ma da errore!!

/* developer notes*/
/*  parti di codice di questa funzione sono riusati in getSheetUrl.
-------semplificare!


*/ 

}

/* ************************* *//* ************************* */





function gsArrayReadTable(db,qry){
  console.log('in gsarrayReadTable func');
  //console.log(db);
  //console.log(qry);
  let arrDbaseAccess=[0,'51.75.24.140','maosoft','Ingmazza_61',db];//param,ip,user.pwd.dbase.....
  let dbObj=new Crud(arrDbaseAccess);//using db maosoft classes!
  let dbName=dbObj.getDatabaseName();
  //console.log(dbName);

  let data=dbObj.getArrayDataFromQuery(qry);
  //console.log(data);
  console.log('out from gsarrayReadTable func');
  return data;
}

/* ************************* */


function gsUpdateRecord(db, table, values){
  //values[0]=id record da aggiornare

  console.log('in gsUpdateRecord func');
  console.log('dati trasmessi'+values);
  console.log('db= '+db);
  console.log('table= '+table);

  let arrDbaseAccess=[0,'51.75.24.140','maosoft','Ingmazza_61',db];//param,ip,user.pwd.dbase.....
  let dbObj=new Crud(arrDbaseAccess);//using db maosoft classes!
  //qry built inside method of the class

  let data=dbObj.updateDataFromValues(table, values);
  //console.log(data);
  console.log('out gsUpdateRecord func');
  return data;
}

function gsGameCreate(appValues, idAppFolder, templates){
  /**
   * create a new game record on table 'games' and, after,
   * create a new folder with templates files inside
   * 
   * @param appValues (arr) array con i dati del nuovo game (app)
   * @param idAppFolder (str) id del folder che contiene i games
   * @param templates (arr) array con gli id dei template da utilizzare
   * i dati per la creazione del folder e la copia dei files template sono 
   * hard coded nella funzione coniugata lato fe.
   * i dati per l'accesso al database e alla tabella di lavoro sono hc nella funzione
  */
  console.log('in gsCreateGame func');//test
  console.log('dati trasmessi 1'+appValues+' 2'+idAppFolder+ ' 3'+templates);//test
  
  //fase 1: crea nuovo record su tabella db specificata
  //inizializza connessione al database istanziando la Classe Crud
  let arrDbaseAccess=[0,'51.75.24.140','maosoft','Ingmazza_61','cmaTec'];//param,ip,user.pwd.dbase.....
  let dbObj=new Crud(arrDbaseAccess);//using db maosoft classes!
  
  //utilizza il metodo della classe Crud per nuovo record  con valori appValues sulla tabella games specificata
  let flagCreateOpStatus=dbObj.createRecord('games', appValues); //status operazione di creazione record
  
  //gestione errori creazione record
  //--- da fare
  
  
  //fase 2: crea folder e carica template
  //building folder name
  let nomeCompletoFolder=appValues[0]+'_'+appValues[1];
  
  //create folder
  let resultFolder=gsCreateAppFolder(idAppFolder, nomeCompletoFolder, templates);
  
  //gestione errori creazione folder
  
  //end function
  let resultValues =[resultFolder,flagCreateOpStatus];
  console.log('out gsUpdateRecord func');
  console.log(resultValues);
  return resultValues
}

function gsOffertaCreate(appValues, idAppFolder, templates){
  /**
   * create a new offerta record on table 'offerte' and, after,
   * create a new folder with templates files inside
   * 
   * @param appValues (arr) array con i dati del nuovo offerta (app)
   * @param idAppFolder (str) id del folder che contiene le offerte
   * @param templates (arr) array con gli id dei template da utilizzare
   * i dati per la creazione del folder e la copia dei files template sono 
   * hard coded nella funzione coniugata lato fe.
   * i dati per l'accesso al database e alla tabella di lavoro sono hc nella funzione
  */
  console.log('in offertaCreateGame func');//test
  console.log('dati trasmessi 1'+appValues+' 2'+idAppFolder+ ' 3'+templates);//test
  
  //fase 1: crea nuovo record su tabella db specificata
  //inizializza connessione al database istanziando la Classe Crud
  let arrDbaseAccess=[0,'51.75.24.140','maosoft','Ingmazza_61','cmaTec'];//param,ip,user.pwd.dbase.....
  let dbObj=new Crud(arrDbaseAccess);//using db maosoft classes!
  
  //utilizza il metodo della classe Crud per nuovo record  con valori appValues sulla tabella games specificata
  //se subCodice='' lo imposta a 0
  if(appValues[1]==''){
    appValues[1]=0;
  }
  let flagCreateOpStatus=dbObj.createOffertaRecord('offerte', appValues); //status operazione di creazione record
  
  //gestione errori creazione record
  //--- da fare
  
  
  //fase 2: crea folder e carica template (modificato rispetto a Game)
  //building folder name
  if(appValues[1]!=0){
    var nomeCompletoFolder=appValues[0]+'.'+appValues[1]+'_'+appValues[3];  

  }else{
    var nomeCompletoFolder=appValues[0]+'_'+appValues[3];
  }
  
  console.log('il nome copleto del folder è: '+nomeCompletoFolder)
  
  //create folder
  let resultFolder=gsCreateAppFolder(idAppFolder, nomeCompletoFolder, templates);
  

  //gestione errori creazione folder
  
  //end function
  let resultValues =[resultFolder,flagCreateOpStatus];
  console.log('out gsOffertaCreate func');
  console.log(resultValues);
  return resultValues
}