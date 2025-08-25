// App.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState(null);

  const API_KEY = "YOUR_API_KEY"; // 🔑 Replace with your NewsAPI key
  const API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      setArticles(json.articles || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedUrl(item.url)}
    >
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  // If an article is selected, show WebView
  if (selectedUrl) {
    return (
      <WebView
        source={{ uri: selectedUrl }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="blue" />}
        onNavigationStateChange={(navState) => {
          if (!navState.url) setSelectedUrl(null);
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📰 Latest Headlines</Text>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    height: 200,
    width: "100%",
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});
