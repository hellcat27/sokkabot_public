const Discord = require('discord.js');
const axios = require('axios');
const openWeatherApiKey = process.env.OPENWEATHERKEY;

class Weather {
    constructor(message) {
        this.message = message;
        this.searchQuery = '';
        this.apiKey = '';
        this.getWeather(message);
        this.weatherResponse = '';
    }

    getWeather(message) {
        this.results = this.message.content.split(' ');
        for(let i = 1; i < this.results.length; i++) {
            this.searchQuery += (this.results[i]);
            if(i + 1 < this.results.length) {
                this.searchQuery += '+';
            }
        }
        this.searchEndpoint = 'http://api.openweathermap.org/data/2.5/weather?q=' + this.searchQuery + '&appid=' + openWeatherApiKey;
        
        // Search endpoint with options
        axios.get(this.searchEndpoint)
            .then(response => {
                this.returnData = response.data;
                const currentTemp = this.convertTempToF(this.returnData.main.temp);
                const tempFeelsLike = this.convertTempToF(this.returnData.main.feels_like);
                const weatherCategory = this.returnData.weather[0].main;
                const weatherDescription = this.returnData.weather[0].description;
                const humidity = this.returnData.main.humidity + '%';
                const visibility = this.returnData.visibility;
                const windSpeed = this.returnData.wind.speed + ' mph';
                const windDirection = this.returnData.wind.deg + '\xB0';
                this.weatherResponse = `Current weather for ${this.searchQuery}:\n${weatherCategory} - ${weatherDescription}\nTemperature: ${currentTemp}\nFeels like: ${tempFeelsLike}\nHumidity: ${humidity}\nWind: ${windDirection}, ${windSpeed}`;
                message.channel.send(this.weatherResponse);
            })
            .catch(error => {
                console.log(error);
                message.channel.send('Could not find location!');
            });        
    }

    convertTempToF(temp) {
        return Math.round((temp - 273.15) * (9 / 5) + 32) + '\xB0 F';
    }
}

module.exports = Weather;