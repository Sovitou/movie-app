import { images } from "@/constants/images";
import "../../app/global.css";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/searchBar"
import { icons } from "@/constants/icons";
import { Movie } from "@/interfaces/interfaces";
import { searchMovies } from "@/service/searchMovies";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  View,
} from "react-native";


export default function Index() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = async (query: string) => {
    if (!query) {
      setMovies([]);
      setSearchQuery("");
      setTotalResults(0);
      return;
    }
    setLoading(true);
    setSearchQuery(query);
    const { movies: result, totalResults: count } = await searchMovies(query);
    setMovies(result);
    setTotalResults(count);
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />
      <Image source={images.bg} className="absolute w-full " />
      <FlatList
        data={movies}
        keyExtractor={(item, index) => item.imdbID + index}
        numColumns={2}
        renderItem={({ item }) => <MovieCard movie={item} />}
        ListHeaderComponent={
          <>
            <Image source={icons.logo} className="self-center m-6" />
            <SearchBar placeholder="Search movie..." onSearch={handleSearch} />
            {searchQuery && !loading && movies.length > 0 ? (
              <View className="my-4">
                <Text className="text-2xl font-bold text-text-primary">
                  Search Results
                </Text>
                <Text className="text-secondary-text mt-1">
                  Found {totalResults} results...
                </Text>
              </View>
            ) : null}
          </>
        }
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <View className="flex-1 justify-center items-center h-64">
              <ActivityIndicator size="large" color="#7A3AFF" />
            </View>
          ) : (
            <View className="flex-1 items-center justify-center mt-20 h-64">
              {searchQuery ? (
                <Text className="text-secondary-text">
                  No results found for `{searchQuery}`.
                </Text>
              ) : (
                <Text className="text-secondary-text">
                  Find your next favorite movie.
                </Text>
              )}
            </View>
          )
        }
      />
    </View>
  );
}
