/**
 * Libreria di funzioni Back End standard  per Automazione
 *                  @@@@@ gestione gDrive  @@@@@@
 *                  --------by maoSoft()---------
 *
 *  ---------------------------------------------------------------------------------------------
 *  R01.003| 20200824| gsCreateAppFolder inizializza i documenti standard
 *  R01.002| 20200811| revisione per  miglioramento documentazione applicazione CMA001_PortalCMA
 *         |         | modificato nome funzione (aggiunto prefisso gs)   
 *    
 *  ---------------------------------------------------------------------------------------------   
 *  function list (last in first out)
 * #getFoldersDataList(idParentFolder) //utilità
 * #getLastFolderName(parFoldersData)  //utilita
 * #gsCreateAppFolder //lanciata dalla coniugata FE (che passa i parametri) 
 * crea un folder nella url indicata e eventualmente carica template files.  
 * #copyTemplateFileToFolder(idTemplateFile, TargetFolder, newName) auxiliary function of gsCreateAppFolder (not needed...)
 *
*/
function getFoldersDataList(idParentFolder){
  /* --- utility function
  *legge i folder nel parent Folder e  memorizza   nomi, id, dataCreazione in un array di array di stringhe
  */
  //log&init
  let parentFolder=DriveApp.getFolderById(idParentFolder);//pa folder in questa applicazione
  let folders= parentFolder.getFolders();
  let parFoldersData=[];
  
  //ciclo di lettura subFolder
  while (folders.hasNext()) {
      let folder = folders.next();
      let folderName=(folder.getName());
      let folderId=folder.getId();
      let folderDate=folder.getDateCreated();
      folderDate=folderDate.toLocaleDateString("en-GB");//setting date format
      
      //building array with subFolders data 
      let parFolderItem=[folderName, folderId, folderDate];
      parFoldersData.push(parFolderItem);
  }
  
  //console.log(parFoldersData);//elenco subFolders
  return parFoldersData;
}

function getLastFolderName(parFoldersData){
  /* --- utility function
  *restituisce i dati dell'ultimo folder elencato in una cartella ordinata per nome (desc)
  *con nome cartella codificato come:  numero_descrizione (PANumero_Descrizione)
  */
  //log&init
  parFoldersData.sort();// parFolderData è un array di array: sort sul primo campo di ogni item
  parFoldersData.reverse();
  let lastFolderData=parFoldersData[1];//la posizione 0 è utilizzata per z_old
                                       //array con items = dati del last folder 
  let lastFolderName=lastFolderData[0];
  return lastFolderName 
}

function gsCreateAppFolder(idAppFolder, folderName, templates) { 
  /** 
   * lanciata dalla funzione be  gsPaCreate (coniugata con paCreate libreria feLibrary);
   * #crea un nuovo folder con nome folderName nella cartella parent (idAppFolder),
   * #carica nel folder creato i files copiandoli dai templates (array di id in templates)
   * #inizializza i file gSheet (data corrente e prima riga di log (ove presente))
   * 
   * @param {string} idAppFolder id del Folder padre
   * @param {string } folderName nome da attribuire al folder
   * @param {array} templates str id dei files da caricare nel folder alla sua creazione
   * @returns {array}
   */
  
  //init & test
  console.log('in createAppFolder');
  
  //retrieve parent folder url from function  Arguments
  let parentFolder = DriveApp.getFolderById(idAppFolder);

  //Assuming the folder doesn't exist (it's always so)
  let newFolder = parentFolder.createFolder(folderName);//folder obj
  let idTargetFolder= newFolder.getId();//not used by now

  //managing templates content  
  let idTemplateFileControlloProcesso=templates[0];//id del template controllo processo da copiare e salvare nel folder
  let idTemplateFilePa=templates[1];//id del template PAXXXXX da copiare e salvare nel folder
  
  
  //defining templatesFile as  'file objects' (i file sono oggetti della classe files di GAS)
  let fileTemplateControlloProcesso=DriveApp.getFileById(idTemplateFileControlloProcesso);
  let fileTemplatePa=DriveApp.getFileById(idTemplateFilePa);
  
  //make a copy of the files in target folder
  let fileControlloProcesso=fileTemplateControlloProcesso.makeCopy('controlloProcesso',newFolder);
  let filePa=fileTemplatePa.makeCopy('PA',newFolder)

  //edit new files
  //today date (from gApps Google function)
  let today = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy");
  
  // setting current date on 'controlloProcesso' gSheet
  let ss = SpreadsheetApp.open(fileControlloProcesso);
  let ws = ss.getSheets()[0];
  let cell = ws.getRange("B2");//selecting target cell
  cell.setValue(today);

  //building return values (new folder url and list of template files url created)
  let result=[newFolder.getId(),fileControlloProcesso.getId(),filePa.getId()];
  console.log ('out of gsCreateAppFolder');//test
  return result;
  
  /** ----Developer notes and needed improvements -------
   *  
   * make it a better function!
   * //verify if folder (attempting to create) already exists.
   * //error management
   * put all gDrive Function in a class!!!
  * */  
}

function copyTemplateFileToFolder(idTemplateFile, TargetFolder, newName){
  /** 
   * gsCreateAppFolder auxiliary function
   * 
   * @param {string} idTemplateFile id del template da copiare
   * @param {string} TargetFolder nome del folder in cui copiare il file
   * @param {string} newName str id dei files da caricare nel folder alla sua creazione
   * @returns {file}
   */
  //rem makeCopy(name, destinationFolder) you need the folder as object!!!
  let templateFile=DriveApp.getFileById(idTemplateFile);
  let newTemplateFile=templateFile.makeCopy(newName, TargetFolder)
  return newTemplateFile; 
}