require("dotenv").config();

const Typesense = require("typesense");

module.exports = (async () => {
  const TYPESENSE_CONFIG = {
    nodes: [
      {
        host: process.env.TYPESENSE_HOST,
        port: process.env.TYPESENSE_PORT,
        protocol: process.env.TYPESENSE_PROTOCOL,
      },
    ],
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY,
    connectionTimeoutSeconds: 100,
  };

  console.log("Config: ", TYPESENSE_CONFIG);

  const typesense = new Typesense.Client(TYPESENSE_CONFIG);

  const schema = {
    name: "images",
    num_documents: 0,
    fields: [
      {
        name: "image",
        type: "string",
        facet: false,
      },
      {
        name: "embedding",
        type: "float[]",
        embed: {
          from: ["image"],
          model_config: {
            model_name: "ts/clip-vit-b-p32"
          }
        }
      }
    ],
  };

  const images = require("./data/images.json")
  await typesense.collections().create(schema);

  await typesense.collections('images').documents().import(images)
})();
