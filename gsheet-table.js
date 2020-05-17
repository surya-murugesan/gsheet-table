function gsheet2table(sheeturl,sheetNo, tableID){

    //Converting Sheeturl to the sheetID required
    var sheetID = sheeturl;

    for (i=0; i<5; i++)
        {
        var pos = sheetID.search('/');
        sheetID = sheetID.slice(pos+1);
        }
    
    var pos = sheetID.search('/');
    sheetID = sheetID.slice(0,pos);
    
    //SheetJSON - the required url to get json
    var sheetJSON = 'https://spreadsheets.google.com/feeds/cells/'+ sheetID + '/'+sheetNo+ '/public/full?alt=json';
    
    //Making async false -> Much needed
    //In case future depreciation, use ->var response =  await $.getJSON(sheetJSON,function (data) {
    var sheetData;

    $.ajax({
    async: false,
    dataType:'json',
    url: sheetJSON,
    type: 'GET',
    success: function(data) {
        sheetData = data.feed.entry;
    }
    });    

    //Parsing sheetdata to get the required values + Naming them acc. to print them
    for(var i=0; i<50;i++){
        j = sheetData[i].gs$cell.col;
        if(i>j){
            break;
        }    
    }
  
    var column = i;
    var data_length=(sheetData[sheetData.length-1].gs$cell.row)-1; // top row headings

    var labels = [];
    for (var i=0; i<column; i++)

    {   
    labels.push(sheetData[i].gs$cell.$t);
    }
    
    labels.forEach(function(label){
        window[label] =[];
    })

    var d_col = column;
    var adj_num;

    for(j=0; j<column; j++){

        for(var z=d_col; z<=(column*data_length);z+=column){
            adj_num = z+j;
            window[labels[j]].push(sheetData[adj_num].gs$cell.$t);
        }
    }

    //Exporting to export_data for returning
    
    var export_data = new Object;

    export_data.head = labels;
    var rows = [];
     labels.forEach(function(label){
        rows.push(window[label]);
    })

    export_data.data = rows;

    //printing the table
    var temphead ='<th>'+labels[0]+'</th>';
    for(i=1; i<labels.length; i++)
    {
        temphead +=
        '<th>'+labels[i]+'</th>';
    }

    var temptable = [];
    for(i=0; i<data_length; i++){
        temptable+= '<tr>'
        for(j=0; j<labels.length;j++){
            temptable += '<td>'+ window[labels[j]][i]+'</td>';
        }
        temptable+='</tr>'
    }

    document.getElementById(tableID).innerHTML = (
        '<thead>'+'<tr>'+ temphead + '</tr>'+'</thead>'+'<tbody>'+temptable+'</tbody>'
    )

    //returning the export_data
    return export_data;
}
