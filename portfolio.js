$.ajaxSetup({cache: false});
var showQA, showApis, showFrontEnd;
const QA = [
  {img:" https://lh3.googleusercontent.com/7Z8YOflZZCMeu7E94YlCrMD4BWG58OpDx79pDoJ4BoMxd_qHuMQQSjrX2NMRuymOtPL9MAsaepuhzi-BxDc1-17oczcz6NzdQvMl-dNS9i2rlAgXaH33TdKYEOlegoG78R-DAbpdZQ=w2400", name: "Issue Tracker", link: "https://issuetracker-fcccertif.glitch.me/"}, 
 {
  img: "https://lh3.googleusercontent.com/Odav0dWTgXukH6yRefLoi0d2SymHbijLxqMgXn8h17_aV7BDoWgPKV24i1LXwvWBtZfAFlwOz6Jnhpswzd8ublf9fsPGPY0uoahAsZzl_J87CzRyGBaboX38QE3quvrMprhPFyt_6A=w2400", name: "Imperial Metric Converter", link: "https://imperialmetricconverter.glitch.me/", githubLink: "https://github.com/alevanni/issue-tracker"
}, { img: "https://lh3.googleusercontent.com/hxfgaN9cmgzdp_QF7TJBulMbJ4XcrjGod0aiCKURLYaa69F1vOTVS6nf-YH0ZeqiMYnROva0KbAeq87BAGLqT1yFo43PLqjKaMz5TokKnewrETrV5mAWp33mpMtCHZC3ltges0Tw4g=w2400", name: "American British Translator",
  link: "https://american-british-translator.alevanni.repl.co/", gitHubLink: "https://github.com/alevanni/american-british-translator"
}, {
  img: "https://lh3.googleusercontent.com/2C5PPzqclDobaPnoNQZBhqV80Ws2exG6V0PT_IxTTrDzveKDzmDCcyT9TnTyVrGRUtGwt_s2bfsj1bLQqCR2UNdnN9UrHjYwx4fOuTqxQ1lI0oi8A-V3jQOkrfWzvdr5XDBPXHA2QQ=w2400", name: "Sudoku Solver", link: "https://boilerplate-project-sudoku-solver.alevanni.repl.co/", gitHubLink: "https://github.com/alevanni/sudoku-solver"
}];
const apis = [{
  name: "Timestamp Microservice", img: "https://lh3.googleusercontent.com/uolh-eBsrRzsxsAOXjiF_8MouzHq9gp_3bFwOLyR5_8vXgpt7tRHxwL73B8GpTn915t-nQNYZm4a6zYj-jlO6vwX6NSgkM0m4NX7L0yU0s1FGe46l8Owb20B73yFyG98YQ1GSy9Aww=w2400", link: "https://timestamp-microservice-for-fc.glitch.me/", githubLink: "https://github.com/alevanni/timestamp-microservice"
}, {
  name: "Request Header Parser Microservice", img: "https://lh3.googleusercontent.com/80bmBVeGOM9_JpgA-8WzuO9EfBJJj5Pl3G3IUsFrIeRUp5Cl8SpeIU7zissdc4ZsjHsV-ZsqeJA_R3lbKkYQ2ovmWpTUWC-vQGVIlWh0K6tqY1scJuVx7_UIvXUNNzrx9AyoXTQsvA=w2400", link: "https://whoam-i.glitch.me", githubLink: "https://github.com/alevanni/request-header-parser-microservice"
}];
const frontEnd = [
  {img: "https://lh3.googleusercontent.com/O1SNGnPr_EnHSMj2O37TNy84w8ZP6KZWYqoESlhq52PKMf21oI6L02K15e-YPc-qzK9wFPEV7dQonZZAWbe5DK7qIZc_lNieO4c6rCWp_LBmuCZLQAG4EtcFkFtuuJcFE09DFRw9Vg=w2400", link: "https://codepen.io/alevanni/full/GRJmjGv", name: "Wikipedia Viewer"}];
$(document).ready(function(){
  var string = "";
  for (var i=0; i< QA.length; i++){
    string = string + '<div class="project-tile" ><h2>'+ QA[i].name +'</h2><img src='+QA[i].img +'></div>';
  }
  
  $(string).appendTo('#QA-showcase');
  string = "";
  for (var i=0; i< apis.length; i++){
    string = string + '<div class="project-tile" ><h2>'+ apis[i].name +'</h2><img src='+apis[i].img +'></div>';
  }
 
     $(string).appendTo('#apis-showcase');
  string = "";
   for (var i=0; i< frontEnd.length; i++){
    string = string + '<div class="project-tile" ><h2>'+ frontEnd[i].name +'</h2><img src='+frontEnd[i].img +'></div>';
  }
   $(string).appendTo('#front-end-showcase');
})


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