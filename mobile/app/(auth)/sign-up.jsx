import VerifyEmail from "./verify-email.jsx";
import { useSignUp } from '@clerk/clerk-expo'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import { authStyles } from '../../assets/styles/auth.styles'
import { COLORS } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'

const SignUpScreen = () => {
    const { isLoaded, signUp } = useSignUp()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showpassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pendingVerification, setPendingVerification] = useState(false)


    const handleSignUp = async () => {

        if (!email || !password) {
            Alert.alert("Error", "Please fill in all the fields")
            return;
        }
        if (password.length < 8) {
            Alert.alert("Error", "Password must be atleast 6 characters long")
            return;
        }

        if (!isLoaded) return;

        setLoading(true)

        try {
            // start of signUp process
            await signUp.create({
                emailAddress: email,
                password
            })

            //sending email verfication code 
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setPendingVerification(true);


        } catch (err) {
            Alert.alert("Error", err.errors?.[0].message || "Sign-in process failed ")
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setLoading(false)
        }
    }

    // Handling the verify code section here
    if (pendingVerification) return <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />


    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                style={authStyles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Image container */}
                    <View style={authStyles.imageContainer}>
                        <Image
                            source={require("../../assets/images/i2.png")}
                            style={authStyles.image}
                            contentFit="contain"
                        />
                    </View>
                    <Text style={authStyles.title}>Create Account</Text>

                    {/* FORM CONTAINER */}

                    <View style={authStyles.formContainer}>

                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder="Enter email"
                                placeholderTextColor={COLORS.textLight}
                                value={email}
                                onChangeText={setEmail}
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

                        {/* SignUP Button */}
                        <TouchableOpacity
                            style={[authStyles.authButton, !!loading && authStyles.buttonDisabled]}
                            onPress={handleSignUp}
                            disabled={!!loading}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={authStyles.buttonText}
                            >{loading ? "Creating Account..." : "Sign Up"}</Text>
                        </TouchableOpacity>


                        {/* SignIn page Link */}
                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={() => router.back()}
                        >
                            <Text
                                style={authStyles.linkText}
                            >
                                Already have an account? <Text style={authStyles.link}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default SignUpScreen;
