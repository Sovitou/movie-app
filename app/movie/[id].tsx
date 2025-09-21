import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Details = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Details of movie : {id}</Text>
    </View>
  );
};

export default Details;
