import { SocialConnections } from "@/components/social-connections";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useRouter } from "expo-router"; // Import useRouter
import { Ban } from "lucide-react-native";
import * as React from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";

export const SignUpForm = () => {
  // Add refs for better focus management
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);
  const nameInputRef = React.useRef<TextInput>(null);

  const router = useRouter(); // Initialize router
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSignUp() {
    setError(null); // Clear previous errors

    if (!email.trim() || !password || !confirmPassword || !name.trim()) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const data = {
      email,
      password,
      passwordConfirm: confirmPassword,
      name,
      emailVisibility: true,
    };

    setLoading(true);
    try {
      // 1. Create a new user in PocketBase
      await pb.collection("users").create(data);
      console.log("✅ Sign up successful");

      // 2. Auto sign-in the user after sign up
      await pb.collection("users").authWithPassword(email, password);
      console.log("✅ Auto sign-in successful");

      // 3. Navigate to the main app screen
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("❌ Sign up failed", err);
      // More detailed error parsing
      let message = "Unable to create your account. Please try again.";
      if (err?.data?.data?.email?.message) {
        // Specifically for "Email already exists" errors from PocketBase
        message = err.data.data.email.message;
      } else if (err?.data?.message) {
        message = err.data.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Create your account
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          {/* Conditionally rendered Alert component */}
          {error && (
            <Alert variant="destructive" icon={Ban}>
              <AlertTitle>Sign up failed!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailInputRef}
                id="email"
                placeholder="johndoe@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View className="gap-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                ref={confirmPasswordInputRef}
                id="confirmPassword"
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => nameInputRef.current?.focus()}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <View className="gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                ref={nameInputRef}
                id="name"
                placeholder="John Doe"
                autoComplete="name"
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Button
              className="w-full"
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Continue</Text>
              )}
            </Button>
          </View>

          <Text className="text-center text-sm">
            Already have an account?{" "}
            <Pressable
              onPress={() => {
                router.push("/(auth)/login");
              }}
            >
              <Text className="text-sm underline underline-offset-4">
                Sign in
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
};
