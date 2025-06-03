import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function CallbackPage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      console.log("OAuth authorization code:", code);
      // TODO: send this code to your backend to exchange for tokens
    }
  }, [searchParams]);

  return (
    <div>
      <h2>OAuth Callback</h2>
      <p>Processing login...</p>
    </div>
  );
}
