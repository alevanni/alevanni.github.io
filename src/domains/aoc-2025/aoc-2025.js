import { createApp, ref, defineAsyncComponent } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import Navbar from "../../components/Navbar.js";
import { Day1 } from "./components/Day1.js";
import { Day2 } from "./components/Day2.js";
import {Placeholder} from "./components/Placeholder.js";

const components = {
    Day1: defineAsyncComponent(() => import('./components/Day1.js')),
    Day2: defineAsyncComponent(() => import('./components/Day2.js')),
    Placeholder: defineAsyncComponent(() => import('./components/Placeholder.js'))
}

createApp({
    data() {
        return {
            active: Placeholder,
            open: false,
            stars: [{component: Day1, parts: 2}, {component:Day2, parts: 2}]
        }
    },
    mounted() {
        //const button = document.getElementById();
    },
    methods: {
        toggleOpen() {
            this.open = !this.open;
            if (!this.open) this.active = Placeholder;
        }
    },
    template: `<div id="packages-container">
                 <div class="package">
                    <div class="ribbon">
                        <div class="ribbon-left">
                            <div class="hole-left"></div>
                        </div>
                        <div class="ribbon-middle"></div>
                        <div class="ribbon-right">
                            <div class="hole-right"></div>
                        </div>
                    </div>
                    <div class="lid">
                        <div class="ribbon-vertical"></div>
                    </div>
                    <div v-if="this.open" id="stars">
                    <ul>
                    <li v-for="star in this.stars"><button @click="active=star.component">{{star.component.name}}</button><i v-for="item in star.parts" class="fa-regular fa-star"></i></li>
                    </ul>
                    </div>
                   <div class="bottom" :class="[open? 'open': 'close']">
                     <div class="ribbon-vertical"></div>
                     <button @click="this.toggleOpen()">2025</button>
                  </div>
          </div>
        </div>
        <div id="solution-container"><component :is="this.active"></component></div>
    `,
}).mount("#main");