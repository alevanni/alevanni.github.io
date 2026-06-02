import { createApp, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";

export default createApp({
  data() {
    return {
      navItems: [
        { text: "Home", href: "/index.html" },
        { text: "Projects", href: "/index.html#projects" },
        { text: "Contacts", href: "/index.html#contacts" }
      ]
    };
  },
  mounted() {

    document.addEventListener("DOMContentLoaded", () => {
      document.documentElement.dataset["theme"] = "dark";
      window.dispatchEvent(new CustomEvent('theme-changed'));
      const toggleSwitch = document.getElementById("toggle-theme");
      toggleSwitch.addEventListener("change", () => {
        if (toggleSwitch.checked) {
          console.log("here")
          document.documentElement.dataset["theme"] = "light";

        }
        else {
          document.documentElement.dataset["theme"] = "dark";
        }
        window.dispatchEvent(new CustomEvent('theme-changed'));
      });
    });


  }
  ,
  template: `<nav id="navbar">
    <ul>
      <li v-for="item in navItems" :key="item.text">
        <a :href="item.href">{{ item.text }}</a>
      </li>
    </ul>
     <label class="switch">
    <input type="checkbox" id="toggle-theme" >
    <span class="slider round"></span>
  </label>
  </nav>`
}).mount("#navigation");

