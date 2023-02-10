const fetchData = async () => {
  const API_URL = localStorage.getItem("apiUrl");
  console.log(API_URL);
  if (API_URL) {
    const res = await fetch(`${API_URL}/users`);
    const data = await res.json();
    console.log(data);
  } else {
    window.location.href = "/api";
  }
};

fetchData();
