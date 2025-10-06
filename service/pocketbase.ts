import Constants from "expo-constants";
import PocketBase from "pocketbase";
import { Platform } from "react-native";

// Determine PocketBase URL from environment or Expo config, with a sensible default.
// Note: when running on emulators/devices, localhost (127.0.0.1) may not point to your
// machine. Use the appropriate host (10.0.2.2 for Android emulator, or your machine LAN IP).
const DEFAULT_POCKETBASE_URL = "http://172.16.104.91:8090";

// Try the following, in order:
// 1. process.env.POCKETBASE_URL (if set)
// 2. Expo config extra POCKETBASE_URL (app.json / eas) via Constants.expoConfig.extra
// 3. fallback to DEFAULT_POCKETBASE_URL
const envUrl =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.POCKETBASE_URL) ||
  (Constants.expoConfig &&
    Constants.expoConfig.extra &&
    Constants.expoConfig.extra.POCKETBASE_URL);

let resolvedUrl = (envUrl as string) || DEFAULT_POCKETBASE_URL;

// If running on Android emulator, 127.0.0.1 points to the device; use 10.0.2.2 to reach host machine
if (Platform.OS === "android" && resolvedUrl.includes("127.0.0.1")) {
  const androidLocal = resolvedUrl.replace("127.0.0.1", "10.0.2.2");
  console.warn(
    `[pocketbase] Detected Android platform and localhost URL. Rewriting ${resolvedUrl} -> ${androidLocal} to reach host machine from emulator.`
  );
  resolvedUrl = androidLocal;
}

export const POCKETBASE_URL = resolvedUrl;

console.log("[pocketbase] using URL =>", POCKETBASE_URL);

const pb = new PocketBase(POCKETBASE_URL);

export default pb;
