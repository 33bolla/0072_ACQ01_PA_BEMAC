/**
 * basic standard dbase manager functions and tools for JDBC driver for GAS
 * openConnection() //hard coded db access parameters
 * closeConnection()
 * execQuery(qry)
 * metadataFromQuery(results)
 * updateQuery(qry)
 * 
 */


function openConnection(){
      //https://developers.google.com/apps-script/guides/jdbc
      //crea gli oggetti connessione e statement di JSDBC     
      //static dBase connection; update as jsClass
            
      //init data
      var address = '51.75.24.140'; 
      var user = 'maosoft';
      var userPwd = 'Ingmazza_61';
      var db = 'cmaAmm';
      
      //setting connection
      var dbUrl = 'jdbc:mysql://' + address + '/' + db;
      var conn = Jdbc.getConnection(dbUrl, user, userPwd);
      var stmt = conn.createStatement(); //oggetto base per settings e interazione con elementi del database
      
      // Read up to 1000 rows of data from the table and log them.      
      stmt.setMaxRows(1000); //it can dinamically changed and or done inside the qry
      
      //setting connection variables (posso inoltrare i principali oggetti della coneessione come un array)
      var arrConnection=[];//init
      arrConnection.push(conn);
      arrConnection.push(stmt);
      return arrConnection;    
    /*
    warning: inserire controllo sul timestamp in fase di inserimento dati e gestione errori per evitare
    che Jdbc blocchi la esecuzione:
    Exception: Value '0000-00-00 00:00:00' can not be represented as java.sql.Timestamp
    at getArrayDataFromQuery(beDbaseCrud:82:39)
    at gsArrayReadTable(beAppLogic:16:20)
    */


}
    
function closeConnection(results,stmt,conn){
      //results may be not present or it would be an integer 
      if(results &&  isNaN(results)){
        results.close();
      }
      stmt.close();
      conn.close();
}


function execQuery(qry){
    //restituisce l'oggetto  (recordset) results 
    //connection to dBase and reading default qry
    console.log('in exec qry: qry  da eseguire:  '+qry);
    //dBase connection
    var arrConnection=openConnection();
    var conn=arrConnection[0];
    var stmt=arrConnection[1];
    
    //executing standard qry
    var results = stmt.executeQuery(qry);
    //console.log(results); //non visualizza il contenuto dell'oggetto...
    return results;
}

function metadataFromQuery(results){
    //this function is deprecated (see dataFromQueryHP on functions (return a 2dArray))
    //get metadata from query
    //return number of columns and column names
    
    //--------working with standard (full) query
    //obtaining number of query columns
    var numCols = results.getMetaData().getColumnCount(); //get number of query fields  
    
    //obtaining name of fields
    var colNames=[];
    for (var k =1; k<numCols+1; k++){
        var colName = results.getMetaData().getColumnName(k);
        colNames.push(colName);
    }
    var arrMetadata =[numCols,colNames];
    return arrMetadata;

}

function updateQuery(qry){
    //restituisce l'oggetto  (recordset) results 
    //connection to dBase and reading default qry
    //based on https://stackoverflow.com/questions/1905607/cannot-issue-data-manipulation-statements-with-executequery
    //dBase connection
    var arrConnection=openConnection();
    var conn=arrConnection[0];
    var stmt=arrConnection[1];
    
    //executing update qry
    //var results = stmt.executeUpdate(qry);//non ritorna ??
   
    //var results=stmt.executeUpdate(qry);
    //stmt.executeUpdate(record1)
    console.log('qry da eseguire:  '+qry);
    var results=stmt.executeUpdate(qry);
    return results;
}