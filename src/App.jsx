import { useState } from "react";
import axios from "axios";
import { FaPhotoFilm } from "react-icons/fa6"
import { useEffect } from "react";
import Loading from "./components/Loading";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const App = () => {
  const [imageArray, setImageArray] = useState([]);
  const [loading, setLoading] = useState(false)

  const handleUpload = async (newImage) => {
    setLoading(true)
    const formData = new FormData();
    formData.append("image", newImage);
    try {
      setLoading(true);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Hosting_API_KEY}`,
        formData
      );
      const newImageURL = await response.data.data.url;
      await axios.post("http://localhost:3000/newLink", { url: newImageURL, isFeatured: false })
      setImageArray([
        ...imageArray,
        { url: newImageURL, isFeatured: false },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const sourceIndex = e.dataTransfer.getData("index");
    const updatedImageArray = [...imageArray];
    const [draggedImage] = updatedImageArray.splice(sourceIndex, 1);
    updatedImageArray.splice(dropIndex, 0, draggedImage);
    updatedImageArray.forEach((image, i) => {
      image.isFeatured = i === 0;
    });
    setImageArray(updatedImageArray);
  };

  // for mobile touch events

  useEffect(() => {
    const getAllLink = async () => {
      setLoading(true);
      setImageArray((await axios.get("http://localhost:3000/allLink")).data)
      setLoading(false);
    }
    getAllLink();
  }, [])

  if (loading) { return <Loading /> }

  return (
    <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-3 grid-flow-row-dense gap-4 px-2 py-2">
      {imageArray.map(({ url, isFeatured }, index) => (
        <div
          key={index}
          className={`${isFeatured ? "col-span-2 row-span-2 md:max-h-[416px] md:min-h-[416px]" : "md:max-w-[300px] md:min-w-[150px] md:max-h-[200px] md:min-h-[200px]"} `}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
        >
          <img
            src={url}
            alt="phone"
            className="w-full h-full border-gray-500 border-2 rounded-xl"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
          
          />
        </div>)
      )}

      <div className="bg-gray-200 border-gray-500 border-[1px] border-dashed rounded-xl flex items-center justify-center flex-col md:max-w-[300px] md:min-w-[150px] md:max-h-[200px] md:min-h-[200px]">
        <FaPhotoFilm className="w-16 h-8" />
        <label
          htmlFor="imageUpload"
          className="text-center cursor-pointer"
        >
          Add Images
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files[0])}
          className="hidden"
          id="imageUpload"
        />
      </div>
    </div>
  )
}

export default App;