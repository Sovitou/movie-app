import { Movie } from "@/interfaces/interfaces";
import { Image, Text, TouchableOpacity, View } from "react-native";

const MovieCard = ({ movie }: { movie: Movie }) => (
  <TouchableOpacity className="w-[48%] mb-4 bg-card-background rounded-lg border border-border-color">
    <View className="aspect-[2/3] relative">
      <Image
        source={{ uri: movie.Poster }}
        className="w-full h-full rounded-t-lg"
        resizeMode="cover"
      />
      <View
        className={`absolute top-2 left-2 px-2 py-1 rounded-full ${
          movie.Type === "series"
            ? "bg-primary-accent"
            : "bg-card-background/80"
        }`}
      >
        <Text className="text-white text-[10px] font-bold">
          {movie.Type.toUpperCase()}
        </Text>
      </View>
    </View>
    <View className="p-3">
      <Text className="text-white text-sm font-bold" numberOfLines={1}>
        {movie.Title}
      </Text>
      <Text className="text-secondary-text text-xs mt-1">{movie.Year}</Text>
    </View>
  </TouchableOpacity>
);

export default MovieCard;
