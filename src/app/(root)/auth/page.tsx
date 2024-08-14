import { supabase } from "@/utils/supabase/client";
import React from "react";

export default async function AuthPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("유저", user);

  return (
    <div>
      <h1>Auth Page</h1>
    </div>
  );
}
