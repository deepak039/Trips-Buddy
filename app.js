const express = require("express");
const axios = require("axios");
const cors = require('cors')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors({
    origin: '*'
  }));

// dotenv.config({ path: "./config.env" });
const key ="AIzaSyABM1OPhQMBnH4YzaAmCDvW7J5Xig8X6G4"
const genAI = new GoogleGenerativeAI(key);


const getWheather = async (city) => {
  const link = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4c0a11974562c7395505955f23a93fcb`;
  const response = await axios.get(link);
  // console.log(response.data);
  return response.data;
};

const getPoi = async (source, destination) => {
  try {
    const prompt = `act as travel advisior tell us that is there time difference zone between ${source} and ${destination} and also tell us intresting point of intrest in ${destination}`;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text();
    // console.log(text);
    return text;
  } catch (error) {
    // console.log(error);
  }
};
app.get("/", async (req, res) => {
  try {


    res.status(200).json({
      status: 'sucess',
      data: {
        data:"sucess running"
      },
    });
  } catch (error) {
    res.status(404).json({
        status:'fail',
        message:error
    })
  }
});

app.get("/trip-info", async (req, res) => {
  try {
    const { source, destination } = req.query;
    const sourceData = await getWheather(source);
    const desitationData = await getWheather(destination);
    const pointOfIntrest = await getPoi(source, destination);

    res.status(200).json({
      status: 'sucess',
      data: {
        source: sourceData,
        destination: desitationData,
        poi: pointOfIntrest,
      },
    });
  } catch (error) {
    res.status(404).json({
        status:'fail',
        message:error
    })
  }
});

app.listen(3011, () => {
  console.log(`Server is running on port 3011`);
});
