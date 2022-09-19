
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import Card from 'react-bootstrap/Card';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
	const { DateTime } = require("luxon");
	const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_CODE}`;
	const [ipdata, setIpdata] = useState();
	const [countrydata, setCountrydata] = useState();
	const localtime = DateTime.now();

	useEffect(() => {
		fetch(url)
			.then((response) => response.json())
			.then((data) => setIpdata(data))
			.catch((error) => console.log(error));
	}, [url]);

	useEffect(() => {
		if (ipdata) {
			const url2 = `https://restcountries.com/v3.1/alpha?codes=${ipdata.location.country}`;
			fetch(url2)
				.then((response) => response.json())
				.then((data) => setCountrydata(data))
				.catch((error) => console.log(error));
		}
	}, [ipdata]);

	if (ipdata) {
		console.log("Ipdata", ipdata);
		if (countrydata && countrydata.code !== 403) {
			console.log("countrydata", countrydata);
			
		}
	}


	return (
		<div className="App">
			{ipdata ? (
				<>
					<Card>
						<MapContainer center={[ipdata.location.lat, ipdata.location.lng]} zoom={13} scrollWheelZoom={false}>
							<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
							<Marker position={[ipdata.location.lat, ipdata.location.lng]}>
								<Popup>Hier wohnt er!</Popup>
							</Marker>
						</MapContainer>
						<Card.Body>
							<Card.Title>IP: {ipdata.ip}</Card.Title>
							<Card.Text>
								<p>Land: {ipdata.location.country}</p>
								<p>Region: {ipdata.location.region}</p>
								<p>Stadt: {ipdata.location.city}</p>
								<p>Koordinaten: {ipdata.location.lat}, {ipdata.location.lng}</p>
								<p>Lokalzeit: {localtime.setZone("UTC" + ipdata.location.timezone.replace("0", "")).toISO()}</p>
								<p>Die Adresse befindet sich in Zeitzone: {localtime.zoneName}</p>

								{countrydata && countrydata.code !== 403 ? (
									<div>
										<img src={ countrydata[0].flags.png } alt={ countrydata[0].name.nativeName.deu.official } />
										{ console.log(countrydata) }
									</div>
								) : (
									'Bitte warten auf Country Daten'
								)}
							</Card.Text>
						</Card.Body>
					</Card>
				</>
			) : (
				'Bitte warten'
			)}
		</div>
	);
}
