import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import { X } from "lucide-react";
import { Home } from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  // 🔥 viewer
  const [showViewer, setShowViewer] = useState(false);

  const navigate = useNavigate();

  /* 🔐 USER */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else navigate("/");
    });
    return () => unsubscribe();
  }, []);

  /* 🔥 LOAD IMAGE */
  useEffect(() => {
    if (!user) return;

    const saved = localStorage.getItem(`profile_${user.uid}`);
    if (saved) setImageUrl(saved);
  }, [user]);

  /* 🔥 SELECT IMAGE */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setShowCrop(true);
  };

  /* 🔥 CROP COMPLETE */
  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  /* 🔥 CROP IMAGE */
  const getCroppedImg = async (imageSrc, crop) => {
    const image = new Image();
    image.src = imageSrc;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    return new Promise((resolve) => {
      image.onload = () => {
        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      };
    });
  };

  /* 🔥 UPLOAD */
  const uploadCroppedImage = async () => {
    setLoading(true);

    try {
      const blob = await getCroppedImg(preview, croppedAreaPixels);

      const data = new FormData();
      data.append("file", blob);
      data.append("upload_preset", "gamemind_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dx6mn1qb1/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      const url = result.secure_url;

      setImageUrl(url);
      localStorage.setItem(`profile_${user.uid}`, url);

      setShowCrop(false);
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* 🔓 LOGOUT */
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!user) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-page">

      {/* 🔙 BACK */}
     {/* 🔙 BACK */}
<div className="profile-home-btn" onClick={() => navigate("/home")}>
  <Home size={16} />
  Home
</div>
      {/* 🔥 IMAGE VIEWER */}
      {showViewer && (
        <div className="image-viewer" onClick={() => setShowViewer(false)}>

          {/* ❌ CLOSE BUTTON */}
          <div
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowViewer(false);
            }}
          >
            <X size={22} />
          </div>

          <img
            onClick={(e) => e.stopPropagation()}
            src={
              imageUrl ||
              `https://ui-avatars.com/api/?name=${user.email}`
            }
            alt="full"
          />
        </div>
      )}

      {/* 🔥 CROP MODAL */}
      {showCrop && (
        <div className="crop-modal">
          <div className="crop-container">
            <Cropper
              image={preview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <button className="save-btn" onClick={uploadCroppedImage}>
            {loading ? "Saving..." : "Save Image"}
          </button>
        </div>
      )}

      <div className="profile-card">

        {/* 🖼 IMAGE */}
        <div
          className="profile-img"
          onClick={() => setShowViewer(true)}
        >
          <img
            src={
              imageUrl ||
              `https://ui-avatars.com/api/?name=${user.email}`
            }
            alt="profile"
          />
        </div>

        {/* 📤 UPLOAD */}
        <input
          type="file"
          id="fileInput"
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />

        <button
          className="upload-btn"
          onClick={() => document.getElementById("fileInput").click()}
        >
          Change Profile Photo
        </button>

        {/* 👤 INFO */}
        <h2>{user.email.split("@")[0]}</h2>
        <p>{user.email}</p>

        {/* 📊 STATS */}
      

        {/* 🚪 LOGOUT */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}