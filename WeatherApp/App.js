import * as Location from "expo-location"
import React, { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  ScrollView
} from 'react-native';
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = `f582a82c4df3df88abe6969f0ef71cc1`

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rain",
  Drizzle: "rains",
  Thunderstorm: "lighting",

}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const granted = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: {
        longitude,
        latitude
      }
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({
      longitude,
      latitude
    }, { useGoogleMaps: false });
    setCity(location[0].city)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily)
  }
  useEffect(() => {
    getWeather();
  }, [])
  return <View style={styles.container}>
    <View style={styles.city}>
      <Text style={styles.cityName}>{city}</Text>
    </View>
    <ScrollView
      pagingEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.weather}>
      {
        days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              style={{
                marginTop: 10
              }}
              size="large" />
          </View>
        )
          : (days.map(
            (day, index) => <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between"
                }}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="white" style={{ marginTop: 30 }} />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
      }
    </ScrollView>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato"
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "white"
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    justifyContent: "flex-start",
    alignItems: "left"
  },
  temp: {
    marginTop: 60,
    fontWeight: "600",
    fontSize: 130,
    color: "white"
  },
  description: {
    marginTop: -20,
    fontSize: 40,
    color: "white"
  },
  tinyText: {
    fontSize: 30,
    color: "white"
  }
})