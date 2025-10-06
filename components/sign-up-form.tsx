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
import { router } from "expo-router";
import * as React from "react";
import { Pressable, TextInput, View } from "react-native";

export const SignUpForm = () => {
  const passwordInputRef = React.useRef<TextInput>(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function handleSignUp() {
    if (!email.trim() || !password || !confirmPassword || !name) {
      alert("Email, Password, Confirm Password and Name are required");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
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
      // Create a new user in PB
      await pb.collection("users").create(data);
      console.log("✅ Sign up successful");

      // Auto sign-in the user after sign up
      await pb.collection("users").authWithPassword(email, password);
    } catch (err) {
      console.error("❌ Sign up failed", err);
      alert("Unable to sign up");
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
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="johndoe@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={handleSignUp}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
              </View>
              <Input
                id="confirmPassword"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={handleSignUp}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <View className="gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
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
              <Text>{loading ? "Creating..." : "Continue"}</Text>
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
