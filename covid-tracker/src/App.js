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

  // APP LEVEL STATE
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796}); // roughly center of Atlantic Ocean
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

          let sortedData = sortData(data);
          setMapCountries(data);
          setTableData(sortedData);
          // update the countries state variable 
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  // updates state based on the primary country dropdown
  const onCountryChange = async (event) => {
    
    let countryCode;

    if (!("countryInfo" in event)) {
      countryCode = event.target.value;
    } else {
      countryCode = event.countryInfo.iso2;
    }
    

    // if the dropdown value is worldwide get all data else get the selected country data
    const url = countryCode === "worldwide"
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    // call the API for the data and set the state with the selected country and the fetched country data
    await fetch(url)
      .then(response => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        const countryLat = data.countryInfo.lat;
        const countryLong = data.countryInfo.long;
        setMapCenter({lat: countryLat, lng: countryLong});
        setMapZoom(4);
      });

    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    // https://disease.sh/v3/covid-19/all
  }

  // updates state based on the graph cases/deaths dropdown
  const onGraphChange = (event) => {
    const graphSettingValue = event.target.value;
    setGraphSetting(graphSettingValue);

  }

  // updates state based on the graph total/daily dropdown
  const onTotalDailyChange = (event) => {
    const totalSettingValue = event.target.value;
    setTotalSetting(totalSettingValue);
  }

  // updates state based on the graph time dropdown
  const onTimeChange = (event) => {
    const timeSettingValue = event.target.value;
    setTimeSetting(timeSettingValue);
  }

  const updateCountry = (country) => {
    onCountryChange(country);
  }

  return (
    // app
    <div className="app">

      {/* App left pane (map, stats, country dropdown) */}
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          
          {/* Dropdown to choose what country stats are shown for, default worldwide.  */}
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              {/* Create a menu item for all the countries fetched by the API (stored in 'countries' var) */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Stat boxes for the selected country, using data from API call stored in countryInfo var */}
        <div className="app__stats">
          <InfoBox title="COVID-19 Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered Cases" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        {/* Map (duh) */}
        <Map countries={mapCountries} mapCenter={mapCenter} mapZoom={mapZoom} updateAppCountry={(country) => updateCountry(country)} />

      </div>
      
      {/* App right pane (table, graph) */}
      <div className="app__right">
        <Card>
          <CardContent>

            {/* Table showing cases for countries sorted by cases, static for now */}
            <div className="app__table">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
            </div>

            {/* Linegraph showing cases/deaths, with options for changing the time range and whether it is total or daily change */}
            <div className="app__graph">
              <h3>Worldwide New Cases</h3>
              <div className="app__graph_options">

                {/* Cases/Deaths */}
                <FormControl className="graph__case_type">
                  <Select variant="outlined" onChange={onGraphChange} value={graphSetting}>
                    <MenuItem value="cases">Cases</MenuItem>
                    <MenuItem value="deaths">Deaths</MenuItem>
                  </Select>
                </FormControl>

                {/* Time */}
                <FormControl className="graph__time">
                  <Select variant="outlined" onChange={onTimeChange} value={timeSetting}>
                    <MenuItem value="week">Weekly</MenuItem>
                    <MenuItem value="month">Monthly</MenuItem>
                    <MenuItem value="3month">3 Months</MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                    <MenuItem value="all">All</MenuItem>
                  </Select>
                </FormControl>

                {/* Total/Daily Change */}
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
