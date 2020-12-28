import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";
import { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import 'fontsource-roboto';
import Table from './Table';
import { sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [graphSetting, setGraphSetting] = useState("cases");
  const [totalSetting, setTotalSetting] = useState("daily");
  const [timeSetting, setTimeSetting] = useState("all");

  // https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      });
  }, []);

  // on component load, fetch country data in json format
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          // map each country object into a simpler object containing the name and abbreviation only
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));

          const sortedData = sortData(data);
          setTableData(sortedData);
          // update the countries state variable 
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === "worldwide"
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
      })

    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    // https://disease.sh/v3/covid-19/all
  }

  const onGraphChange = (event) => {
    const graphSettingValue = event.target.value;

    setGraphSetting(graphSettingValue);

  }

  const onTotalDailyChange = (event) => {
    const totalSettingValue = event.target.value;
    setTotalSetting(totalSettingValue);
  }

  const onTimeChange = (event) => {
    const timeSettingValue = event.target.value;
    setTimeSetting(timeSettingValue);
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="COVID-19 Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered Cases" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        {/* Map */}
        <Map center={mapCenter} zoom={mapZoom} />
      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <div className="app__table">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
            </div>
            <div className="app__graph">
              <h3>Worldwide New Cases</h3>
              <div className="app__graph_options">
                <FormControl className="graph__case_type">
                  <Select variant="outlined" onChange={onGraphChange} value={graphSetting}>
                    <MenuItem value="cases">Cases</MenuItem>
                    <MenuItem value="deaths">Deaths</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className="graph__time">
                  <Select variant="outlined" onChange={onTimeChange} value={timeSetting}>
                    <MenuItem value="week">Weekly</MenuItem>
                    <MenuItem value="month">Monthly</MenuItem>
                    <MenuItem value="3month">3 Months</MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                    <MenuItem value="all">All</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className="graph__total_or_daily">
                  <Select variant="outlined" onChange={onTotalDailyChange} value={totalSetting}>
                    <MenuItem value="total">Total</MenuItem>
                    <MenuItem value="daily">Daily Change</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <LineGraph casesType={graphSetting} dataType={totalSetting} timeType={timeSetting}/>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}

export default App;
