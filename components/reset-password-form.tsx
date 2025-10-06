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
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, TextInput, View } from "react-native";

export function ResetPasswordForm() {
  const codeInputRef = useRef<TextInput>(null);
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const params = useLocalSearchParams();

  useEffect(() => {
    const tokenParam = (params as any)?.token;
    if (tokenParam && typeof tokenParam === "string") {
      console.log("🔑 Loaded reset token from URL:", tokenParam);
      setResetToken(tokenParam);
    }
  }, [params]);

  async function handleResetPassword() {
    if (!resetToken.trim()) {
      Alert.alert("Error", "Reset token is required");
      return false;
    }
    if (!password) {
      Alert.alert("Error", "Password is required");
      return false;
    }
    if (password !== passwordConfirm) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    const token = resetToken.trim();
    try {
      await pb
        .collection("users")
        .confirmPasswordReset(token, password, passwordConfirm);

      console.log("✅ Password reset successful");
      Alert.alert("Success", "Your password has been reset.");
      router.push("/(auth)/login");
      return true;
    } catch (error) {
      console.error("❌ Password reset failed:", error);
      Alert.alert("Error", "Failed to reset password. Try again.");
      return false;
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Reset your password
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the reset code and your new password
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            {/* Password input */}
            <View className="gap-1.5">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => codeInputRef.current?.focus()}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Confirm password */}
            <View className="gap-1.5">
              <Label htmlFor="passwordConfirm">Confirm Password</Label>
              <Input
                id="passwordConfirm"
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => codeInputRef.current?.focus()}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
              />
            </View>

            {/* Token input */}
            <View className="gap-1.5">
              <Label htmlFor="resetToken">Reset Token</Label>
              <Input
                id="resetToken"
                ref={codeInputRef}
                placeholder="Paste your reset token"
                autoCapitalize="none"
                value={resetToken}
                onChangeText={setResetToken}
              />
            </View>

            <Button className="w-full" onPress={handleResetPassword}>
              <Text>Confirm Reset</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
