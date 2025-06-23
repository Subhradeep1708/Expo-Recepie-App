import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/colors'

const LoadingSpinner = ({ message = "Loading...", size = "large" }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ActivityIndicator size={size} color={COLORS.primary} />
                <Text style={styles.message}>{message}</Text>
            </View>
        </View>
    )
}

export default LoadingSpinner

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
        backgroundColor: COLORS.background
    },
    content: {
        alignItems: "center",
        gap: 16
    },
    message: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: "center"
    }
})