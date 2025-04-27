import { sequelize } from "./sequelize.js";
import { saveBulkLookUpData } from "../model/lookUpDataModel.js";
import { bulkInsert } from "../model/lookUpValueModel.js";
import LookUpValue from "../model/lookUpValueModel.js";
import OtpLog from "../model/otpLogModel.js";
import User from "../model/userModel.js";
import LookUpData from "../model/lookUpDataModel.js";
import UserInterest from "../model/userInterestModel.js";
import UserImage from "../model/userImagesModel.js";
import Event from "../model/eventModel.js";
import UserLocation from "../model/userLocationModel.js";
import EventDate from "../model/eventDateModel.js";

const connectDb = async () => {
  await sequelize
    .authenticate()
    .then(() => console.log("Connection has been established successfully."))
    .catch((error) =>
      console.error("Unable to connect to the database:", error)
    );

  await sequelize
    .sync()
    .then(() => console.log("Database & tables created!"))
    .catch((error) => console.error("Error syncing database:", error));
};

const seed = async () => {
  const lookUpData = [
    {
      id: 1,
      name: "gender",
      active: 1,
    },
    {
      id: 2,
      name: 'interest',
      active: 1,
    },
    {
      id: 3,
      name: 'event',
      active: 1
    }
  ];

  const lookUpValue = [
    {
      id: 1,
      parent: 1,
      name: "Male",
      icon: "male",
      priority: 1,
      active: 1,
      color: '#FFFFFF'
    },
    {
      id: 2,
      parent: 1,
      name: "Female",
      icon: "female",
      priority: 2,
      active: 1,
      color: '#FFFFFF'
    },
    {
      id: 3,
      parent: 1,
      name: "Other",
      priority: 3,
      icon: "transgender-outline",
      active: 1,
      color: '#FFFFFF'
    },
    // SPORTS
    {
      id: 4,
      parent: 2,
      name: "Football",
      icon: "soccer", // FontAwesome
      category: "Sports",
      active: 1,
    },
    {
      id: 5,
      parent: 2,
      name: "Basketball",
      icon: "basketball", // MaterialCommunityIcons
      category: "Sports",
      active: 1,
    },
    {
      id: 6,
      parent: 2,
      name: "Volleyball",
      icon: "volleyball", // MaterialCommunityIcons
      category: "Sports",
      active: 1,
    },
    {
      id: 7,
      parent: 2,
      name: "Tennis",
      icon: "tennis", // MaterialCommunityIcons
      category: "Sports",
      active: 1,
    },
    {
      id: 8,
      parent: 2,
      name: "Swimming",
      icon: "swim", // MaterialCommunityIcons
      category: "Sports",
      active: 1,
    },

    // ARTS & CULTURE
    {
      id: 9,
      parent: 2,
      name: "Painting",
      icon: "palette", // MaterialCommunityIcons
      category: "Arts & Culture",
      active: 1,
    },
    {
      id: 10,
      parent: 2,
      name: "Photography",
      icon: "camera", // Feather or FontAwesome
      category: "Arts & Culture",
      active: 1,
    },
    {
      id: 11,
      parent: 2,
      name: "Theatre",
      icon: "drama-masks", // MaterialCommunityIcons
      category: "Arts & Culture",
      active: 1,
    },
    {
      id: 12,
      parent: 2,
      name: "Dancing",
      icon: "dance-ballroom", // MaterialCommunityIcons
      category: "Arts & Culture",
      active: 1,
    },
    {
      id: 13,
      parent: 2,
      name: "Singing",
      icon: "microphone", // Feather or FontAwesome
      category: "Arts & Culture",
      active: 1,
    },

    // ENTERTAINMENT
    {
      id: 14,
      parent: 2,
      name: "Movies",
      icon: "movie", // MaterialCommunityIcons
      category: "Entertainment",
      active: 1,
    },
    {
      id: 15,
      parent: 2,
      name: "TV Shows",
      icon: "television-play", // MaterialCommunityIcons
      category: "Entertainment",
      active: 1,
    },
    {
      id: 16,
      parent: 2,
      name: "Anime",
      icon: "emoticon", // MaterialCommunityIcons
      category: "Entertainment",
      active: 1,
    },
    {
      id: 17,
      parent: 2,
      name: "Comics",
      icon: "book-open-variant", // MaterialCommunityIcons
      category: "Entertainment",
      active: 1,
    },
    {
      id: 18,
      parent: 2,
      name: "Karaoke",
      icon: "music", // Feather or MaterialCommunityIcons
      category: "Entertainment",
      active: 1,
    },

    // LIFESTYLE
    {
      id: 19,
      parent: 2,
      name: "Cooking",
      icon: "chef-hat", // MaterialCommunityIcons
      category: "Lifestyle",
      active: 1,
    },
    {
      id: 20,
      parent: 2,
      name: "Baking",
      icon: "bread-slice", // MaterialCommunityIcons
      category: "Lifestyle",
      active: 1,
    },
    {
      id: 21,
      parent: 2,
      name: "Food Tasting",
      icon: "food", // MaterialCommunityIcons
      category: "Lifestyle",
      active: 1,
    },
    {
      id: 22,
      parent: 2,
      name: "Coffee Lover",
      icon: "coffee", // Feather or MaterialCommunityIcons
      category: "Lifestyle",
      active: 1,
    },
    {
      id: 23,
      parent: 2,
      name: "Travel",
      icon: "airplane", // MaterialCommunityIcons
      category: "Lifestyle",
      active: 1,
    },

    // ANIMALS & NATURE
    {
      id: 24,
      parent: 2,
      name: "Animal Lover",
      icon: "paw", // Feather or FontAwesome
      category: "Animals & Nature",
      active: 1,
    },
    {
      id: 25,
      parent: 2,
      name: "Pet Lover",
      icon: "dog", // MaterialCommunityIcons
      category: "Animals & Nature",
      active: 1,
    },
    {
      id: 26,
      parent: 2,
      name: "Gardening",
      icon: "flower", // MaterialCommunityIcons
      category: "Animals & Nature",
      active: 1,
    },
    {
      id: 27,
      parent: 2,
      name: "Nature Walks",
      icon: "tree", // MaterialCommunityIcons
      category: "Animals & Nature",
      active: 1,
    },

    // TECH & GAMING
    {
      id: 28,
      parent: 2,
      name: "Gaming",
      icon: "gamepad-variant", // MaterialCommunityIcons
      category: "Tech & Gaming",
      active: 1,
    },
    {
      id: 29,
      parent: 2,
      name: "Esports",
      icon: "trophy", // MaterialCommunityIcons
      category: "Tech & Gaming",
      active: 1,
    },
    {
      id: 30,
      parent: 2,
      name: "Mobile Games",
      icon: "cellphone-play", // MaterialCommunityIcons
      category: "Tech & Gaming",
      active: 1,
    },
    {
      id: 31,
      parent: 2,
      name: "Coding",
      icon: "laptop", // FontAwesome5
      category: "Tech & Gaming",
      active: 1,
    },

    // MIND & WELLNESS
    {
      id: 32,
      parent: 2,
      name: "Meditation",
      icon: "meditation", // MaterialCommunityIcons
      category: "Mind & Wellness",
      active: 1,
    },
    {
      id: 33,
      parent: 2,
      name: "Yoga",
      icon: "yoga", // MaterialCommunityIcons
      category: "Mind & Wellness",
      active: 1,
    },
    {
      id: 34,
      parent: 2,
      name: "Spirituality",
      icon: "yin-yang", // MaterialCommunityIcons
      category: "Mind & Wellness",
      active: 1,
    },

    // DIY & CRAFTS
    {
      id: 35,
      parent: 2,
      name: "DIY Projects",
      icon: "hammer-wrench", // MaterialCommunityIcons
      category: "DIY & Crafts",
      active: 1,
    },
    {
      id: 36,
      parent: 2,
      name: "Knitting",
      icon: "needle", // MaterialCommunityIcons
      category: "DIY & Crafts",
      active: 1,
    },

    // VEHICLES & RACING
    {
      id: 37,
      parent: 2,
      name: "Car Enthusiast",
      icon: "car", // MaterialCommunityIcons
      category: "Vehicles & Racing",
      active: 1,
    },
    {
      id: 38,
      parent: 2,
      name: "Motorbikes",
      icon: "motorbike", // MaterialCommunityIcons
      category: "Vehicles & Racing",
      active: 1,
    },
    {
      id: 39,
      parent: 2,
      name: "Racing",
      icon: "flag-checkered", // FontAwesome
      category: "Vehicles & Racing",
      active: 1,
    },
    {
      id: 40,
      parent: 3,
      name: 'Travel',
      active: 1
    },
    {
      id: 41,
      parent: 3,
      name: 'Movies',
      active: 1
    },
    {
      id: 42,
      parent: 3,
      name: 'Fantacy',
      active: 1
    },
    {
      id: 43,
      parent: 3,
      name: 'Art',
      active: 1
    }
  ];
  await saveBulkLookUpData(lookUpData);
  await bulkInsert(lookUpValue);
};

export { connectDb, seed };
