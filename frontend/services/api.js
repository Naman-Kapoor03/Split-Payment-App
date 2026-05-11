import axios from "axios";

const api = axios.create({
  baseURL:
    "https://pavement-payphone-likely.ngrok-free.dev/api",

  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZmQ3MzU0Y2M3NzQ1OGEwMzNlOTI2NCIsImlhdCI6MTc3ODM5NTI4NywiZXhwIjoxNzc5MDAwMDg3fQ.UdKiJzWTANh1XhotrLJTEg3cRHk1e5efoWrnskU_2Rs",

    "Content-Type":
      "application/json",
  },
});

export default api;