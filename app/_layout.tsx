import { Stack } from "expo-router";
import { SessionProvider } from "../context/SessionProvider";
import "./global.css";
export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack>
        {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
      </Stack>
    </SessionProvider>
  );
}
