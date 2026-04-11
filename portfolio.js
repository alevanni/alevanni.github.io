import { createApp, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
const test = ref("test");
console.log(test.value);

function openCard(cardName) {
  var i;
  var x = document.getElementsByClassName("card");
  var y = document.getElementsByClassName("showcase");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
    y[i].style.display = "inherit";
  }
  test.value = "test";
  console.log(test.value);
  document.getElementById(cardName).style.display = "block";
  document.getElementById( cardName+ "-showcase").style.display = "flex";
}
