import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { Cloudinary } from "@cloudinary/url-gen";
import { config } from "./config";

const cld = new Cloudinary({
  cloud: { cloudName: config.cloudinaryCloudName },
});

export async function firebaseUpload(file: File) {
  const date = new Date();
  const storageRef = ref(storage, `images/${date + file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes / 100;
        return progress;

        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("upload paused");
        //     break;
        //   case "running":
        //     console.log("upload is running");
        //     break;
        // }
      },

      (error) => reject("something went wrong" + error),
      () =>
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          resolve(downloadURL)
        )
    );
  });
}

export async function cloudinaryImageUpload(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", config.cloudinaryUploadPreset);

  try {
    const response = await fetch(
      `${config.cloudinaryUploadBaseUrl}/${config.cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Cloudinary Upload Failed: ${
          error?.error?.message || response.statusText
        }`
      );
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(`File upload failed: ${error.message || "Unknown error"}`);
  }
}
