import { useState, useEffect } from 'react';
import SensorCard from '@/components/sensors/SensorCard';
import { sensorData, SensorData } from '@/data/mockData';
import { RefreshCw, Clock, Leaf, TrendingUp, AlertTriangle } from 'lucide-react';
import Loading from './Loading';
import { parseFields } from '@/hooks/parseFields';


const Dashboard = () => {

  const [thinkSpeakData,setThinkSpeakData]=useState(null)

useEffect(() => {
  // first time call
  fetchThinkSpeak();

  // every 15 seconds call
  const interval = setInterval(() => {
    fetchThinkSpeak();
  }, 5000); // 5 seconds

  // cleanup (important)
  return () => clearInterval(interval);
}, []);


const fetchThinkSpeak = () => {
  fetch(
    "https://api.thingspeak.com/channels/3232296/feeds.json?api_key=1DF7VGBJUG072J8I&results=1",
    {
      method: "GET",



































































































      5







      
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const lastFeed = data.feeds[0]; // only one result

      setThinkSpeakData(lastFeed);
    })
    .catch((err) => {
      console.log("Error fetching ThingSpeak data", err);
    });
};


console.log("overall all entry" , thinkSpeakData)

console.log("field1",thinkSpeakData?.field1)
console.log("field2",thinkSpeakData?.field2)
console.log("field3",thinkSpeakData?.field3)
console.log("field4",thinkSpeakData?.field4)
console.log("field5",thinkSpeakData?.field5)



  const [sensors, setSensors] = useState<SensorData[]>(sensorData);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [valve1Status, setValve1Status] = useState(true);
  const [valve2Status, setValve2Status] = useState(false);



  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh with slight variations
    setTimeout(() => {
      const updatedSensors = sensors.map((sensor) => ({
        ...sensor,
        value:
          sensor.id === 'motor-status' || sensor.id === 'motor-status-2'
            ? sensor.value
            : sensor.id === 'valve-1' || sensor.id === 'valve-2'
            ? sensor.value
            : sensor.id === 'ph-level'
            ? +(sensor.value + (Math.random() - 0.5) * 0.2).toFixed(1)
            : Math.round(sensor.value + (Math.random() - 0.5) * 5),
      }));
      setSensors(updatedSensors);
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const toggleValve1 = () => {
    setValve1Status(!valve1Status);
    setSensors(sensors.map((s) => 
      s.id === 'valve-1' ? { ...s, value: valve1Status ? 0 : 1 } : s
    ));
  };

  const toggleValve2 = () => {
    setValve2Status(!valve2Status);
    setSensors(sensors.map((s) => 
      s.id === 'valve-2' ? { ...s, value: valve2Status ? 0 : 1 } : s
    ));
  };

  const handleSensorToggle = (sensorId: string) => {
    if (sensorId === 'valve-1') {
      toggleValve1();
    } else if (sensorId === 'valve-2') {
      toggleValve2();
    } else if (sensorId === 'motor-status' || sensorId === 'motor-status-2') {
      setSensors(sensors.map((s) => 
        s.id === sensorId ? { ...s, value: s.value === 1 ? 0 : 1 } : s
      ));
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [sensors]);

  const goodSensors = sensors.filter((s) => s.status === 'good').length;
  const warningSensors = sensors.filter((s) => s.status === 'warning').length;

  if(!thinkSpeakData){
    return <Loading />
  }

  return (
    <div className="page-container">

      {/* testing */}

<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {/* Soil Moisture */}
  <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
    <p className="text-sm text-gray-500">Soil Moisture</p>
    <p className="mt-2 text-3xl font-semibold text-green-600">
      {thinkSpeakData?.field1 ?? "--"}
    </p>
  </div>

  {/* Temperature */}
  <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
    <p className="text-sm text-gray-500">Temperature</p>
    <p className="mt-2 text-3xl font-semibold text-red-500">
      {thinkSpeakData?.field2 ?? "--"} °C
    </p>
  </div>

  {/* Humidity */}
  <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
    <p className="text-sm text-gray-500">Humidity</p>
    <p className="mt-2 text-3xl font-semibold text-blue-500">
      {thinkSpeakData?.field3 ?? "--"} %
    </p>
  </div>

  {/* Water Level */}
  <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
    <p className="text-sm text-gray-500">Water Level</p>
    <p className="mt-2 text-3xl font-semibold text-cyan-600">
      {thinkSpeakData?.field4 ?? "--"}
    </p>
  </div>

  {/* Motor Status */}
  <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
    <p className="text-sm text-gray-500">Motor Status</p>
    <p
      className={`mt-2 inline-block rounded-full px-4 py-1 text-lg font-semibold text-white ${
        thinkSpeakData?.field5 === "1"
          ? "bg-green-500"
          : "bg-red-500"
      }`}
    >
      {thinkSpeakData?.field5 === "1" ? "ON" : "OFF"}
    </p>
  </div>
</div>



      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="section-title flex items-center gap-3">
              <Leaf className="h-8 w-8 text-primary" />
              Farm Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring of your agricultural parameters
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-primary self-start sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{goodSensors}</p>
              <p className="text-sm text-muted-foreground">Optimal</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/15">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{warningSensors}</p>
              <p className="text-sm text-muted-foreground">Attention</p>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {lastUpdated.toLocaleTimeString()}
              </p>
              <p className="text-sm text-muted-foreground">Last updated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sensors.map((sensor, index) => (
          <div
            key={sensor.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <SensorCard sensor={sensor} onToggle={handleSensorToggle} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Quick Actions
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Control your farm equipment remotely
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary text-sm py-2 px-4">
            Start Irrigation
          </button>
          <button className="btn-secondary text-sm py-2 px-4">
            Toggle Motor
          </button>
          <button className="btn-accent text-sm py-2 px-4">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
