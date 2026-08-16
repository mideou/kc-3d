import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { BinData } from '../data/data';

type BinInfoPanelProps = {
  bin: BinData | null;
  onClose: () => void;
};

export function BinInfoPanel({
  bin,
  onClose
}: BinInfoPanelProps) {
  if (!bin) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
  style={styles.closeButton}
  onPress={onClose}
>
  <Text style={styles.closeText}>
    ×
  </Text>
</TouchableOpacity>
      <Text style={styles.title}>
        Bin
      </Text>

      <Text style={styles.id}>
        {bin.id}
      </Text>

      <View style={styles.separator} />

      <Text style={styles.label}>
        Product
      </Text>

      <Text style={styles.value}>
        {bin.product}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    right: 16,
    top: 16,

    width: 180,

    padding: 16,

    backgroundColor: "white",

    borderRadius: 12,

    elevation: 5,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  id: {
    marginTop: 4,

    fontSize: 14,

    color: "#555",
  },

  separator: {
    height: 1,

    backgroundColor: "#ddd",

    marginVertical: 12,
  },

  label: {
    marginTop: 8,

    fontSize: 12,

    color: "#777",
  },

  value: {
    marginTop: 2,

    fontSize: 15,

    fontWeight: "600",
  },
  closeButton: {
  position: "absolute",
   right: 6,
  top: 6,

  width: 36,
  height: 36,

  alignItems: "center",
  justifyContent: "center",
},

closeText: {
  fontSize: 24,
  color: "#666",
  lineHeight: 28,
},
});