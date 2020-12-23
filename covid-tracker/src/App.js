import './App.css';
import {
  MenuItem,
  FormControl,
  Select
} from "@material-ui/core";
import { useState } from 'react';

function App() {

  const [countries, setCountries] = useState(['USA', 'UK', 'India']); 

  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value="abc">
            
            {countries.map((country) => (
              <MenuItem value={country}>{country}</MenuItem>
            ))}
            
            {/* <MenuItem value="worldwide">Worldwide1</MenuItem>
            <MenuItem value="worldwide">Worldwide2</MenuItem>
            <MenuItem value="worldwide">Worldwide3</MenuItem>
            <MenuItem value="worldwide">Worldwide4</MenuItem> */}

          </Select>
        </FormControl>
      </div>
      

      {/* Header */}
      {/* Title + Select input dropdown field */}

      {/* Info Box */}
      {/* Info Box */}
      {/* Info Box */}

      {/* Table */}
      {/* Graph */}

      {/* Map */}
    </div>
  );
}

export default App;
