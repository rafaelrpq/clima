let local = {
    lat : 0,
    lon : 0
}

const Meteo = {
    'air_pressure_at_sea_level' : 'Pressão Atmosférica',
    'air_temperature'           : 'Temperatura',
    'cloud_area_fraction'       : 'Nebulosidade',
    'precipitation_amount'      : 'Preciptação',
    'relative_humidity'         : 'Umidade Relativa',
    'wind_from_direction'       : 'Direção do Vento',
    'wind_speed'                : 'Velocidade do vento',
}

function tratarErro (erro) {
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

function obterLocalizacao (pos) {
    local.lat = pos.coords.latitude
    local.lon = pos.coords.longitude
}

async function obterDados () {

    navigator.geolocation.getCurrentPosition( obterLocalizacao, tratarErro)

    let url = `https://api.met.no/weatherapi/locationforecast/2.0/compact.json?lat=${local.lat}&lon=${local.lon}`

    try {
        let req = await fetch (url, {mode : 'no-cors'})
        let dados = await req.json ()
        return dados;
    } catch (e) {
        console.log ('erro => ', e)
    }
    return null
}

let dados = {}

let header = document.querySelector ('header')
let main = document.querySelector ('main')
let footer = document.querySelector ('footer')

let table = document.querySelector ('main table')

obterDados ().then ((req) => {
    dados = req;
    if (dados === null) {
        return;
    }

    let units = dados.properties.meta.units
    let clima = dados.properties.timeseries[0]
    let code =  clima.data.next_1_hours.summary.symbol_code

    document.body.style.backgroundImage = `url(https://api.met.no/images/weathericons/svg/${code}.svg)`
    document.body.style.backgroundRepeat = `no-repeat`
    document.body.style.backgroundPosition = `center`

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


if ('serviceWorker' in navigator) {
    window.addEventListener ('load', () => {
        navigator.serviceWorker.register ('sw.js')
        .then (reg => {
            console.log ('registrado!')
            console.log (reg)
        })
        .catch (err => {
            console.log ('falha ao registrar')
            console.log (err)
        })
    })
}

