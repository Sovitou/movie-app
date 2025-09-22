import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

type SearchBarType = {
  placeholder: string;
  onSearch: any;
};

const SearchBar = ({ placeholder, onSearch }: SearchBarType) => {
  const [query, setQuery] = useState("");

  return (
    <View className="flex-row items-center bg-accent rounded-full px-3 py-2 border-gray-200">
      {/* Search Icon */}
      <Ionicons name="search" size={20} color="white" className="ml-2" />

      {/* Input Field */}
      <TextInput
        className="flex-1 ml-2 text-text-primary"
        placeholder={placeholder || "Search..."}
        placeholderTextColor="white"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => onSearch(query)}
      />

      {/* Clear Button */}
      {query.length > 0 && (
        <TouchableOpacity onPress={() => setQuery("")}>
          <Ionicons
            name="close-circle"
            size={24}
            color="white"
            className="mr-2"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
