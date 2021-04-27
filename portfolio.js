


function openCard(cardName) {
  var i;
  var x = document.getElementsByClassName("card");
  var y = document.getElementsByClassName("showcase");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
    y[i].style.display = "inherit";
  }
  
  document.getElementById(cardName).style.display = "block";
  document.getElementById( cardName+ "-showcase").style.display = "flex";
}