import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

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
