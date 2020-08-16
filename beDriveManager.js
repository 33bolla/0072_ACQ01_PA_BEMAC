/**
 * Libreria di funzioni Back End standard  per Automazione
 *                  @@@@@ gestione gDrive  @@@@@@
 *                  --------by maoSoft()---------
 *
 *  ---------------------------------------------------------------------------------------------
 *   R01.002| 20200811| revisione per  miglioramento documentazione applicazione CMA001_PortalCMA
 *          |         | modificato nome funzione (aggiunto prefisso gs)   
 *  ---------------------------------------------------------------------------------------------   
 *  function list (last in first out)
 * 
 *#gsCreateAppFolder //lanciata dalla coniugata FE (che passa i parametri) 
 * crea un folder nella url indicata e eventualmente carica template files. 
 * 
 *#gsCopyTemplateFileToFolder auxiliary function of gsCreateAppFolder
 *
 * 
*/

function gsCreateAppFolder(idAppFolder, folderName, templates) { 
  /** 
   * lanciata dalla funzione be coniugata (libreria feLibrary) o da funzione di BE;
   * crea un nuovo folder con nome folderName nella cartella 
   * parent (idAppFolder), carica nel folder creato i files template (array di id in templates)
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

  //managing templates content  
  let idTemplateFile=templates[0];//id del template da copiare e salvare nel folder
  
  //Assuming the folder doesn't exist
  let newFolder = parentFolder.createFolder(folderName);
  let idTargetFolder= newFolder.getId();
  
  //defining templateFile as a file obj
  let templateFile=DriveApp.getFileById(idTemplateFile);//not used by now
  let newTemplateFile=copyTemplateFileToFolder(idTemplateFile, newFolder, 'controlloProcesso');//it's a file obj
  
  //test
  console.log('gApps BE: folder e template creati');
  console.log('nome del folder creato: '+newFolder);
  
  //building return values
  let localUrl=newFolder.getUrl();
  let templateLocalUrl=newTemplateFile.getUrl();
  let result=[localUrl,templateLocalUrl];

  return result;
  /** ----Developer notes and needed improvements -------
   *  
   *  ---------------------------------------------------------------- 
   *  R01.001| 20200810| testata con applicazione CMA001_PortalCMA   
   *  ---------------------------------------------------------------- 
   * 
   * make it a better function
   * //verify if folder (attempting to create) already exists.
   * //manage multiple template files
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