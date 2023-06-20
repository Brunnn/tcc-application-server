import { connect, MqttClient } from "mqtt";
export function initializeMQTT() {
  const client = connect("mqtt://localhost:1883", {
    clientId: process.env.SERVER_USERNAME,
    clean: false,
    reconnectPeriod: 5000,
    username: process.env.SERVER_USERNAME,
    password: process.env.SERVER_PASSWORD
  });

  client.on("connect", function () {
    console.log("Successfully connected to MQTT broker.");
  });

  //Error
  client.on("error", function (error) {
    console.log("Error: ", error);
  });

  client.on("message", function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    client.end();
  });

  return client;
}
