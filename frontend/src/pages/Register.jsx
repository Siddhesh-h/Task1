import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_country_code: "+91",
        phone_number: "",
        gender: "",
        dob: "",
        qualification: "",
        work_experience: "",
        service: "",
        country: "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const services = [
        "PR Australia",
        "PR Canada",
        "TR Australia",
        "TR Canada",
        "Study Abroad",
        "Post Graduate",
        "Under Graduate",
        "Tourist Visa",
    ];

    const countries = ["UK", "USA", "Canada", "Australia", "New Zealand"];

    const countryCodes = [
        {
            code: "+91",
            country: "India",
        },
        {
            code: "+44",
            country: "UK",
        },
        {
            code: "+1",
            country: "USA / Canada",
        },
        {
            code: "+61",
            country: "Australia",
        },
        {
            code: "+64",
            country: "New Zealand",
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: "",
        }));

        setServerError("");
    };

    const validateForm = () => {
        const newErrors = {};

        // Name
        if (!formData.name.trim()) {
            newErrors.name = "Name is required.";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters.";
        }

        // Email
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(formData.email)) {
                newErrors.email = "Please enter a valid email address.";
            }
        }

        // Phone country code
        if (!formData.phone_country_code) {
            newErrors.phone_country_code = "Phone country code is required.";
        }

        // Phone number
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = "Phone number is required.";
        } else if (!/^[0-9]{7,15}$/.test(formData.phone_number)) {
            newErrors.phone_number =
                "Phone number must contain 7 to 15 digits.";
        }

        // Gender
        if (!formData.gender) {
            newErrors.gender = "Please select your gender.";
        }

        // Date of birth
        if (!formData.dob) {
            newErrors.dob = "Date of birth is required.";
        } else {
            const today = new Date();

            const minimumDate = new Date(
                today.getFullYear() - 18,
                today.getMonth(),
                today.getDate(),
            );

            const selectedDate = new Date(formData.dob);

            if (selectedDate > minimumDate) {
                newErrors.dob = "You must be at least 18 years old.";
            }
        }

        // Qualification
        if (!formData.qualification.trim()) {
            newErrors.qualification = "Qualification is required.";
        }

        // Work experience
        if (!formData.work_experience.trim()) {
            newErrors.work_experience = "Work experience is required.";
        }

        // Service
        if (!formData.service) {
            newErrors.service = "Please select a service.";
        }

        // Country
        if (!formData.country) {
            newErrors.country = "Please select a country.";
        }

        // Password
        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        }

        // Confirm password
        if (!formData.password_confirmation) {
            newErrors.password_confirmation = "Please confirm your password.";
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Passwords do not match.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage("");
        setServerError("");

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/register", formData);

            setSuccessMessage(response.data.message);

            setFormData({
                name: "",
                email: "",
                phone_country_code: "+91",
                phone_number: "",
                gender: "",
                dob: "",
                qualification: "",
                work_experience: "",
                service: "",
                country: "",
                password: "",
                password_confirmation: "",
            });

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            if (error.response?.status === 422) {
                const backendErrors = error.response.data.errors || {};

                setErrors({
                    name: backendErrors.name?.[0] || "",
                    email: backendErrors.email?.[0] || "",
                    phone_country_code:
                        backendErrors.phone_country_code?.[0] || "",
                    phone_number: backendErrors.phone_number?.[0] || "",
                    gender: backendErrors.gender?.[0] || "",
                    dob: backendErrors.dob?.[0] || "",
                    qualification: backendErrors.qualification?.[0] || "",
                    work_experience: backendErrors.work_experience?.[0] || "",
                    service: backendErrors.service?.[0] || "",
                    country: backendErrors.country?.[0] || "",
                    password: backendErrors.password?.[0] || "",
                    password_confirmation:
                        backendErrors.password_confirmation?.[0] || "",
                });
            } else {
                setServerError(
                    error.response?.data?.message ||
                        "Something went wrong. Please try again.",
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const getMaximumDob = () => {
        const today = new Date();

        const maximumDob = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate(),
        );

        return maximumDob.toISOString().split("T")[0];
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">
            <div className="mx-auto w-full max-w-2xl">
                <div className="rounded-2xl bg-white p-8 shadow-xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Create Account
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Register to get started
                        </p>
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {serverError}
                        </div>
                    )}

                    {/* Success */}
                    {successMessage && (
                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {successMessage}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="space-y-6"
                    >
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                                    errors.name
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                }`}
                            />

                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                                    errors.email
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                }`}
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Phone Number
                            </label>

                            <div className="flex gap-3">
                                <select
                                    name="phone_country_code"
                                    value={formData.phone_country_code}
                                    onChange={handleChange}
                                    className={`w-36 rounded-lg border bg-white px-3 py-3 text-sm outline-none focus:ring-2 ${
                                        errors.phone_country_code
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                >
                                    {countryCodes.map((item) => (
                                        <option
                                            key={item.code}
                                            value={item.code}
                                        >
                                            {item.code} {item.country}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(
                                            /\D/g,
                                            "",
                                        );

                                        if (value.length <= 15) {
                                            setFormData((previousData) => ({
                                                ...previousData,
                                                phone_number: value,
                                            }));
                                        }

                                        setErrors((previousErrors) => ({
                                            ...previousErrors,
                                            phone_number: "",
                                        }));

                                        setServerError("");
                                    }}
                                    placeholder="Enter phone number"
                                    inputMode="numeric"
                                    maxLength={15}
                                    className={`flex-1 rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 ${
                                        errors.phone_number
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                />
                            </div>

                            {errors.phone_country_code && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.phone_country_code}
                                </p>
                            )}

                            {errors.phone_number && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.phone_number}
                                </p>
                            )}
                        </div>

                        {/* Gender & DOB*/}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Gender */}
                            <div>
                                <label
                                    htmlFor="gender"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Gender
                                </label>

                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:ring-2 ${
                                        errors.gender
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                >
                                    <option value="">Select Gender</option>

                                    <option value="Male">Male</option>

                                    <option value="Female">Female</option>

                                    <option value="Other">Other</option>
                                </select>

                                {errors.gender && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.gender}
                                    </p>
                                )}
                            </div>

                            {/* DOB */}
                            <div>
                                <label
                                    htmlFor="dob"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Date of Birth
                                </label>

                                <input
                                    id="dob"
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    max={getMaximumDob()}
                                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 ${
                                        errors.dob
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                />

                                {errors.dob && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.dob}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Qualification */}
                            <div>
                                <label
                                    htmlFor="qualification"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Qualification
                                </label>

                                <input
                                    id="qualification"
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    placeholder="e.g. Bachelor's Degree"
                                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 ${
                                        errors.qualification
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                />

                                {errors.qualification && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.qualification}
                                    </p>
                                )}
                            </div>

                            {/* Work Experience */}
                            <div>
                                <label
                                    htmlFor="work_experience"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Work Experience
                                </label>

                                <input
                                    id="work_experience"
                                    type="text"
                                    name="work_experience"
                                    value={formData.work_experience}
                                    onChange={handleChange}
                                    placeholder="e.g. Fresher / 2 Years"
                                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 ${
                                        errors.work_experience
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                />

                                {errors.work_experience && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.work_experience}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Service */}
                            <div>
                                <label
                                    htmlFor="service"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Service
                                </label>

                                <select
                                    id="service"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:ring-2 ${
                                        errors.service
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                >
                                    <option value="">Select Service</option>

                                    {services.map((service) => (
                                        <option key={service} value={service}>
                                            {service}
                                        </option>
                                    ))}
                                </select>

                                {errors.service && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.service}
                                    </p>
                                )}
                            </div>

                            {/* Country */}
                            <div>
                                <label
                                    htmlFor="country"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Country
                                </label>

                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:ring-2 ${
                                        errors.country
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                >
                                    <option value="">Select Country</option>

                                    {countries.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>

                                {errors.country && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.country}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        className={`w-full rounded-lg border px-4 py-3 pr-20 text-sm outline-none focus:ring-2 ${
                                            errors.password
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                        }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) => !previous,
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-700"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                        className={`w-full rounded-lg border px-4 py-3 pr-20 text-sm outline-none focus:ring-2 ${
                                            errors.password_confirmation
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                                : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                                        }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (previous) => !previous,
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-700"
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                {errors.password_confirmation && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
