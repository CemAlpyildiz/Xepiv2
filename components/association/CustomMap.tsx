import React, { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { API_URL } from '@env';
import axios from 'axios';

interface MarkerData {
  key: string;
  title: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  description: string;
}

const CustomMap = () => {
  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const [markers, setMarkers] = useState<MarkerData[]>([]);

  console.log(API_URL);
  console.log('fezfezfz');

  const onRegionChange = (region: any) => {
    console.log(region);
  };

  const getAssociations = async (): Promise<any> => {
    try {
      const response = await axios.get(API_URL+'/associations/');
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchMarkers = async () => {
      const oAssociations = await getAssociations();
      const aAssociations = Array.from(oAssociations);

      const newMarkers = aAssociations.map((association: any, index: number) => {
        let oLocation = association.coordinate.split(",");

        return {
          key: index.toString(),
          title: association.name,
          coordinate: {
            latitude: parseFloat(oLocation[1]),
            longitude: parseFloat(oLocation[0]),
          },
          description: "Lorem ipsum dolor sit emet",
        };
      });

      setMarkers(newMarkers);
    };

    fetchMarkers();
  }, []);

  return (
    <View style={{ marginTop: statusBarHeight }}>
      <MapView
        style={styles.map}
        onRegionChange={onRegionChange}
        initialRegion={{
          latitude: 43.59971795463876,
          latitudeDelta: 0.3285121395972439,
          longitude: 3.878778163343668,
          longitudeDelta: 0.2249444648623471,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container_map: {},
  map: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
  },
});

export default CustomMap;
