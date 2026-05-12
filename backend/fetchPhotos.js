const axios = require("axios");

const cars = [
    "Toyota Fortuner", "Toyota Innova Crysta", "Toyota Land Cruiser", "Toyota Glanza", "Toyota Innova Hycross",
    "Maruti Swift", "Maruti Baleno", "Maruti Fronx", "Maruti Alto K10",
    "Tata Punch", "Tata Nexon", "Tata Harrier", "Tata Altroz", "Tata Sierra",
    "Hyundai Creta", "Hyundai Exter", "Hyundai Venue",
    "Mahindra Thar", "Mahindra Scorpio N", "Mahindra XUV700", "Mahindra XEV 9S",
    "Kia Sonet", "Kia Seltos",
    "Skoda Slavia", "Skoda Kushaq",
    "Volkswagen Virtus", "Volkswagen VW Taigun",
    "Renault Kwid",
    "MG Hector Plus",
    "Mini Cooper Convertible",
    "Honda City", "Honda Amaze",
    "Nissan Magnite",
    "Jeep Compass",
    "Ford EcoSport",
    "BMW X1", "BMW 3 Series",
    "Audi A4", "Audi Q3",
    "Mercedes-Benz C-Class",
    "Volvo XC40",
    "Toyota Camry",
    "MG ZS EV",
    "BYD Atto 3",
    "Skoda Octavia",
    "Volkswagen Polo",
    "Hyundai i20",
    "Tata Tiago EV",
    "Mahindra Bolero"
];
const sides = ["front", "rear", "left side", "right side"];

const API_KEY = "a571b8b2a21beab2111c2fe79a7c3755cf396037348f4658505a623655bbe428";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCarImages(car) {
  let result = {};

  for (let side of sides) {
    const query = `${car} ${side} view`;

    try {
      const res = await axios.get("https://serpapi.com/search.json", {
        params: {
          q: query,
          tbm: "isch",
          api_key: API_KEY,
        },
      });

      if (res.data.images_results?.length > 0) {
        result[side] = res.data.images_results[0].original;
      } else {
        result[side] = null;
      }

    } catch (err) {
      console.log(`Error for ${car} - ${side}:`, err.response?.data || err.message);
      result[side] = null;
    }

    await sleep(1000); // avoid rate limit
  }

  return result;
}

async function main() {
  let finalData = {};

  for (let car of cars) {
    console.log(`Fetching: ${car}`);
    finalData[car] = await getCarImages(car);
  }

  console.log(JSON.stringify(finalData, null, 2));
}

main();