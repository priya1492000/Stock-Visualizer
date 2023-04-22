import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import {CategoryScale, Chart, LinearScale,PointElement,
  LineElement, Title, Tooltip, Legend} from 'chart.js'; 
Chart.register(CategoryScale, LinearScale,PointElement,
  LineElement, Title, Tooltip, Legend);

const options = [
  { value: "AAPL", label: "Apple Inc." },
  { value: "GOOGL", label: "Alphabet Inc." },
  { value: "MSFT", label: "Microsoft Corporation" },
];

function App() {
  const [symbol, setSymbol] = useState(options[0]);
  const [data, setData] = useState(null);

  const handleSymbolChange = (symbol) => {
    setSymbol(symbol);
  };

useEffect(() => {
  if (symbol){
const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/stock/${symbol.value}/`);
      if (response && response.data){
      const labels = response.data.map((d) => d.Date);
      const close = response.data.map((d) => d.Close);
      const volume = response.data.map((d) => d.Volume);
      
      setData({
        labels:labels,
        datasets: [
          {
            label: "Close Price",
            data: close,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Volume",
            data: volume,
            fill: false,
            borderColor: "rgba(255, 99, 132, 0.2)",
            tension: 0.1,
          },
        ],
      });
    };
    } catch (error) {
      console.log(error);
    }
  };
    fetchData();
};
  }, [symbol]);

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Stock Viewer</h1>
      <Select options={options} value={symbol} onChange={handleSymbolChange} />
      {data?<Line data={data} />:null}
      
    </div>
  );
}

export default App;
