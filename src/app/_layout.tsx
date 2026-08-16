import { BinRegistryProvider } from "@/context/bin-registry";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {

    return     <BinRegistryProvider>
    <Stack />
    </BinRegistryProvider>
}
