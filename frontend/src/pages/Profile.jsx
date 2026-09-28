import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";

const phoneCountries = [
    { country: "IN", name: "India", code: "+91" },
    { country: "GB", name: "United Kingdom", code: "+44" },
    { country: "US", name: "United States", code: "+1" },
    { country: "CA", name: "Canada", code: "+1" },
    { country: "AU", name: "Australia", code: "+61" },
    { country: "NZ", name: "New Zealand", code: "+64" },
];

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

export default function Profile() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_country: "",
        phone_country_code: "",
        phone_number: "",
        gender: "",
        dob: "",
        qualification: "",
        work_experience: "",
        service: "",
        country: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/profile");

            const user = response.data.user;

            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone_country: user.phone_country || "",
                phone_country_code: user.phone_country_code || "",
                phone_number: user.phone_number || "",
                gender: user.gender || "",
                dob: user.dob || "",
                qualification: user.qualification || "",
                work_experience: user.work_experience || "",
                service: user.service || "",
                country: user.country || "",
            });
        } catch (error) {
            console.error("Profile fetch error:", error);

            if (error.response?.status === 401) {
                navigate("/login");
                return;
            }

            toast.error("Unable to load profile.");
        } finally {
            setLoading(false);
        }
    };

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
    };

    const handlePhoneCountryChange = (e) => {
        const selectedCountry = phoneCountries.find(
            (item) => item.country === e.target.value,
        );

        setFormData((previousData) => ({
            ...previousData,
            phone_country: selectedCountry.country,
            phone_country_code: selectedCountry.code,
        }));

        setErrors((previousErrors) => ({
            ...previousErrors,
            phone_country: "",
            phone_country_code: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setErrors({});

        try {
            const response = await api.put("/profile", {
                phone_country: formData.phone_country,
                phone_country_code: formData.phone_country_code,
                phone_number: formData.phone_number,
                gender: formData.gender,
                dob: formData.dob,
                qualification: formData.qualification,
                work_experience: formData.work_experience,
                service: formData.service,
                country: formData.country,
            });

            setFormData((previousData) => ({
                ...previousData,
                ...response.data.user,
            }));

            toast.success("Profile updated successfully.");
        } catch (error) {
            console.error("Profile update error:", error);

            if (error.response?.status === 422) {
                const backendErrors = error.response.data.errors || {};

                setErrors({
                    phone_country: backendErrors.phone_country?.[0] || "",
                    phone_country_code:
                        backendErrors.phone_country_code?.[0] || "",
                    phone_number: backendErrors.phone_number?.[0] || "",
                    gender: backendErrors.gender?.[0] || "",
                    dob: backendErrors.dob?.[0] || "",
                    qualification: backendErrors.qualification?.[0] || "",
                    work_experience: backendErrors.work_experience?.[0] || "",
                    service: backendErrors.service?.[0] || "",
                    country: backendErrors.country?.[0] || "",
                });

                toast.error("Please correct the highlighted fields.");
            } else {
                toast.error("Unable to update profile.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-slate-600">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />
            <div className="px-4 py-10">
                <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-md md:p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">
                            My Profile
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Update your personal and application details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-slate-800">
                                Basic Information
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        value={formData.name}
                                        readOnly
                                        className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone Information */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-slate-800">
                                Phone Information
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Phone Country
                                    </label>

                                    <select
                                        name="phone_country"
                                        value={formData.phone_country}
                                        onChange={handlePhoneCountryChange}
                                        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none ${
                                            errors.phone_country
                                                ? "border-red-500"
                                                : "border-slate-300"
                                        }`}
                                    >
                                        <option value="">
                                            Select phone country
                                        </option>

                                        {phoneCountries.map((item) => (
                                            <option
                                                key={item.country}
                                                value={item.country}
                                            >
                                                {item.name} ({item.code})
                                            </option>
                                        ))}
                                    </select>

                                    {errors.phone_country && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.phone_country}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Phone Number
                                    </label>

                                    <div className="flex">
                                        <div className="flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 px-4 text-sm text-slate-600">
                                            {formData.phone_country_code ||
                                                "--"}
                                        </div>

                                        <input
                                            type="text"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            className={`min-w-0 flex-1 rounded-r-lg border px-4 py-3 text-sm outline-none ${
                                                errors.phone_number
                                                    ? "border-red-500"
                                                    : "border-slate-300"
                                            }`}
                                        />
                                    </div>

                                    {errors.phone_number && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.phone_number}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-slate-800">
                                Personal Information
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Date of Birth
                                    </label>

                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Education & Work */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-slate-800">
                                Education & Work
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Qualification
                                    </label>

                                    <input
                                        type="text"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        placeholder="Enter qualification"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Work Experience
                                    </label>

                                    <input
                                        type="text"
                                        name="work_experience"
                                        value={formData.work_experience}
                                        onChange={handleChange}
                                        placeholder="Enter work experience"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Application Information */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-slate-800">
                                Application Information
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Service
                                    </label>

                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
                                    >
                                        <option value="">Select service</option>

                                        {services.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Country
                                    </label>

                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
                                    >
                                        <option value="">Select country</option>

                                        {countries.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end border-t border-slate-200 pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Save Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
