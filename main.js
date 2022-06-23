// Get Local IP
const resultIP = document.querySelector('.result-ip');
const resultCity = document.querySelector('.city');
const resultCountry = document.querySelector('.country');
const resultCode = document.querySelector('.result-code');
const resultTimezone = document.querySelector('.result-timezone');
const resultIsp = document.querySelector('.result-isp');

// Updata UI
const renderIP = text => {
  resultIP.textContent = text;
};
const renderCity = text => {
  if (!text) {
    resultCode.textContent = '';
  } else {
    resultCity.textContent = text;
  }
};
const renderCountry = text => {
  resultCountry.textContent = text;
};
const renderCode = text => {
  if (!text) {
    resultCode.textContent = '';
  } else {
    resultCode.textContent = text;
  }
};
const renderTimezone = text => {
  resultTimezone.textContent = text;
};
const renderIsp = text => {
  resultIsp.textContent = text;
};
const updateUI = (ip, city, country, code, timezone, isp) => {
  renderIP(ip);
  renderCity(city);
  renderCountry(country);
  renderCode(code);
  renderTimezone(timezone);
  renderIsp(isp);
};

// Render Map
let map;
const renderMap = (lat, lng) => {
  if (map != undefined) map = map.remove();

  map = L.map('map').setView([lat, lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(map);

  let leafletIcon = L.icon({
    iconUrl: './images/icon-location.svg',
  });

  L.marker([lat, lng], { icon: leafletIcon }).addTo(map);
};

// Render Geolocation
const renderGeolocaiton = ip => {
  const geoUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=at_tjuliQFQ6pP6qXiWJuQsLqNw15BDS&ipAddress=${ip}`;
  fetch(geoUrl)
    .then(res => {
      if (!res.ok)
        throw new Error('Please enter a valid IPv4 address or domain name!');
      return res.json();
    })
    .then(data => {
      const ip = data.ip;
      const city = data.location.city;
      const country = data.location.country;
      const code = data.location.postalCode;
      const timezone = data.location.timezone.slice(1);
      const isp = data.isp;
      const { lat, lng } = data.location;
      updateUI(ip, city, country, code, timezone, isp);
      renderMap(lat, lng);
    })
    .catch(err => {
      alert(err);
    });
};

// Convert and Render Geolocation
const convertAndRender = domain => {
  fetch(`https://dns.google/resolve?name=${domain}`)
    .then(res => res.json())
    .then(data => {
      const ip = data.Answer?.[0].data;
      return ip;
    })
    .then(ip => {
      renderGeolocaiton(ip);
    });
};

// Test Input Type
const isIP = inp => {
  const ipRegex = /^\d+.\d+.\d+.\d+$/;
  return ipRegex.test(inp);
};

// Get User Input And Render Result
const input = document.querySelector('.ip-input');
const btn = document.querySelector('.arrow');

const getInputIp = () => {
  let inp = input.value;

  // Clean Up Whitespace
  inp = inp.replaceAll(' ', '');

  // Test Input Type
  if (!isIP(inp)) {
    convertAndRender(inp);
    return;
  }

  renderGeolocaiton(inp);
};

// Listen For Btn Click Or Enter
btn.addEventListener('click', getInputIp);
document.addEventListener('keydown', function (e) {
  if (e.code == 'Enter') {
    getInputIp();
  }
});

// Get Local IP When First Loading
const getLocalIP = () =>
  fetch(
    'https://ipgeolocation.abstractapi.com/v1/?api_key=8a9dbe3073b042aca3bd0d6cb1f07448'
  )
    .then(res => {
      if (!res.ok) throw new Error('Cannot access current IP address');

      return res.json();
    })
    .then(data => {
      const localIP = data.ip_address;
      renderGeolocaiton(localIP);
    });

getLocalIP();
