import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_SIZE } = Dimensions.get("window");

const API_KEY = "34253297f7c405d1dea72795caa625b6";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-husts",
  Snow: "sno,",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Text
                  style={{
                    fontSize: 65,
                    color: "white",
                    alignSelf: "flex-end",
                  }}
                >
                  °C
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFB319",
  },
  city: {
    flex: 1.3,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 50,
    fontWeight: "500",
    color: "white",
    paddingHorizontal: 20,
  },
  weather: {},
  day: {
    width: SCREEN_SIZE,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 98,
    fontWeight: "600",
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 48,
    color: "white",
    fontWeight: "500",
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: "white",
    fontWeight: "500",
  },
});
