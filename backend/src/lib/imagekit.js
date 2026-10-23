import ImageKit, { toFile } from "@imagekit/nodejs";

function getImageKitPrivateKey() {
  return process.env.IMAGEKIT_PRIVATE_KEY || process.env.IMAGEKIT_API_KEY;
}

function hasImageKitConfig() {
  return Boolean(getImageKitPrivateKey());
}

//thi helper make a safe,unique filename for uploaded files
function createFileName(originalName = "upload") {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `chat-${Date.now()}-${safeName}`;
}

async function uploadChatMedia(file) {
  const imagekit = new ImageKit({
    privateKey: getImageKitPrivateKey(),
  });
  const fileName = createFileName(file.originalname);
  const result = await imagekit.files.upload({
    file: await toFile(file.buffer, fileName, { type: file.mimetype }),
    fileName,
    folder: "/chat",
  });
  return result.url;
}

export { hasImageKitConfig, uploadChatMedia };
