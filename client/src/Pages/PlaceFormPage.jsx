import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import PhotoUploader from "../components/PhotoUploader";
import AccountNav from "../components/AccountNav";
import { Link, Navigate, useParams } from "react-router-dom";
import { useToast } from "../components/Toast";
import InputField from "../components/InputField";

const PlaceFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [maxImg, setMaxImg] = useState(1);
  const [price, setPrice] = useState(100);

  const [touched, setTouched] = useState({
    title: false,
    address: false,
    photos: false,
    description: false,
    maxImg: false,
    price: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const titleRef = useRef(null);
  const addressRef = useRef(null);
  const photosRef = useRef(null);
  const descriptionRef = useRef(null);
  const maxImgRef = useRef(null);
  const priceRef = useRef(null);

  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    axios.get("/places/" + id).then((res) => {
      const { data } = res;
      setTitle(data.title || "");
      setAddress(data.address || "");
      setAddedPhotos(data.photos || []);
      setDescription(data.description || "");
      setMaxImg(data.maxImg ?? 1);
      setPrice(data.price ?? 100);
    });
  }, [id]);

  const validateTitle = (val) => {
    if (!val || !val.trim()) return "Title is required";
    if (val.trim().length < 3) return "Title must be at least 3 characters";
    if (val.trim().length > 100) return "Title cannot exceed 100 characters";
    return "";
  };

  const validateAddress = (val) => {
    if (!val || !val.trim()) return "Address is required";
    if (val.trim().length < 3) return "Address must be at least 3 characters";
    if (val.trim().length > 200) return "Address cannot exceed 200 characters";
    return "";
  };

  const validatePhotos = (photos) => {
    if (!photos || photos.length === 0) return "Please add at least 1 photo of your place";
    return "";
  };

  const validateDescription = (val) => {
    if (!val || !val.trim()) return "Description is required";
    if (val.trim().length < 20) return `Description must be at least 20 characters (currently ${val.trim().length})`;
    if (val.trim().length > 3000) return "Description cannot exceed 3000 characters";
    return "";
  };

  const validateMaxImg = (val) => {
    const num = Number(val);
    if (val === "" || val === null || val === undefined) return "Image limit is required";
    if (!Number.isInteger(num) || num < 1) return "Must be at least 1 image";
    if (num > 100) return "Cannot exceed 100 images";
    return "";
  };

  const validatePrice = (val) => {
    const num = Number(val);
    if (val === "" || val === null || val === undefined) return "Price is required";
    if (isNaN(num) || num < 0) return "Price cannot be negative";
    return "";
  };

  const errors = {
    title: validateTitle(title),
    address: validateAddress(address),
    photos: validatePhotos(addedPhotos),
    description: validateDescription(description),
    maxImg: validateMaxImg(maxImg),
    price: validatePrice(price),
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const inputHeader = (text) => {
    return <h2 className="text-lg font-semibold text-slate-900">{text}</h2>;
  };
  const inputDescription = (text) => {
    return <p className="mt-1 text-sm text-slate-500">{text}</p>;
  };
  const preInput = (header, description) => {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  };

  const savePlace = async (e) => {
    e.preventDefault();
    setTouched({
      title: true,
      address: true,
      photos: true,
      description: true,
      maxImg: true,
      price: true,
    });

    if (errors.title) {
      titleRef.current?.focus();
      return;
    }
    if (errors.address) {
      addressRef.current?.focus();
      return;
    }
    if (errors.photos) {
      photosRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      showToast("Please upload at least one photo before saving.", "error");
      return;
    }
    if (errors.description) {
      descriptionRef.current?.focus();
      return;
    }
    if (errors.maxImg) {
      maxImgRef.current?.focus();
      return;
    }
    if (errors.price) {
      priceRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    const placeData = {
      title: title.trim(),
      address: address.trim(),
      addedPhotos,
      description: description.trim(),
      maxImg: Number(maxImg),
      price: Number(price),
    };

    try {
      if (id) {
        await axios.put("/places", {
          id,
          ...placeData,
        });
        showToast("Place updated successfully.");
      } else {
        await axios.post("/places", placeData);
        showToast("Place created successfully.");
      }
      setRedirect(true);
    } catch (error) {
      console.log("savePlace error: " + error);
      showToast("We could not save this place. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div className="pb-10">
      <AccountNav />
      <main className="mx-auto max-w-full md:max-w-4xl lg:max-w-5xl 2xl:max-w-[1400px] 3xl:max-w-[1800px] 4k:max-w-[2400px] px-4 sm:px-6">
        <div className="mb-6 rounded-3xl bg-slate-900 px-6 py-7 text-white shadow-lg sm:px-8 2xl:px-12 2xl:py-10 4k:px-16 4k:py-14">
          <p className="text-xs sm:text-sm 2xl:text-base 4k:text-xl font-medium text-slate-300">Property management</p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl 2xl:text-4xl 4k:text-5xl">{id ? "Edit place" : "Create a new place"}</h1>
          <p className="mt-2 text-xs sm:text-sm 2xl:text-base 4k:text-xl text-slate-300">Add the details guests need to discover and book your place.</p>
        </div>

        <form onSubmit={savePlace} className="space-y-5" noValidate>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <InputField
                  inputRef={titleRef}
                  label="Title"
                  type="text"
                  name="title"
                  placeholder="For example: My lovely apartment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => handleBlur("title")}
                  error={errors.title}
                  touched={touched.title}
                  required
                  maxLength={100}
                  helperText="Keep it short, clear, and memorable."
                />
              </div>
              <div>
                <InputField
                  inputRef={addressRef}
                  label="Address"
                  type="text"
                  name="address"
                  placeholder="City, state, or full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => handleBlur("address")}
                  error={errors.address}
                  touched={touched.address}
                  required
                  maxLength={200}
                  helperText="Where is this place located?"
                />
              </div>
            </div>
          </section>

          <section ref={photosRef} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            {preInput("Photos", "Add clear photos. Select the star on a photo to make it the cover image.")}
            <div className="mt-4">
              <PhotoUploader
                addedPhotos={addedPhotos}
                setAddedPhotos={(photos) => {
                  setAddedPhotos(photos);
                  setTouched((prev) => ({ ...prev, photos: true }));
                }}
              />
              {touched.photos && errors.photos && (
                <p className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1.5 animate-fadeIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.photos}</span>
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              {inputHeader("Description")}
              <span className="text-xs font-medium text-slate-400">
                {description.length}/3000
              </span>
            </div>
            {inputDescription("Help guests understand what makes this place special.")}
            <div className="mt-3">
              <textarea
                ref={descriptionRef}
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleBlur("description")}
                placeholder="Describe your place, its amenities, and anything guests should know (min 20 characters)"
                maxLength={3000}
                className={`w-full rounded-xl border p-3.5 text-sm outline-none transition duration-150 h-36 resize-none ${
                  touched.description && errors.description
                    ? "border-red-500 bg-red-50/30 text-slate-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-slate-300 bg-white text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10"
                }`}
              />
              {touched.description && errors.description && (
                <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1.5 animate-fadeIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.description}</span>
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            {preInput("Availability and price", "Set how many images a guest can book and the price for each image.")}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <InputField
                  inputRef={maxImgRef}
                  label="Maximum images per booking"
                  type="number"
                  name="maxImg"
                  min="1"
                  max="100"
                  value={maxImg}
                  onChange={(e) => setMaxImg(e.target.value)}
                  onBlur={() => handleBlur("maxImg")}
                  error={errors.maxImg}
                  touched={touched.maxImg}
                  required
                />
              </div>
              <div>
                <InputField
                  inputRef={priceRef}
                  label="Price per image ($)"
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onBlur={() => handleBlur("price")}
                  error={errors.price}
                  touched={touched.price}
                  required
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link
              to="/account/places"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="primary max-w-xs px-6 shadow-sm transition hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : id ? (
                "Save changes"
              ) : (
                "Create place"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PlaceFormPage;
