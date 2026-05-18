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
    template: `<nav id="navbar">
    <ul>
      <li v-for="item in navItems" :key="item.text">
        <a :href="item.href">{{ item.text }}</a>
      </li>
    </ul>
  </nav>`   
}).mount("#navigation");

  