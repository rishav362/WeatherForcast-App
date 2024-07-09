import {useState, useEffect } from "react";
import Forecast from "./components/Forecast.jsx";
import Inputs from "./components/Inputs.jsx";
import TempAndDetails from "./components/TempAndDetails.jsx";
import TimeAndLocation from "./components/TimeAndLocation.jsx";
import TopButtons from "./components/TopButtons.jsx";
import getFormattedWeatherData from "./services/weatherServices.js";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const App = () =>{
  const [query,setQuery] =useState({q:"tokyo" })
  const [units,setUnits] =useState('metric')
  const [weather,setWeather] = useState(null)
  const  capitalizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

const getWeather = async () => {
  const cityName = query.q ? query.q : 'current location';
  toast.info(`fetching weather data for ${capitalizeFirstLetter(cityName)}`);

 await getFormattedWeatherData({...query,units })
 .then((data) => {
  toast.success(`fetched weather data for ${data.name}, ${data.country}`)
  setWeather(data);
 });
 //console.log(data);
  };

  useEffect(()=>{
    getWeather();
  },[query,units]);
  
  const formatBackground =()=>{
    if (!weather) return 'from-cyan-600 to=blue-700';
    const threshold =units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-600 to-blue-700";
    return "from-yellow-600 to=orange-700";

  };

  return (
    <div className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 ${formatBackground()}`}>
      <TopButtons setQuery = {setQuery}/>
      <Inputs  setQuery={setQuery} setUnits = {setUnits} />

      {weather && (
        <>
      <TimeAndLocation weather={weather}/>
      <TempAndDetails weather ={weather} units={units}/>
      <Forecast title="3 hour step forecast" data={weather.hourly} />
      <Forecast title ="daily forecast" data = {weather.daily} />
      </>
      )}

      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored"/>
    </div>
  );
};

export default App;
