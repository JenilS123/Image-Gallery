import React, { useState } from "react";
import axios from "axios";
import { useToast } from "./Toast";

const PhotoUploader = ({ addedPhotos, setAddedPhotos }) => {
  const [photoLink, setPhotoLink] = useState("");
  const [photoLinkError, setPhotoLinkError] = useState("");
  const [touchedLink, setTouchedLink] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  const validateUrl = (url) => {
    if (!url || !url.trim()) return "Image URL is required";
    try {
      const parsed = new URL(url.trim());
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return "URL must start with http:// or https://";
      }
    } catch {
      return "Please enter a valid image URL (e.g. https://example.com/image.jpg)";
    }
    return "";
  };

  const handleLinkChange = (e) => {
    const val = e.target.value;
    setPhotoLink(val);
    if (touchedLink) {
      setPhotoLinkError(validateUrl(val));
    }
  };

  const handleLinkBlur = () => {
    setTouchedLink(true);
    setPhotoLinkError(validateUrl(photoLink));
  };

  const addPhotoByLink = async (e) => {
    e.preventDefault();
    setTouchedLink(true);
    const err = validateUrl(photoLink);
    setPhotoLinkError(err);
    if (err) return;

    setIsAddingLink(true);
    try {
      const { data: filename } = await axios.post("/upload-by-link", {
        link: photoLink.trim(),
      });
      setAddedPhotos((prev) => [...prev, filename]);
      setPhotoLink("");
      setTouchedLink(false);
      setPhotoLinkError("");
      showToast("Photo added successfully.");
    } catch (error) {
      showToast("We could not add this photo. Check the link and try again.", "error");
    } finally {
      setIsAddingLink(false);
    }
  };

  const uploadPhoto = (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const invalidFile = [...files].find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      showToast("Only image files can be uploaded.", "error");
      e.target.value = "";
      return;
    }
    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    setIsUploading(true);
    axios
      .post("/upload", data)
      .then((res) => {
        const { data: filenames } = res;
        if (Array.isArray(filenames)) {
          setAddedPhotos((prev) => [...prev, ...filenames]);
          showToast("Photo upload completed.");
        } else {
          showToast("Photo upload failed. Invalid response.", "error");
        }
      })
      .catch((err) => {
        console.error("Upload error:", err);
        const errMsg = err.response?.data?.error || err.response?.data?.message || "Photo upload failed. Please try again.";
        showToast(errMsg, "error");
      })
      .finally(() => {
        setIsUploading(false);
        e.target.value = "";
      });
  };

  const removePhoto = async (fileNameId, e) => {
    e.preventDefault();
    try {
      await axios.post("/delete-photo", { filename: fileNameId });
    } catch (error) {
      console.error("Error deleting photo from server:", error);
    }
    setAddedPhotos([...addedPhotos.filter((photo) => photo !== fileNameId)]);
    showToast("Photo removed.");
  };

  const selectAsMainPhoto = (fileNameId, e) => {
    e.preventDefault();
    setAddedPhotos([
      fileNameId,
      ...addedPhotos.filter((photo) => photo !== fileNameId),
    ]);
    showToast("Main photo updated.");
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            value={photoLink}
            onChange={handleLinkChange}
            onBlur={handleLinkBlur}
            placeholder="https://example.com/image.jpg"
            aria-label="Image URL"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${
              touchedLink && photoLinkError
                ? "border-red-500 bg-red-50/30 text-slate-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-slate-300 bg-white text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10"
            }`}
          />
          <button
            type="button"
            disabled={isAddingLink}
            className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60 flex items-center justify-center gap-2"
            onClick={addPhotoByLink}
          >
            {isAddingLink ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Adding...</span>
              </>
            ) : (
              "Add Photo"
            )}
          </button>
        </div>
        {touchedLink && photoLinkError && (
          <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            <span>{photoLinkError}</span>
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 4k:grid-cols-8">
        {addedPhotos.map((link) => (
          <div className="group relative flex h-32 2xl:h-40 4k:h-52 overflow-hidden rounded-2xl bg-slate-100" key={link}>
            <img
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              src={"http://localhost:8000/uploads/" + link}
              alt=""
            />
            <button
              onClick={(e) => removePhoto(link,e)}
              className="absolute bottom-2 right-2 cursor-pointer rounded-lg bg-slate-950/70 p-2 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
            <button
              onClick={(e) => selectAsMainPhoto(link,e)}
              className="absolute bottom-2 left-2 cursor-pointer rounded-lg bg-slate-950/70 p-2 text-white opacity-0 transition hover:bg-primary group-hover:opacity-100"
            >
              {link === addedPhotos[0] && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {link !== addedPhotos[0] && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
              )}
            </button>
          </div>
        ))}

        <label className={`flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-2 text-sm font-medium text-slate-500 transition hover:border-primary hover:bg-primary/5 hover:text-primary ${isUploading ? "opacity-60 pointer-events-none" : ""}`}>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={uploadPhoto}
          />
          {isUploading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Upload photo</span>
            </>
          )}
        </label>
      </div>
    </>
  );
};

export default PhotoUploader;
