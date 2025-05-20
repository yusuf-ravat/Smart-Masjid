import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import masjidIllustration from "../assets/masjid-illustration.jpg"; // Update to match your image path

const HomePage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState({});
  const [locationName, setLocationName] = useState(null);
  const [locationCountry, setlocationCountry] = useState(null);
  const [nearbyMasjids, setNearbyMasjids] = useState([]);
  const mergedLocation = `${locationName}, ${locationCountry}`;
  const [bukhariHadith, setBukhariHadith] = useState(null);
  const [muslimHadith, setMuslimHadith] = useState(null);




  // Fetch user's location using Geolocation API
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          async (error) => {
            console.error("Error getting location", error);
            try {
              const res = await fetch("https://ipapi.co/json/");
              const data = await res.json();
              setLocation({
                latitude: data.latitude,
                longitude: data.longitude,
              });
            } catch (err) {
              console.error("Error fetching fallback location:", err);
            }
          }
        );
      } catch (err) {
        console.error("Error fetching location:", err);
      }
    };

    fetchLocation();
  }, []);

  // Fetch prayer times and location name when location is available
  useEffect(() => {
    if (location) {
      // Fetch prayer times
      fetch(
        `https://api.aladhan.com/v1/timings?latitude=${location.latitude}&longitude=${location.longitude}&method=2`
      )
        .then((res) => res.json())
        .then((data) => {
          setPrayerTimes(data.data.timings);
        })
        .catch((err) => console.error("Error fetching prayer times:", err));

      // Reverse geocode location name using Nominatim
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=10&addressdetails=1`
      )
        .then((res) => res.json())
        .then((data) => {
          const address = data.address;
          const country = address.country;
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.hamlet ||
            address.county ||
            address.state ||
            address.country;
          setLocationName(city);
          setlocationCountry(country);
        })
        .catch((err) => console.error("Error fetching location name:", err));
    }
  }, [location]);
 
  // Fetch daily hadith3
  useEffect(() => {
    const fetchHadith = async (bookSlug, setter) => {
      const today = new Date();
      const day = today.getDate(); // 1–31
      const apiUrl = `https://hadithapi.com/api/hadiths?book=${bookSlug}&paginate=1&page=${day}&apiKey=$2y$10$JANTBtowWjQux4VpVIjWFIqQNzbg4tJkzHtp3bvoKqvYD9Opa`;
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data && data.hadiths && data.hadiths.data.length > 0) {
          setter(data.hadiths.data[0]);
        }
      } catch (error) {
        console.error(`Error fetching ${bookSlug} hadith`, error);
      }
    };

    fetchHadith("sahih-bukhari", setBukhariHadith);
    fetchHadith("sahih-muslim", setMuslimHadith);
  }, []);
  
  
  
  // Fetch nearby masjids using Overpass API
  useEffect(() => {
    const fetchNearbyMasjids = async () => {
      const query = `
        [out:json];
        node["amenity"="place_of_worship"]["religion"="muslim"](around:10000,${location.latitude},${location.longitude});
        out body;
      `;
  
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });
  
      const data = await res.json();
      const masjids = data.elements || [];
  
      const resolvedMasjids = await Promise.all(
        masjids.map(async (masjid) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${masjid.lat}&lon=${masjid.lon}`
            );
            const addrData = await res.json();
            return {
              name: masjid.tags.name || "Unnamed Masjid",
              address: addrData.display_name || "Address not found",
            };
          } catch (err) {
            return {
              name: masjid.tags.name || "Unnamed Masjid",
              address: "Address not found",
            };
          }
        })
      );
  
      setNearbyMasjids(resolvedMasjids);
    };
  
    if (location) {
      fetchNearbyMasjids();
    }
  }, [location]);
  
  // Function to get the current prayer time based on the current time
  const getCurrentPrayer = (prayerTimes) => {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    let closestPrayer = null;
    let closestTimeDiff = Infinity;

    for (const [name, time] of Object.entries(prayerTimes)) {
      const [hour, minute] = time.split(":").map(Number);
      const prayerMinutes = hour * 60 + minute;

      const diff = Math.abs(nowMinutes - prayerMinutes);
      if (nowMinutes >= prayerMinutes && diff < closestTimeDiff) {
        closestPrayer = name;
        closestTimeDiff = diff;
      }
    }

    return closestPrayer;
  };

  return (
    <div className="font-inter text-gray-800 bg-white">
   {/* Top Navbar */}
<nav className="flex flex-wrap justify-between items-center py-4 px-4 md:px-10">
  <div className="flex flex-wrap gap-4 md:gap-8 text-sm font-medium text-gray-700">
    <a href="#features" className="hover:underline">
      Features
    </a>
    <a href="#how-it-works" className="hover:underline">
      How It Works
    </a>
    <a href="/user" className="hover:underline">
      Login
    </a>
  </div>
  <button
    onClick={() => navigate("/user")}
    className="mt-4 md:mt-0 bg-[#367757] hover:bg-[#2f684c] text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition"
  >
    Get Started
  </button>
</nav>
      {/* Hero Section */}
      <section className="px-10 py-16 flex flex-col-reverse md:flex-row items-center gap-10 max-w-7xl mx-auto">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Smart Masjid Manager
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Streamline your masjid operations with automated schedules,
            donation tracking, and community alerts, and volunteer management.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src={masjidIllustration}
            alt="Masjid Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </section>

      {/* Prayer Times Section */}
      <section className="relative px-6 py-14 bg-gradient-to-tr from-[#e0f7f1] to-[#f1f5f9] text-center">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
  <img src="/icons/salah.png" alt="Salah Icon" className="inline w-14 h-14 mr-2" /> Prayer Times in {mergedLocation}
</h2>
        <p className="text-gray-500 mb-10 text-sm">
          Timings auto-detected from your current location
        </p>

        {prayerTimes.Fajr ? (
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {Object.entries(prayerTimes).map(([name, time]) => {
              const isCurrent = name === getCurrentPrayer(prayerTimes);
              return (
                <div
                  key={name}
                  className={`backdrop-blur-sm border shadow-md rounded-xl w-[130px] h-[110px] flex flex-col items-center justify-center transition-all
              ${
                isCurrent
                  ? "bg-green-100 border-green-600 shadow-lg scale-105"
                  : "bg-white/70 border-gray-200"
              }
            `}
                >
                  <div className="text-sm text-green-700 font-medium uppercase tracking-wide mb-1">
                    {name}
                  </div>
                  <div className="text-xl font-bold text-gray-800">{time}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 text-lg font-medium">⏳ Fetching prayer times...</div>
        )}
      </section>

      {/* Nearby Masjids Section */}
      <section className="px-6 py-14 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
          <img src="/icons/nearmasjid.png" alt="Salah Icon" className="inline w-14 h-14 mr-2" />Nearby Masjids
          </h2>
          <p className="text-gray-500 mb-10 text-sm">
            Masjids within a 10km radius from your current location
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nearbyMasjids.length > 0 ? (
  nearbyMasjids.map((masjid, idx) => {
    const isJama = masjid.name?.toLowerCase().includes("jama") || masjid.name?.toLowerCase().includes("jamia");
    const masjidIcon = isJama ? "/icons/masjid.png" : "/icons/nromalmasjid.png";

    return (
      <div
        key={idx}
        className={`rounded-lg p-5 border transition shadow-sm hover:shadow-md 
          ${isJama ? "bg-green-100 border-green-600" : "bg-gray-50 border-gray-200"}
        `}
      >
        <div className="flex items-center gap-3 mb-2">
          <img
            src={masjidIcon}
            alt="Masjid Icon"
            className="w-10 h-10"
          />
          <h4 className={`font-semibold text-base ${isJama ? "text-green-800" : "text-gray-700"}`}>
            {masjid.name || "Unnamed Masjid"}
          </h4>
        </div>
        <p className="text-sm text-gray-600">
          📍 <span className="font-medium">{masjid.address}</span>
        </p>
      </div>
    );
  })
) : (
  <div className="text-gray-500 text-lg font-medium col-span-full">
    ⏳ Looking for nearby masjids...
  </div>
)}

          </div>
        </div>
      </section>


{/* Daily Hadith Section */}
<section className="px-6 py-20 bg-gradient-to-tr from-[#e0f7f1] to-[#f1f5f9] text-center">
  <h2 className="text-3xl font-bold mb-10 flex items-center justify-center gap-3 text-gray-800">
    <img src="/icons/book.png" alt="Hadith Icon" className="w-10 h-10" />
    Daily Hadith & Reflections
  </h2>

  <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
    {bukhariHadith && (
      <div className="rounded-lg p-5 border transition shadow-sm hover:shadow-md 
          bg-gray-50 border-gray-200">
        <h3 className="text-xl font-semibold text-[#367757] mb-3">📘 Sahih Bukhari</h3>
        <p className="text-gray-700 italic text-lg leading-relaxed text-center mb-6">
          “{bukhariHadith.hadithEnglish}
        </p>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>📖 Book:</strong> {bukhariHadith.book.bookName}</p>
          <p><strong>✍️ Narrator:</strong> {bukhariHadith.book.writerName}</p>
          <p><strong>📌 Status:</strong> {bukhariHadith.status}</p>
        </div>
      </div>
    )}

    {muslimHadith && (
      <div className="rounded-lg p-5 border transition shadow-sm hover:shadow-md 
      bg-gray-50 border-gray-00">
        <h3 className="text-xl font-semibold text-[#367757] mb-3">📗 Sahih Muslim</h3>
        <p className="text-gray-700 italic text-lg leading-relaxed text-center mb-6">
          “{muslimHadith.hadithEnglish}
        </p>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>📖 Book:</strong> {muslimHadith.book.bookName}</p>
          <p><strong>✍️ Narrator:</strong> {muslimHadith.book.writerName}</p>
          <p><strong>📌 Status:</strong> {muslimHadith.status}</p>
        </div>
      </div>
    )}
  </div>
</section>


      {/* Features Section */}
      <section id="features" className="px-10 py-20 bg-white text-center">
        <h2 className="text-3xl font-bold mb-14">Features</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            img="icons/calendar.png"
            title="Prayer Times"
            desc="Automated alerts and daily schedules for prayer time"
          />
          <FeatureCard
            img="icons/megaphone.png"
            title="Announcements"
            desc="Instantly notify the community of important updates"
          />
          <FeatureCard
            img="icons/donate.png"
            title="Donation Tracking"
            desc="Manage and track donations with ease"
          />
          <FeatureCard
            img="icons/volunteer.png"
            title="Volunteer Management"
            desc="Organize and coordinate volunteers for events"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-10 py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-14">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <StepCard
            img="/icons/setup.png"
            title="1. Set Up Your Masjid"
            desc="Create your masjid profile and configure settings."
          />
          <StepCard
            img="/icons/manage.png"
            title="2. Manage with Ease"
            desc="Automate prayer schedules and handle community needs."
          />
          <StepCard
            img="/icons/engage.png"
            title="3. Engage the Community"
            desc="Connect with your community and encourage participation."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#367757] text-white text-center py-16 px-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Bring Your Masjid Online
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 bg-white text-[#000000] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Get Started
        </button>
      </section>
    </div>
  );
};

const FeatureCard = ({ img, title, desc }) => (
  <div className="text-center">
    <img src={img} alt={title} className="w-14 h-14 mx-auto mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

const StepCard = ({ img, title, desc }) => (
  <div className="text-center">
    <img src={img} alt={title} className="w-20 h-20 mx-auto mb-4" />
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

export default HomePage;