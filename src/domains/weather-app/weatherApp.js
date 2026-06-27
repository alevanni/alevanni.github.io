import { createApp, nextTick } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";
import Navbar from "../../components/Navbar.js";

createApp({
    data() {
        return {
            city: null,
            coordinates: { latitude: null, longitude: null },
            dayPart: null,
            weatherCode: null,
            description: null,
            temperature: null,
            temperatureC: null,
            humidity: null,
            imageSrc: null,
            clouds: null,
            wind: null,
            windDirection: null,
            sunrise: null,
            sunset: null,
            rain: null,
            apparentTemperature: null,
            apparentTemperatureC: null,
            error: null,
            weatherCodes: null,
            unit: 'C',
            loaded: false,
        };
    },
    async mounted() {
        const { data } = await axios.get(
            "https://gist.githubusercontent.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c/raw/76b0cb0ef0bfd8a2ec988aa54e30ecd1b483495d/descriptions.json"
        );
        if (!data) return;
        this.weatherCodes = data;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setPosition);
        } else {
            alert("Oops, Geolocation API is not supported");
        }
    },

    methods: {
        async setPosition(position) {
            this.coordinates.latitude = position.coords.latitude.toFixed(3);
            this.coordinates.longitude = position.coords.longitude.toFixed(3);
            await this.showPosition();
            await this.setWeather();
        },
        async showPosition() {
            const { data } = await axios.get("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + this.coordinates.latitude + "&longitude=" + this.coordinates.longitude + "&localityLanguage=en");
            if (!data) return;
            this.city = data.locality;
        },
        async setWeather() {
            const string = "https://api.open-meteo.com/v1/forecast?latitude=" + this.coordinates.latitude + "&longitude=" + this.coordinates.longitude + "&daily=sunrise,sunset&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,cloud_cover,weather_code,apparent_temperature,is_day,rain&timezone=auto";
            const { data } = await axios.get(string);
            if (!data) return;

            // Reset first
            this.loaded = false;
            this.description = null; // collapses v-if, removes elements from DOM

            await nextTick(); // let Vue remove the elements
            this.weatherCode = data.current.weather_code;
            this.dayPart = data.current.is_day ? "day" : "night";
            this.description = this.weatherCodes[this.weatherCode][this.dayPart].description;
            this.imageSrc = this.weatherCodes[this.weatherCode][this.dayPart].image;
            this.temperatureC = Math.round(data.current.temperature_2m);
            this.apparentTemperatureC = Math.round(data.current.apparent_temperature);
            this.temperature = this.temperatureC;
            this.apparentTemperature = this.apparentTemperatureC;
            this.humidity = data.current.relative_humidity_2m;
            this.wind = data.current.wind_speed_10m;
            this.windDirection = data.current.wind_direction_10m;
            this.clouds = data.current.cloud_cover;
            this.rain = data.current.rain;
            this.sunrise = data.daily.sunrise[0].slice(11, 16);
            this.sunset = data.daily.sunset[0].slice(11, 16);

            await nextTick();
            // Delay to make everithing fade in together
            await new Promise(resolve => setTimeout(resolve, 10));
            this.loaded = true;
            await new Promise(resolve => setTimeout(resolve, 50));

        },
        toggleUnit() {
            if (this.unit === 'C') {
                this.temperature = Math.round(this.temperatureC * 9 / 5 + 32);
                this.apparentTemperature = Math.round(this.apparentTemperatureC * 9 / 5 + 32);
                this.unit = 'F';
            } else {
                this.temperature = this.temperatureC;
                this.apparentTemperature = this.apparentTemperatureC;
                this.unit = 'C';
            }
        },
    },
    watch: {
        coordinates(newCoordinates) {
            console.log("Coordinates updated:", newCoordinates);
        },
        city(newCity) {
            console.log("City updated:", newCity);
        }
    },
    template: `
      <div id="weather" :class="dayPart">
        <h1>What's the weather like in...</h1>
        <div id="where">
          <h1>{{ city ?? "Loading..." }}</h1>
        </div>
        <div id="weather-container-wrapper" v-if="description" :class="{ visible: loaded }">
        <div id="weather-container" v-if="description" :class="{ visible: loaded }">
          <div id="description" >
            <p id="weather-description" :class="{ visible: loaded }">{{ description }}</p>
            <div id="icon" :class="{ visible: loaded }">
              <img :src="imageSrc" alt="Weather Icon">
            </div>
            <div id="temperature">
              <p id="temp" :class="{ visible: loaded }">{{ temperature }}°</p>
              <button id="fahr" class="btn" :class="{ visible: loaded, day: dayPart === 'day', night: dayPart === 'night' }" @click="toggleUnit">{{ unit }}</button>
              <p id="apparent-temperature" :class="{ visible: loaded }">Feels like: {{ apparentTemperature }}°</p>
            </div>
          </div>
          <div id="details" :class="{ visible: loaded }">
            <ul>
              <li>Rain: {{ rain }} mm</li>
              <li>Humidity: {{ humidity }}%</li>
              <li>Wind: {{ wind }} km/h <i class="fa fa-arrow-up" :style="{ transform: 'rotate(' + (windDirection+180) + 'deg)' }"></i></li>
              <li>Clouds: {{ clouds }}%</li>
              <li>Sunrise: {{ sunrise }}</li>
              <li>Sunset: {{ sunset }}</li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    `,
}).mount("#main")