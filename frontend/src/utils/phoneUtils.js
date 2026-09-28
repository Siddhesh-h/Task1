export const phoneCountries = [
    { country: "IN", name: "India", code: "+91" },
    { country: "GB", name: "United Kingdom", code: "+44" },
    { country: "US", name: "United States", code: "+1" },
    { country: "CA", name: "Canada", code: "+1" },
    { country: "AU", name: "Australia", code: "+61" },
    { country: "NZ", name: "New Zealand", code: "+64" },
];

export function detectCountryFromNationalNumber(value) {
    const number = value.replace(/\D/g, "");

    if (!number) {
        return null;
    }

    if (/^[6-9][0-9]{9}$/.test(number)) {
        return {
            country: "IN",
            code: "+91",
        };
    }

    if (/^07[0-9]{9}$/.test(number)) {
        return {
            country: "GB",
            code: "+44",
        };
    }


    if (/^04[0-9]{8}$/.test(number)) {
        return {
            country: "AU",
            code: "+61",
        };
    }


    if (/^02[0-9]{7,8}$/.test(number)) {
        return {
            country: "NZ",
            code: "+64",
        };
    }



    return null;
}