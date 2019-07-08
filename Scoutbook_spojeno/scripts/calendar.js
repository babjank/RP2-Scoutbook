window.onload = function(){
  var d = new Date();
  var month = d.getMonth();

  aktivnosti( month, 1 );
  aktivnosti( month+1, 2 );
  $( "body" ).on( "mouseover", "b", info_aktivnost );
  $( "body" ).on( "mouseout", "b", function () {
    $("div.aktivnost").css("background-color", "#FFFFFF");
  });
}

function aktivnosti( month, ix )
{
  $.ajax(
  {
      url: "scoutbook.php?rt=ajax/calendar",
      type: "GET",
      data:
      {
        mjesec: month
      },
      dataType: "json",
      success: function( data )
      {
        if( typeof( data.error ) === "undefined" )
        {
          console.log('sucess');
          napravi( data, month, ix );
        }
        else console.log( data.error );
      },
      error: function( error )
      {
        console.log( "error = " + error );
      }
  } );
}

function napravi( data, month, ix ){
  var d = new Date();
  var month_name = ['Siječanj','Veljača','Ožujak','Travanj','Svibanj','Lipanj','Srpanj','Kolovoz','Rujan','Listopad','Studeni','Prosinac'];
  var year = d.getFullYear();
  var first_date = month_name[month] + " " + 1 + " " + year;

  var first_day = new Date(year, month, 1).getDay();

  var day_name = ['Ned','Pon','Uto','Sri','Čet','Pet','Sub'];
  var day_no = first_day;
  var days = new Date(year, month+1, 0).getDate();

  var dan_aktivnosti = new Array();
  var id_aktivnosti = new Array();
  var datumi = data.datumi;
  var id = data.id;
  var len = datumi.length;
  var j = 0;
  for( var i = 0; i < len; i++)
  {
    var str = datumi.pop(), m = id.pop();
    if(str.split('-')[1] == (month+1)){
      dan_aktivnosti[j] = str.split('-')[2];
      id_aktivnosti[j] = m;
      j++;
    }
  }

  var calendar = get_calendar(day_name, day_no, days, dan_aktivnosti, id_aktivnosti);
  $("#calendar-month-year-"+ix).html(month_name[month]+" "+year);
  $("#calendar-dates-"+ix).append(calendar);

}

function get_calendar(day_name, day_no, days, dan_aktivnosti, id_aktivnosti){
  var table = $('<table></table>');
  var tr = $('<tr></tr>');

  for(var c=0; c<=6; c++){
      var td = $('<td></td>');
      td.html(day_name[c]);
      tr.append(td);
  }
  table.append(tr);

  tr = $('<tr></tr>');
  var c;
  for(c=0; c <= 6; c++){
      if(c === day_no){
          break;
      }

      var td = $('<td></td>');
      td.html(" ");
      tr.append(td);
  }

  var count = 1;
  var change = false;
  for(; c<=6; c++){
      var td = $('<td></td>');
      for( var i = 0; i <= dan_aktivnosti.length; i++)
    	{
        if (dan_aktivnosti[i]==count){
          var b = $('<b></b>');
          b.html(count);
          b.attr("id",id_aktivnosti[i]);
          td.append(b);
          change = true;
        }
      }
      if(!change) td.html(count);
      count++;
      tr.append(td);
      change = false;
  }
  table.append(tr);

  for(var r=3; r<=7; r++){
      tr = $('<tr></tr>');;
      for(var c=0; c<=6; c++){
          if(count > days){
              table.append(tr);
              return table;
          }
          var td = $('<td></td>');
          for( var i = 0; i <= dan_aktivnosti.length; i++)
          {
            if (dan_aktivnosti[i]==count){
              var b = $('<b></b>');
              b.html(count);
              b.attr("id",id_aktivnosti[i]);
              td.append(b);
              change = true;
            }
          }
          if(!change) td.html(count);
          count++;
          tr.append(td);
          change = false;
      }
      table.append(tr);
  }
  return table;
}

function info_aktivnost( event )
{
  var id = $( this ).attr("id");
  $( "#div_"+ id ).css("background-color", "#E6E6E6");
}