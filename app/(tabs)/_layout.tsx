import { Tabs } from "expo-router";
import React from "react";
import { ImageBackground, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { images } from "@/constants/images";

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
};

const TabIcon = ({ name, focused }: TabIconProps) => {
  const iconName = focused ? name : (`${name}-outline` as keyof typeof Ionicons.glyphMap);
  const iconColor = focused ? "#151312" : "#CDCDE0";
  const iconSize = focused ? 24 : 26;

  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex w-16 h-16 justify-center items-center rounded-full overflow-hidden"
        resizeMode="cover"
      >
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      </ImageBackground>
    );
  }

  return (
    <View className="flex items-center justify-center">
      <Ionicons name={iconName} size={iconSize} color={iconColor} />
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#CDCDE0",
        
        
        tabBarItemStyle: {
          flex: 1, // Make each tab item take up equal width
          justifyContent: "center",
          alignItems: "center",
          overflow: "visible", 
         
        },
        // ------------------------------------

        tabBarStyle: {
          display: "flex",
          // We don't need justifyContent here anymore since flex:1 handles distribution
          flexDirection: 'row', // Ensure items are laid out horizontally
          alignItems: "center", // Vertically centers the items within the bar
          backgroundColor: "#0f0D23",
          borderRadius: 50,
          marginHorizontal: 16,
          marginBottom: 24,
          position: "absolute",
          height: 80, // A little more height can feel more balanced
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="search" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="bookmark" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;