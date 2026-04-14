import { createApp, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";


const test = ref("test");
console.log(test.value);

const tabs = ref({1: "All", 2: "Web", 3: "Games", 4: "Other"});
const tabProjects = {All: {name: 'nameAll', link: 'link'},
                    Web: {name: 'nameWeb', link: 'link'},
                    Games: {name: 'nameGames', link: 'link'},
                    Other: {name: 'nameOther', link: 'link'}}
createApp({
    data() {
        return {
            tabs: tabs.value,
            activeTab: tabs.value[1],
        }
    },
    mounted() {
        const projectTabs = document.getElementById("projectTabs");
        
    },
    methods: {
        activateTab(tab) {
            console.log("here")
            //document.getElementById(tab).style.backgroundColor="red";
            this.activeTab = tab;
        },
    },
    template: `<ul class="navigation-tabs">
                  <li v-for="(tab, key) in this.tabs" :key="key" >
                        <button :class="[activeTab==tab? 'active': 'inactive']" @click="activateTab(tab)" :id="tab" >{{ tab }}</button>
                    </li>
                    
                </ul>
                
                <div v-for="(tab, key) in this.tabs" v-show="activeTab == tab" class="project-section"  :id="tab + '-projects'"></div>
                `,
}).mount("#project-tabs");
Object.entries(tabProjects).forEach(([tabName, data])=>{console.log(tabName)})

Object.entries(tabProjects).forEach(([tabName, data]) => {
    createApp({
        data() {
            
            return {
                id: tabName,
                //projects: tab[tab.keys[0]]
            }
        },
        methods: {
            
            }
        },
        template: `<p>{{id}} Projects</p>`,
    }).mount('#'+tabName + '-projects');
});
