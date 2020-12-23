import './App.css';
import {
  MenuItem,
  FormControl,
  Select
} from "@material-ui/core";

function App() {
  return (
    <div className="app">
      <h1>COVID-19 Tracker</h1>
      <FormControl className="app__dropdown">
        <Select variant="outlined" value="abc">
          
          <MenuItem value="worldwide">Worldwide1</MenuItem>
          <MenuItem value="worldwide">Worldwide2</MenuItem>
          <MenuItem value="worldwide">Worldwide3</MenuItem>
          <MenuItem value="worldwide">Worldwide4</MenuItem>

        </Select>
      </FormControl>

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
