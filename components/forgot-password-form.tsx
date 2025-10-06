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
import { Text } from "@/components/ui/text";
import pb from "@/service/pocketbase";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [manualToken, setManualToken] = useState("");

  async function handleForgotPassword() {
    if (!email.trim()) {
      Alert.alert("Error", "Email is required");
      return;
    }

    try {
      const resp = await pb.collection("users").requestPasswordReset(email);
      console.log("✅ Password reset request successful:", resp);

      // Normally, PocketBase does not return a token (it emails it)
      // If you mock a token in dev, you can capture and return it
      return (resp && (resp as any).token) as string | undefined;
    } catch (err) {
      console.error("❌ Forgot password failed:", err);
      Alert.alert("Error", "Unable to request password reset");
    }
  }

  async function onSubmit() {
    const tokenFromResponse = await handleForgotPassword();
    const tokenToPass = manualToken.trim() || tokenFromResponse;

    if (tokenToPass) {
      console.log("➡️ Navigating to reset-password with token:", tokenToPass);
      router.push(
        `/(auth)/reset-password?token=${encodeURIComponent(tokenToPass)}`
      );
    } else {
      console.log("⚠️ No token found — navigating without token");
      router.push("/(auth)/reset-password");
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Forgot password?
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            {/* Email input */}
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="johndoe@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Optional token input for testing */}
            <View className="gap-1.5">
              <Label htmlFor="token">Optional token (for testing)</Label>
              <Input
                id="token"
                placeholder="Paste reset token manually"
                autoCapitalize="none"
                value={manualToken}
                onChangeText={setManualToken}
              />
            </View>

            <Button className="w-full" onPress={onSubmit}>
              <Text>Send Reset Email</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
