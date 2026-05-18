import { createApp, ref, nextTick, watch } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";

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
            humidity: null,
            imageSrc: null,
            clouds: null,
            wind: null,
            windDirection: null,
            sunrise: null,
            sunset: null,
            rain: null,
            apparentTemperature: null,
            error: null,
            weatherCodes: null,
            unit: 'C',
        };
    },
    async mounted() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setPosition);


        } else {
            alert("Oops, Geolocation API is not supported");
        }

        const { data } = await axios.get(
            "https://gist.githubusercontent.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c/raw/76b0cb0ef0bfd8a2ec988aa54e30ecd1b483495d/descriptions.json"
        );
        if (!data) return;
        this.weatherCodes = data;

    },

    methods: {
        setPosition(position) {
            this.coordinates.latitude = position.coords.latitude.toFixed(3);
            this.coordinates.longitude = position.coords.longitude.toFixed(3);
            this.showPosition();
            this.setWeather();

        },
        async showPosition() {
            const { data } = await axios.get("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + this.coordinates.latitude + "&longitude=" + this.coordinates.longitude + "&localityLanguage=en");
            if (!data) return;
            this.city = data.locality;


        },



        async setWeather() {

            var string = "https://api.open-meteo.com/v1/forecast?latitude=" + this.coordinates.latitude + "&longitude=" + this.coordinates.longitude + "&daily=sunrise,sunset&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,cloud_cover,weather_code,apparent_temperature,is_day,rain&timezone=auto";
            //$.ajaxSetup({ cache: false });
            const { data } = await axios.get(string);
            if (!data) return;

            this.weatherCode = data.current.weather_code;

            console.log(data.daily);
            this.dayPart = data.current.is_day ? "day" : "night";
            this.description = this.weatherCodes[this.weatherCode][this.dayPart].description;
            this.imageSrc = this.weatherCodes[this.weatherCode][this.dayPart].image;
            this.temperature = Math.round(data.current.temperature_2m);
            this.apparentTemperature = Math.round(data.current.apparent_temperature);
            this.humidity = data.current.relative_humidity_2m;
            this.wind = data.current.wind_speed_10m;
            this.windDirection = data.current.wind_direction_10m;
            this.clouds = data.current.cloud_cover;
            this.rain = data.current.rain;
            this.sunrise = data.daily.sunrise[0].slice(11, 16);
            this.sunset = data.daily.sunset[0].slice(11, 16);
            

        },
        toggleUnit() {
            if (this.unit === 'C') {
                this.temperature = Math.round(this.temperature * 9 / 5 + 32);
                this.apparentTemperature = Math.round(this.apparentTemperature * 9 / 5 + 32);
                this.unit = 'F';
            } else {
                this.temperature = Math.round((this.temperature - 32) * 5 / 9);
                this.apparentTemperature = Math.round((this.apparentTemperature - 32) * 5 / 9);
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
}).mount("#main")