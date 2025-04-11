import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface Challenge {
  id: string;
  title: string;
  image: string;
  rating: number;
}

const challenges: Challenge[] = [
  { id: "1", title: "Drink 2 liters of water today 💧", image: "https://img.icons8.com/ios-filled/100/000000/water.png", rating: 0 },
  { id: "2", title: "Walk 10,000 steps 🚶‍♂", image: "https://img.icons8.com/ios-filled/100/000000/walking.png", rating: 0 },
  { id: "3", title: "Eat 5 servings of fruits or vegetables 🍎🥦", image: "https://img.icons8.com/ios-filled/100/000000/vegetarian-food.png", rating: 0 },
  { id: "4", title: "Sleep for 7 hours straight 😴", image: "https://img.icons8.com/ios-filled/100/000000/sleeping.png", rating: 0 },
  { id: "5", title: "Avoid processed sugar today 🚫🍭", image: "https://img.icons8.com/ios-filled/100/000000/no-sugar.png", rating: 0 },
  { id: "6", title: "Meditate for 10 minutes 🧘‍♀", image: "https://www.pngmart.com/files/5/Meditating-PNG-Pic.png", rating: 0  },
  { id: "7", title: "No phone use 1 hour before bed 📵", image: "https://cdn-icons-png.flaticon.com/512/223/223358.png", rating: 0  },
  { id: "8", title: "Read for 30 minutes 📖", image: "https://img.icons8.com/ios-filled/100/000000/book.png", rating: 0 },
  { id: "9", title: "Do 15 minutes of stretching 🏋‍♀", image: "https://www.pngmart.com/files/15/Vector-Exercise-Stretching-PNG-Clipart.png", rating: 0 },
  { id: "10", title: "Write down three things you're grateful for ✍", image: "https://img.icons8.com/ios-filled/100/000000/journal.png", rating: 0 },
  { id: "11", title: "Drink a healthy smoothie 🥤", image: "https://cdn1.iconfinder.com/data/icons/diet-and-nutrition-10/64/drink-juice-smoothie-beverage-healthy-512.png", rating: 0 },
  { id: "12", title: "Spend 30 minutes outdoors 🌳", image: "https://img.icons8.com/ios-filled/100/000000/park-bench.png", rating: 0 },
  { id: "13", title: "Practice deep breathing for 5 minutes 🌬", image: "https://cdn2.iconfinder.com/data/icons/self-care-solid/64/breath-deep-breathing-woman-meditation-self_care-self_love-512.png", rating: 0 },
  { id: "14", title: "Limit caffeine intake ☕", image: "https://cdn3.iconfinder.com/data/icons/eco-food-and-cosmetic-labels-4/128/caffeine_free_1-1024.png", rating: 0 },
  ];


interface CustomRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
}

const CustomRating: React.FC<CustomRatingProps> = ({ rating, onRatingChange, size = 20 }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1;
        return (
          <TouchableOpacity key={starNumber} onPress={() => onRatingChange(starNumber)}>
            <FontAwesome
              name={starNumber <= rating ? 'star' : 'star-o'}
              size={size}
              color={starNumber <= rating ? '#FFD700' : '#ccc'}
              style={{ marginHorizontal: 2 }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const ChallengeScreen: React.FC = () => {
  const [challengeList, setChallengeList] = useState<Challenge[]>(challenges);

  const handleChallengePress = (id: string) => {
    alert('Success!✅');
  };

  const handleRatingChange = (id: string, rating: number) => {
    setChallengeList((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === id ? { ...challenge, rating } : challenge
      )
    );
  };

  return (
    <View style={styles.container} pointerEvents="auto">
      <FlatList
        data={challengeList}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 5 }}
        ListHeaderComponent={<Text style={styles.header}>My Challenge</Text>}
        renderItem={({ item }) => (
          <View style={styles.challengeItem}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.challengeImage} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.challengeText}>{item.title}</Text>
              <CustomRating
                rating={item.rating}
                onRatingChange={(newRating) => handleRatingChange(item.id, newRating)}
                size={16}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleChallengePress(item.id)}>
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  header: {
    fontSize: 20,
    paddingTop: 20,
    fontWeight: '900',
    textAlign: "center",
    marginTop: 15,
    marginBottom: 5,
    color: "#062654",
  },
  challengeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF0F7",
    padding: 10,
    margin: 5,
    marginVertical: 8,
    borderRadius: 25,
    elevation: 3,
  },
  imageContainer: {
    backgroundColor: "#7FADE0",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  challengeImage: {
    width: 50,
    height: 50,
    resizeMode: "contain"
  },
  textContainer: {
    flex: 3,
  },
  challengeText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 5,
    fontWeight: '500',
  },
  button: {
    backgroundColor: "#2265A2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ChallengeScreen;