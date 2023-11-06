import { useState } from "react";
import imageLinks from "../imageLinks.json";
import axios from "axios";

const App = () => {
  const [newImage, setNewImage] = useState(null);
  const [imageArray, setImageArray] = useState(imageLinks.images);
  const [loading, setLoading] = useState(false)
  const handleUpload = async () => {
    setLoading(true)
    const formData = new FormData();
    formData.append("image", newImage);
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Hosting_API_KEY}`,
        formData
      );
      const newImageURL = await response.data.data.url;
      setLoading(false)
      setImageArray([
        ...imageArray,
        { url: newImageURL, isFeatured: false },
      ]);

    } catch (error) {
      console.error("Image upload error:", error);
    }
  };
  console.log(imageArray);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const sourceIndex = e.dataTransfer.getData("index");

    // Create a copy of the imageArray to avoid directly modifying the state
    const updatedImageArray = [...imageArray];

    // Move the dragged image to the dropIndex
    const [draggedImage] = updatedImageArray.splice(sourceIndex, 1);
    updatedImageArray.splice(dropIndex, 0, draggedImage);

    // Update the isFeatured property
    updatedImageArray.forEach((image, i) => {
      image.isFeatured = i === 0;
    });

    // Update the state with the new image order and isFeatured property
    setImageArray(updatedImageArray);
  };




  return (
    <div className="grid grid-cols-6 grid-flow-row-dense gap-4">
      {imageArray.map(({ url, isFeatured }, index) => (
        <div
          key={index}
          className={`${isFeatured ? "col-span-2 row-span-2" : ""}`}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
        >
          <img
            src={url}
            alt="phone"
            className="w-full h-full border-gray-500 border-4 rounded-xl"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
          />
        </div>)
      )}
      <div className="bg-gray-400 border-gray-500 border-4 rounded-xl flex items-center justify-center cursor-pointer" onClick={() => document.getElementById("imageUpload").click()}>
        <label
          htmlFor="imageUpload"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-center text-xl"
        >
          Add New Image
        </label>
        <input
    type="file"
    accept="image/*"
    onChange={(e) => setNewImage(e.target.files[0])}
    className="hidden"
    id="imageUpload"
  />
      </div>
    </div>
  )
}

export default App;