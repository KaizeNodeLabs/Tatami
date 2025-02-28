"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type FormEvent, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (validateEmail(email)) {
      // TODO: Handle subscription to newsletter
      setEmail("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) validateEmail(e.target.value);
          }}
          className="border-width-2 p-0 mr-2"
          variant="footer"
          required
          aria-invalid={!!error}
          aria-describedby={error ? "email-error" : undefined}
        />
        <Button
          type="submit"
          className="bg-primary text-black hover:bg-primary/90 px-6 text-sm px-4 rounded-full"
        >
          Subscribe
        </Button>
      </div>
      {error && (
        <span id="email-error" className="text-sm text-red mt-1" role="alert">
          {error}
        </span>
      )}
    </form>
  );
};
