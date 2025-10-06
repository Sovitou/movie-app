import { SocialConnections } from "@/components/social-connections";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import pb from "@/service/pocketbase";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  type TextInput,
  View,
} from "react-native";

export function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onSubmit() {
    void handleContinue();
  }

  async function handleContinue() {
    if (!email.trim() || !password) {
      Alert.alert("Validation", "Email and password are required");
      return;
    }

    setLoading(true);
    try {
      // Authenticate with PocketBase. Collection 'users' is the default builtin users collection.
      await pb.collection("users").authWithPassword(email, password);
      console.log(pb.authStore.isValid);
      console.log(pb.authStore.token);

      // redirect to main app screen
      router.replace("/(tabs)");
    } catch (err: any) {
      // PocketBase throws ClientResponseError for HTTP errors, which contain a `.data` payload.
      console.error("Login failed", err);
      // Provide a clearer message for common failure scenarios.
      let message = "Unable to sign in";

      try {
        // Network error (fetch failed) may result in no .data and a message like 'Failed to fetch'
        if (
          err?.name === "TypeError" &&
          /fetch|network/i.test(err?.message || "")
        ) {
          message =
            "Network error: unable to reach authentication server. Check your PocketBase URL and network.";
        } else if (err?.data) {
          // err.data often contains { code, message, data }
          // Prefer a human-friendly message when available.
          if (typeof err.data === "string") {
            message = err.data;
          } else if (err.data.message) {
            message = err.data.message;
          } else if (err.message) {
            message = err.message;
          } else {
            message = JSON.stringify(err.data);
          }
        } else if (err?.message) {
          message = err.message;
        }
      } catch (parseErr) {
        console.error("Error parsing auth error", parseErr);
      }

      // Show the user a readable message and print the raw error for debugging.
      Alert.alert("Sign in failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Sign in to your app
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="johndow@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onSubmitEditing={onEmailSubmitEditing}
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                submitBehavior="submit"
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                  onPress={() => {
                    router.push("/(auth)/forget-password");
                  }}
                >
                  <Text className="font-normal leading-4">
                    Forgot your password?
                  </Text>
                </Button>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Login</Text>
              )}
            </Button>
          </View>
          <Text className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Pressable
              onPress={() => {
                router.push("/(auth)/signup");
              }}
            >
              <Text className="text-sm underline underline-offset-4">
                Sign up
              </Text>
            </Pressable>
          </Text>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">or</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
