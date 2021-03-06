import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import 'fontsource-roboto';
import Table from './Table';
import { sortData, fixStatesData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import USTimelineMap from './USTimelineMap';


function App() {

  // APP LEVEL STATE
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 28.033886, lng: 1.659626 }); // roughly center of Atlantic Ocean
  const [mapZoom, setMapZoom] = useState(2);
  const [graphSetting, setGraphSetting] = useState("cases");
  const [totalSetting, setTotalSetting] = useState("daily");
  const [timeSetting, setTimeSetting] = useState("all");
  const [stateData, setStateData] = useState([]);
  const [USFocus, setUSFocus] = useState(false);
  const [isUSHistory, setIsUSHistory] = useState(false);
  const [historyUSData, setHistoryUSData] = useState([]);

  const USCenter = { lat: 38.272689, lng: -99.980447 };
  const USZoom = 4;


  // https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {

    const getHistoricUS = async () => {
      let statesData;
      await fetch("https://disease.sh/v3/covid-19/nyt/states?lastdays=all")
        .then((response) => response.json())
        .then((data) => {
          statesData = data;
        });

      statesData = fixStatesData(statesData);
      setHistoryUSData(statesData);
      
    }

    getHistoricUS();
  }, []);

  

  useEffect(() => {
    if (country === 'US') {
      setUSFocus(true);
    } else {
      setUSFocus(false);
    }
  }, [country])

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

    const getStateData = async () => {
      await fetch("https://disease.sh/v3/covid-19/states")
        .then((response) => response.json())
        .then((data) => {
          setStateData(data);
        });
    }

    getCountriesData();
    getStateData();
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
        if (countryCode === 'worldwide') {
          setMapCenter({ lat: 28.033886, lng: 1.659626 });
          setMapZoom(2);
        } else {
          const countryLat = data.countryInfo.lat;
          const countryLong = data.countryInfo.long;
          setMapCenter({ lat: countryLat, lng: countryLong });
          setMapZoom(4);
        }

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

  const getCountryName = (country) => {
    if (country === 'worldwide') {
      return 'Worldwide';
    } else {
      for (var i = 0; i < countries.length; i++) {
        if (countries[i].value === country) {
          return countries[i].name;
        }
      }
    }
  }

  const toggleUSHistory = (event) => {
    setIsUSHistory(event.target.checked);
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

        <div className="app__us_toggle">
          <FormGroup className="app__toggle_formgroup">
            <FormControlLabel
              control={<Switch checked={isUSHistory} onChange={toggleUSHistory} />}
              label="Show US Timeline"
            />
          </FormGroup>
        </div>

        {/* Map (duh) */}
        {isUSHistory
          ? <USTimelineMap data={historyUSData} mapCenter={USCenter} mapZoom={USZoom} date={"2021-01-06"}/>
          : <Map states={stateData} countries={mapCountries} mapCenter={mapCenter} mapZoom={mapZoom} updateAppCountry={(country) => updateCountry(country)} USFocus={USFocus} />
        }

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
              <h3>{`${getCountryName(country)} Cases Graph`}</h3>
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
              <LineGraph casesType={graphSetting} dataType={totalSetting} timeType={timeSetting} country={country} />
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

export default App;
