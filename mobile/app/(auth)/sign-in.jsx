import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { authStyles } from '../../assets/styles/auth.styles'
import { COLORS } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'
export default function Page() {
   const { signIn, setActive, isLoaded } = useSignIn()
   const router = useRouter()

   const [emailAddress, setEmailAddress] = React.useState('')
   const [password, setPassword] = React.useState('')
   const [showpassword, setShowPassword] = React.useState(false)
   const [loading, setLoading] = React.useState(false)

   // Handle the submission of the sign-in form
   const handleSignIn = async () => {

      if (!emailAddress || !password) {
         Alert.alert('Email and password are required')
         return
      }
      if (!isLoaded) return
      setLoading(true)
      // Start the sign-in process using the email and password provided
      try {
         const signInAttempt = await signIn.create({
            identifier: emailAddress,
            password,
         })


         if (signInAttempt.status === 'complete') {
            await setActive({ session: signInAttempt.createdSessionId })
         } else {
            Alert.alert("Sign-in incomplete", "Please complete the sign-in process. ")
            console.error(JSON.stringify(signInAttempt, null, 2))
         }
      } catch (err) {
         Alert.alert("Error", err.errors?.[0].message || "Sign-in process failed ")
         console.error(JSON.stringify(err, null, 2))
      } finally {
         setLoading(false)
      }
   }

   return (
      <View style={authStyles.container}>

         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={authStyles.keyboardView}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
         >
            <ScrollView
               contentContainerStyle={authStyles.scrollContent}
               showsVerticalScrollIndicator={false}
            >
               <View style={authStyles.imageContainer}>
                  <Image
                     source={require("../../assets/images/i1.png")}
                     style={authStyles.image}
                     contentFit="contain"
                  />
               </View>
               <Text style={authStyles.title}>Welcome Back</Text>

               {/* FORM CONTAINER */}

               <View style={authStyles.formContainer}>

                  <View style={authStyles.inputContainer}>
                     <TextInput
                        style={authStyles.textInput}
                        placeholder="Enter email"
                        placeholderTextColor={COLORS.textLight}
                        value={emailAddress}
                        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                        keyboardType='email-address'
                        autoCapitalize="none"
                     />
                  </View>
                  {/* PASSWORD INPUT */}
                  <View style={authStyles.inputContainer}>
                     <TextInput
                        style={authStyles.textInput}
                        placeholder="Enter password"
                        placeholderTextColor={COLORS.textLight}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showpassword}
                        autoCapitalize='none'
                     />

                     <TouchableOpacity
                        style={authStyles.eyeButton}
                        onPress={() => setShowPassword(!showpassword)}
                     >
                        <Ionicons
                           name={showpassword ? "eye-outline" : "eye-off-outline"}
                           size={20}
                           color={COLORS.textLight}
                        />
                     </TouchableOpacity>

                  </View>
                  

                  {/* SignIn Button */}
                  <TouchableOpacity
                     style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                     onPress={handleSignIn}
                     disabled={loading}
                     activeOpacity={0.8}
                  >
                     <Text
                        style={authStyles.buttonText}
                     >{loading ? "Signing In..." : "Sign In"}</Text>
                  </TouchableOpacity>
                  {/* SignUp page Link */}
                  <TouchableOpacity
                     style={authStyles.linkContainer}
                     onPress={() => router.push("/(auth)/sign-up")}
                  >
                     <Text
                        style={authStyles.linkText}
                     >
                        Don&apos;t have an account? <Text style={authStyles.link}>Sign up</Text>
                     </Text>
                  </TouchableOpacity>


               </View>
            </ScrollView>
         </KeyboardAvoidingView>
      </View>
   )
}

