import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qjyopwmrtkkqahgwbobg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyOTc5MzIyNSwiZXhwIjoxOTQ1MzY5MjI1fQ.bM2WyEadFQgks1lpkqLtTK51eXXIkh1dtkEJoN0L3rM"
);

export default supabase;
