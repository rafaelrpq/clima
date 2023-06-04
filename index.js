var geo = {
    lat : 0,
    lon : 0,
    alt : 0,
}

const options = {
  enableHighAccuracy: true,
  timeout: 1000,
  maximumAge: 0,
}

// var timeout = navigator.userAgentData.mobile ? 20 : 200;

let url = '--';

const Meteo = {
    'air_pressure_at_sea_level' : 'Pressão Atmosférica',
    'air_temperature'           : 'Temperatura',
    'cloud_area_fraction'       : 'Nebulosidade',
    'precipitation_amount'      : 'Preciptação',
    'relative_humidity'         : 'Umidade Relativa',
    'wind_from_direction'       : 'Direção do Vento',
    'wind_speed'                : 'Velocidade do vento',
}

async function tratarErro (erro) {
    let msg = 'erro desconhecido'
    switch (erro.code) {
        case 1 :
            msg = 'Permissão negada'
            break;
        case 2 :
            msg = 'Posição não encontrada'
            break;
        case 3 :
            msg = 'Timeout'
            break;
    }
    console.log (msg)
}

async function obterLocalizacao (pos) {
    try {
        geo.lat = await pos.coords.latitude
        geo.lon = await pos.coords.longitude
        geo.alt = await pos.coords.altitude

        // url = `https://api.met.no/weatherapi/locationforecast/2.0/compact.json?lat=${geo.lat}&lon=${geo.lon}&altitude=${geo.alt ?? 0}`
        url = `https://api.met.no/weatherapi/locationforecast/2.0/compact.json?lat=${geo.lat}&lon=${geo.lon}`

    } catch (e) {
        // console.log (e)
        alert (e)
    }

}

navigator.geolocation.getCurrentPosition (obterLocalizacao, tratarErro, options)

async function obterDados () {
    try {
        let req = await fetch (url)
        let dados = await req.json ()
        return dados;
    } catch (e) {
        // console.log (e)
        // console.log (url)
        alert (e)
        return null;
    }
}

let dados = {}

let header = document.querySelector ('header span')
let main = document.querySelector ('main')
let footer = document.querySelector ('footer')

let table = document.querySelector ('main table')

let button = document.querySelector ('header button')



button.onclick = () => {
    alert (
        'lat: '+geo.lat+'\n'+
        'lon: '+geo.lon+'\n'+
        'alt: '+geo.alt
    )
}


setTimeout (()=> {
    obterDados ().then ((req) => {
        dados = req;
        if (dados === null) {
            return;
        }

        let units = dados.properties.meta.units
        let clima = dados.properties.timeseries[0]
        let code =  clima.data.next_1_hours.summary.symbol_code

        main.style.backgroundImage = `url(https://api.met.no/images/weathericons/svg/${code}.svg)`

        header.innerHTML = ' Dados referentes a '+new Date (clima.time).toLocaleString ()+'<br>'
        for (i in units) {
            let tr = document.createElement ('tr')
            let data = document.createElement ('td')
            let value = document.createElement ('td')

            tr.appendChild (data)
            tr.appendChild (value)
            data.innerHTML = Meteo[i]
            value.innerHTML = (clima.data.instant.details[i] ?? '0') + units[i]

            table.appendChild (tr)
        }

        let atualizado = dados.properties.meta.updated_at;
        footer.innerHTML = `Atualizado ${new Date(atualizado).toLocaleString ()}`
    })
}, 1000)

if ('serviceWorker' in navigator) {
    window.addEventListener ('load', () => {
        navigator.serviceWorker.register ('sw.js')
        .then (reg => {
            // console.log ('registrado!')
            // console.log (reg)
        })
        .catch (err => {
            // console.log ('falha ao registrar')
            // console.log (err)
        })
    })
}

