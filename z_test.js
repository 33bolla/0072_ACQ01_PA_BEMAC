/* area di test per CMA001
test1:
#chiamata successiva di due funzioni di back end
callTwoFunctions()
test2:
#crea ss+ws e imposta la data corrente nel foglio e nella  casella specificata
test3:
#copia ss template e imposta data,  riga di log con data,  responsabile, oggetto 'nome processo apertura';
test4:
#ottieni url
test5:
#porve scrittura su database con campi date
*/

function testdb(){
  //scrivi campo date su database
  //connessione al db
  let dbUrl = 'jdbc:mysql://' + '51.254.206.188' + '/' +'SB_MMazza' ;
  let conn = Jdbc.getConnection(dbUrl, 'root', 'Bemac999');
  let table='ACQ_PA';
  let qry = "INSERT INTO "+table+"(cod, descrizione, note_interne, note_fornitore,fkOperatore, fkRichiedente, start, limite, end,  fkGame, fkOfferta, fkStatoPa) values (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?) "

//  let qry = "INSERT INTO "+table+"(cod, descrizione, note_interne, note_fornitore, "
//            +"fkOperatore, fkRichiedente, start, limit, end, terminata, fkGame, "
//            +"fkOfferta, fkLavorazione, fkStatoPa, path) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";

  let stmt = conn.prepareStatement(qry);
  
  //preparo i dati e li metto in un array
  let cod='21000';
  let descrizione='test';
  let note_interne='test';
  let note_fornitore='test';
  let fkOperatore='100';
  let fkRichiedente='100';
  let start="2020-10-10";
  let limite="2020-10-10";
  let end="2020-10-10";
//  let terminata='1';
  let fkGame='0';
  let fkOfferta='0';
// let fkLavorazione='0';
  let fkStatoPa='0';
//  let path='test';
//  let values=[cod, descrizione, note_interne, note_fornitore,fkOperatore,fkRichiedente,start,limit,end,terminata,fkGame,fkOfferta,fkLavorazione, fkStatoPa,path]
//  console.log(values);
 let values=[cod, descrizione, note_interne, note_fornitore, fkOperatore, fkRichiedente,  start, limite, end,  fkGame, fkOfferta, fkStatoPa];
  
  stmt.setString(1, values[0]);
  stmt.setString(2, values[1]);
  stmt.setString(3, values[2]);
  stmt.setString(4, values[3]);
  stmt.setString(5, values[4]);
  stmt.setString(6, values[5]);
  stmt.setString(7, values[6]);
  stmt.setString(8, values[7]);
  stmt.setString(9, values[8]);
  stmt.setString(10, values[9]);
  stmt.setString(11, values[10]);
 stmt.setString(12, values[11]);
//  stmt.setString(13, values[12]);
//  stmt.setString(14, values[13]);
//  stmt.setString(15, values[14]);

  let results = stmt.execute();//set create op flag
  console.log(results);
  console.log('out from  createRecord method');
}




function test4(){
  //tested: OH
  let codiceGame='27631';
  let folderId='1yChSNxEzM-8JqXgTcIOePS1pIcmIDSR7';//game folder
  ottieniUrl(codiceGame, folderId);   
}

function ottieniUrl(codiceGame, folderId){
  
  // recupera id del folder relativo al game con codice ==codiceGame  
    //init
  let folderGame=DriveApp.getFolderById(folderId);
  let folders=folderGame.getFolders();
  
  while (folders.hasNext()) {
    var folder = folders.next();
    let folderName=folder.getName();
    let folderId=folder.getId();
    
    //test on codiceGame  and action
    let inizioNomeGame = folderName.substring(0, 5);//primi 5 caratteri del nome del folder desiderato
    if(inizioNomeGame==codiceGame){
      let folderGameId=folderId;
      console.log('trovato folder '+folderName);
      break;
    }
  }
}







function test3(){
  let idSs=copiaSpreadSheetTemplate();//id del file copiato
  inizializzaSs(idSs);   
}

function copiaSpreadSheetTemplate(){
/**
 * funzione che crea un file copiandolo da un template in una locazione hc
 */
  
//seleziono ss template  e lo utilizzo come file
Logger.log('in copia ss');
let idSsTemplate=('1vUYdGhkjYYsyXhtIuFefSJRTEFX1-9UYKdgVKddBic8'); //id di ssTemplate già formattato (tipi di celle già definite)
let ssSource=SpreadsheetApp.openById(idSsTemplate);//templateTest su root   
let fileSource = DriveApp.getFileById(idSsTemplate);//è l'oggetto file che rappresenta lo ssSource
  
//seleziono il folder Destination nel quale copiare il file template
let idFolderDestination='1OovFCDg2PvSYrq8dO7STJR787WQzPKOt';
let folderDestination = DriveApp.getFolderById(idFolderDestination);// folder zz_test su root
  
//copio il file sorgente nel folder Destination    
let idFileTarget = DriveApp.getFileById(idSsTemplate).makeCopy('testCopied', folderDestination).getId();
//let idFileTarget = fileSource.getFileById(idSsTemplate).makeCopy('testCopied', folderDestination).getId();
Logger.log(idFileTarget);
//let fileTarget = fileSource.makeCopy('testCopied', folderDestination).
return idFileTarget
}
function inizializzaSs(idSs){
/**
* funzione che apre uno ss creando la prima riga dello sheet[0]
*/
Logger.log('in iniizalizza Ss');
//crea la prima riga del log
let oggi=mToday();//acquisisce la data odierna nel formato ITA
let user=Session.getActiveUser().getEmail();
let nomeProcesso='290000';//da acquisire in sede di creazione del processo
let oggetto='nomeProcesso'+'_apertura processo';
let firstRow=[1,oggi, user, oggetto];
Logger.log (firstRow);

//genera la prima riga su ws
let ss=SpreadsheetApp.openById(idSs);
let ws=ss.setActiveSheet(ss.getSheets()[0]);
ws.appendRow(firstRow);
}


function test2(){
  createSpreadSheet();
}
function createSpreadSheet(){
  let ss=SpreadsheetApp.create('test'); 
  let ssId=ss.getId();
  
  //var range = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getRange('C1:D4');//by google
  
  /*ATTENZIONE AL WORKAROUND DA SEGUIRE PER DEFINIZIONE DELLA ATTIVA*/
  let maoSheet=ss.insertSheet('maosoft', 0);//inserisce nuovo sheet nella posizione desiderata e lo rende attivo
  let range=maoSheet.getRange('A1:A1');//mandatory devi definire l'oggetto range
  let cell=maoSheet.setActiveRange(range); //la cella coincide con il range reso attivo
  let oggi=mToday();
  cell.setValue(oggi);//applico il valore alla cella
  
  //Molto carinoooo inserisco uno sheet già pronto (template)!!
  //  var templateSheet = ss.getSheetByName('Sales');
  //  ss.insertSheet('My New Sheet', 1, {template: templateSheet});//very cool!!

}
function mToday(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  let mToday = dd + '/' + mm + '/' + yyyy;
  
  return mToday
}




function test1(){
    let c= callTwoFunctions();
    console.log ('risultato= '+c);
}

function callTwoFunctions(){
    //this function call two distinct function
    let a=aTest();
    let b=bTest();
    let c=a+b;
    return c
}

function aTest(){
    let root=DriveApp.getRootFolder();
    let name=root.getName();
    Logger.log(name);
    return 5;
}

function bTest(){
    return 10;
}