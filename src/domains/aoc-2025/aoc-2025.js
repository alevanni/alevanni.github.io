import { createApp, ref, defineAsyncComponent } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
//import {gsap} from "https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js";
import Navbar from "../../components/Navbar.js";
import { Day1 } from "./components/Day1.js";
import { Day2 } from "./components/Day2.js";
import { Day3 } from "./components/Day3.js";
import { Day4 } from "./components/Day4.js";
import { Day5 } from "./components/Day5.js";
import { Day6 } from "./components/Day6.js";
import { Day7 } from "./components/Day7.js";
import { Day9 } from "./components/Day9.js";
import { Placeholder } from "./components/Placeholder.js";

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
            days: [{ component: Day1, parts: 2 }, { component: Day2, parts: 2 }, { component: Day3, parts: 2 }, { component: Day4, parts: 2 }, { component: Day5, parts: 2 }, { component: Day6, parts: 2 }, { component: Day7, parts: 2 }, { component: Day9, parts: 1 }]
        }
    },
    mounted() {

    },
    methods: {
        toggleOpen() {
            this.open = !this.open;
            if (!this.open) this.active = Placeholder;
        },
        onEnter(el, done) {
            gsap.to(el, {
                opacity: 1,
                height: '1.6em',
                delay: el.dataset.index * 0.15,
                onComplete: done
            })
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
                    
                    <div id="stars" class="appear">
                    
                   <TransitionGroup name="list" tag="ul" class="no-style">
                    <li v-if="open" class="title-li" v-for="(day, index) in days" :key="index" :style="{ '--j': index , '--h': days.length-index - 1}">
                     <button class="title-button" @click="active=day.component">{{day.component.name}}</button>
                     <i v-for="item in day.parts" class="fa-solid fa-star star"></i>
                    </li>
                   </TransitionGroup>
                    
                    </div>
                   
                   <div class="bottom" :class="[open? 'open': 'close']">
                     <div class="ribbon-vertical"></div>
                     <button @click="this.toggleOpen()"><p>For: you {{open? 'close': 'open'}} me!</p></button>
                  </div>
          </div>
        </div>
        <div id="solution-container"><component :is="this.active"></component></div>
    `,
}).mount("#main");