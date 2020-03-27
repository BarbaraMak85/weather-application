const weather = {
    cityInput: document.querySelector('#city'),
    city: null,
    waitInput: null,
    weatherItemsCounter: 5,

    initCityInput: function() {
        this.cityInput.addEventListener('keyup', this.writeCity);
    },
    writeCity: function() {
        weather.city = this.value;

        clearTimeout(weather.waitInput);
        weather.waitInput = setTimeout(function() {
            weather.getWeatherFromApi();
        }, 1000);


    },

    initButtonWather: function() {
        const nextButtonWeather = document.getElementById('nextButton');
        nextButtonWeather.addEventListener('click', this.getWatherFiveCounter);
    },

    getWeatherFromApi: function() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?APPID=66cdfe710b9da2d2ac8c8c6f763b6750&units=metric&q=${this.city}&lang=pl`)
            .then(response => response.json())
            .then(jsonWather => {
                weather.checkWeatherStatus(jsonWather);

            })


        fetch(`https://api.openweathermap.org/data/2.5/forecast?APPID=66cdfe710b9da2d2ac8c8c6f763b6750&units=metric&q=${this.city}&lang=pl`)
            .then(response => response.json())
            .then(jsonWather => {
                weather.checkWeatherStatus(jsonWather);

            })
    },

    checkWeatherStatus: function(jsonWather) {
        if (jsonWather && jsonWather.cod === '404') {
            return this.getWeatherError();
        }

        if (jsonWather.list) {
            this.showWeatherFiveDays(jsonWather.list);

        } else {
            this.showWeather(jsonWather);
        }

    },

    showWeatherFiveDays: function(jsonWather) {
        document.querySelector('#nextButton').style.display = 'block';
        const weatherListFiveWrapper = document.querySelector('#fiveDaysWeather');
        weatherListFiveWrapper.innerHTML = '';

        let weatherListFive = document.createElement('ul');
        weatherListFive.classList.add('main-five-weather-list');
        weatherListFiveWrapper.appendChild(weatherListFive);
        weather.weatherItemsCounter = 5;



        for (let one_weather of jsonWather) {

            const weatherData = [{
                    description: 'Prognoza na dzień',
                    value: one_weather.dt_txt,
                    unit: ''
                },
                {
                    description: 'Temperatura',
                    value: one_weather.main.temp,
                    unit: '°C'
                },
                {
                    description: 'Temperatura odczuwalna',
                    value: one_weather.main.feels_like,
                    unit: '°C'
                },
                {
                    description: 'Ciśnienie',
                    value: one_weather.main.pressure,
                    unit: 'hPa'
                },
                {
                    description: 'Wilgotność',
                    value: one_weather.main.humidity,
                    unit: '%'
                },
                {
                    description: 'Prędkość wiatru',
                    value: one_weather.wind.speed,
                    unit: 'km/h'
                },
                {
                    description: 'Zachmurzenie',
                    value: one_weather.clouds.all,
                    unit: '%'
                },

            ];


            let weather_item_list = document.createElement('ul');
            weather_item_list.classList.add('five-days-weather-item');

            let weather_icon_list = document.createElement('li');
            let weather_icon = document.createElement('img');
            weather_icon.src = `http://openweathermap.org/img/wn/${one_weather.weather[0].icon}@2x.png`;
            weather_icon_list.appendChild(weather_icon);
            weather_item_list.appendChild(weather_icon_list);

            for (let i = 0; i < weatherData.length; i++) {
                let newListItem = document.createElement('li');
                newListItem.innerHTML = `${weatherData[i].description}: ${weatherData[i].value} ${weatherData[i].unit}`;
                weather_item_list.appendChild(newListItem);
            }

            let weather_item_list_item = document.createElement('li');
            weather_item_list_item.appendChild(weather_item_list);
            weather_item_list_item.classList.add('main_li');
            weather_item_list_item.style.display = 'none';

            // document.querySelector('with_curren').style.display = 'block';

            weatherListFive.appendChild(weather_item_list_item);


        }
        this.getWatherFiveCounter();
    },

    showWeather: function(jsonWather) {
        document.querySelector('#city_placeholder').innerHTML = `Aktualna pogoda dla miasta ${this.cityInput.value}`;
        document.querySelector('#city_placeholder').style.display = 'block';
        document.querySelector('#weather_five_days').style.display = 'block';
        document.querySelector('#notFound').innerHTML = '';
        const weatherList = document.querySelector('#currentWeather ul');

        weatherList.innerHTML = '';

        const weatherData = [{
                description: 'Temperatura',
                value: jsonWather.main.temp,
                unit: '°C'
            },
            {
                description: 'Temperatura odczuwalna',
                value: jsonWather.main.feels_like,
                unit: '°C'
            },
            {
                description: 'Ciśnienie',
                value: jsonWather.main.pressure,
                unit: 'hPa'
            },
            {
                description: 'Wilgotność',
                value: jsonWather.main.humidity,
                unit: '%'
            },
            {
                description: 'Prędkość wiatru',
                value: jsonWather.wind.speed,
                unit: 'km/h'
            },
            {
                description: 'Zachmurzenie',
                value: jsonWather.clouds.all,
                unit: '%'
            },
            {
                description: 'Wschód słońca',
                value: `${new Date(jsonWather.sys.sunrise * 1000).getHours()}:${new Date(jsonWather.sys.sunrise * 1000).getMinutes()}`,
                unit: ''
            },
            {
                description: 'Zachód słońca',
                value: `${new Date(jsonWather.sys.sunset * 1000).getHours()}:${new Date(jsonWather.sys.sunset * 1000).getMinutes()}`,
                unit: ''
            }
        ];

        for (let i = 0; i < weatherData.length; i++) {
            let newListItem = document.createElement('li');
            newListItem.innerHTML = `${weatherData[i].description}: ${weatherData[i].value} ${weatherData[i].unit}`;
            weatherList.appendChild(newListItem);
        }

        const weather_icon = document.querySelector('#weather_icon');
        weather_icon.src = `http://openweathermap.org/img/wn/${jsonWather.weather[0].icon}@2x.png`;
        weather_icon.style.display = 'block';
    },

    getWeatherError: function() {
        const weatherList = document.querySelector('#currentWeather ul');

        weatherList.innerHTML = '';
        document.querySelector('#city_placeholder').innerHTML = '';
        const notFoundWrapper = document.querySelector('#notFound');
        notFoundWrapper.innerHTML = `Nie znaleziono pogody dla miasta ${this.city}`;
    },

    getWatherFiveCounter: function() {
        const fiveCounter = document.querySelectorAll('#fiveDaysWeather .main_li');

        if (weather.weatherItemsCounter > fiveCounter.length) {
            weather.weatherItemsCounter = fiveCounter.length;
            document.querySelector('#nextButton').style.display = 'none';
        }

        for (let i = 0; i < weather.weatherItemsCounter; i++) {
            fiveCounter[i].style.display = 'block';
        }

        weather.weatherItemsCounter = weather.weatherItemsCounter + 5;

    }

}


weather.initCityInput();
weather.initButtonWather();