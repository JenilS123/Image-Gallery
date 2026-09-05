import React, { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Pages/UserContext";
import { useToast } from "./Toast";
import InputField from "./InputField";

const BookingWidget = ({ place }) => {
  const [date, setDate] = useState("");
  const [numberOfImg, setNumberOfImg] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [touched, setTouched] = useState({
    date: false,
    numberOfImg: false,
    name: false,
    mobile: false,
  });

  const dateRef = useRef(null);
  const numberOfImgRef = useRef(null);
  const nameRef = useRef(null);
  const mobileRef = useRef(null);

  const { user } = useContext(UserContext);
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    } else {
      setName("");
    }
  }, [user]);

  const todayStr = new Date().toISOString().split("T")[0];

  const validateDate = (val) => {
    if (!val) return "Booking date is required";
    if (val < todayStr) return "Date cannot be in the past";
    return "";
  };

  const validateNumberOfImg = (val) => {
    const num = Number(val);
    const max = Number(place.maxImg || 1);
    if (val === "" || val === null || val === undefined) return "Image count is required";
    if (!Number.isInteger(num) || num < 1) return "Must be at least 1 image";
    if (num > max) return `Maximum allowed is ${max} image(s)`;
    return "";
  };

  const validateName = (val) => {
    if (!val || !val.trim()) return "Your name is required";
    if (val.trim().length < 2) return "Name must be at least 2 characters";
    if (val.trim().length > 80) return "Name cannot exceed 80 characters";
    return "";
  };

  const validateMobile = (val) => {
    if (!val || !val.trim()) return "Phone number is required";
    const phoneDigits = val.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return "Enter a valid 10 to 15 digit phone number";
    }
    return "";
  };

  const errors = {
    date: validateDate(date),
    numberOfImg: validateNumberOfImg(numberOfImg),
    name: validateName(name),
    mobile: validateMobile(mobile),
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const bookThisPlace = async (e) => {
    e.preventDefault();
    setTouched({
      date: true,
      numberOfImg: true,
      name: true,
      mobile: true,
    });

    if (errors.date) {
      dateRef.current?.focus();
      return;
    }
    if (errors.numberOfImg) {
      numberOfImgRef.current?.focus();
      return;
    }
    if (errors.name) {
      nameRef.current?.focus();
      return;
    }
    if (errors.mobile) {
      mobileRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const respo = await axios.post("/bookings", {
        place: place._id,
        date,
        numberOfImg: Number(numberOfImg),
        name: name.trim(),
        mobile: mobile.trim(),
        price: Number(numberOfImg) * place.price,
      });
      if (respo.status === 201) {
        showToast("Your booking was created successfully.");
        setRedirect(`/account/bookings/`);
      } else {
        showToast("Please complete all booking details.", "error");
      }
    } catch (error) {
      console.log("client bookthisplace error: ", error);
      showToast("We could not create your booking. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const totalPrice = (Number(numberOfImg) > 0 && !isNaN(Number(numberOfImg))) ? Number(numberOfImg) * place.price : 0;

  return (
    <div>
      <form onSubmit={bookThisPlace} noValidate className="bg-white shadow-md border border-slate-200 p-5 sm:p-6 2xl:p-8 4k:p-10 rounded-2xl space-y-3">
        <div className="text-xl sm:text-2xl 2xl:text-3xl 4k:text-4xl text-center font-bold text-slate-900 mb-4">
          Price: <span className="text-primary">${place.price}</span> / per image
        </div>

        <div className="space-y-2">
          <InputField
            inputRef={dateRef}
            label="Select Date"
            type="date"
            name="date"
            min={todayStr}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={() => handleBlur("date")}
            error={errors.date}
            touched={touched.date}
            required
          />

          <InputField
            inputRef={numberOfImgRef}
            label={`Number of Images (Max: ${place.maxImg || 1})`}
            type="number"
            name="numberOfImg"
            min="1"
            max={place.maxImg || 1}
            value={numberOfImg}
            onChange={(e) => setNumberOfImg(e.target.value)}
            onBlur={() => handleBlur("numberOfImg")}
            error={errors.numberOfImg}
            touched={touched.numberOfImg}
            required
          />

          {Number(numberOfImg) > 0 && (
            <div className="pt-2 border-t border-slate-200 mt-3">
              <InputField
                inputRef={nameRef}
                label="Your Full Name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur("name")}
                error={errors.name}
                touched={touched.name}
                required
                maxLength={80}
                autoComplete="name"
              />

              <InputField
                inputRef={mobileRef}
                label="Phone Number"
                type="tel"
                name="mobile"
                placeholder="+1 555 123 4567"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                onBlur={() => handleBlur("mobile")}
                error={errors.mobile}
                touched={touched.mobile}
                required
                autoComplete="tel"
                helperText="10 to 15 digits phone number"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="primary my-3 flex items-center justify-center gap-2 shadow-md transition hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed py-2.5 sm:py-3 2xl:py-4 4k:py-5 text-sm sm:text-base 2xl:text-lg 4k:text-2xl font-semibold"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Booking...</span>
            </>
          ) : (
            <>
              <span>Book this Place</span>
              {totalPrice > 0 && <span className="font-bold">(${totalPrice})</span>}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingWidget;
