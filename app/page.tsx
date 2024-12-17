"use client";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [numberOfPasswords, setNumberOfPasswords] = useState(1);
  const [passLength, setPassLength] = useState(12);
  const [generatedPasswords, setGeneratedPasswords] = useState<string[]>([]);

  const downloadCSV = (passwords: string[]) => {
    const csvContent = "Password\n" + passwords.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "passwords.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/generate-passwords?numOfPass=${numberOfPasswords}&length=${passLength}`
      );
      const data: { passwords?: string[]; error?: string } =
        await response.json();

      if (data.error) {
        throw new Error("Failed to fetch passwords");
      }

      if (data.passwords) {
        setGeneratedPasswords(data.passwords);
      }
    } catch (error) {
      setError("Failed to generate passwords. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    downloadCSV(generatedPasswords);
  };

  return (
    <div className="flex flex-col gap-4 items-center p-4 rounded-md shadow-md mx-auto w-full sm:w-1/2 sm:my-12 my-4 sm:px-8 px-4 justify-center">
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="numOfPass">Number Of Passwords</label>
        <input
          id="numOfPass"
          type="number"
          min={1}
          max={100000}
          value={numberOfPasswords}
          onChange={(e) => setNumberOfPasswords(parseInt(e.target.value))}
          className="w-full outline-0 rounded-md p-2 border"
          placeholder="Number of Passwords (e.g., 10)"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="passLength">Length Of Passwords</label>
        <input
          id="passLength"
          type="number"
          min={12}
          max={50}
          value={passLength}
          onChange={(e) => setPassLength(parseInt(e.target.value))}
          className="w-full outline-0 rounded-md p-2 border"
          placeholder="Password Length (e.g., 12)"
        />
      </div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`outline-0 rounded-md p-2 w-full ${
          loading ? "bg-gray-500" : "bg-blue-500"
        } text-white`}
      >
        {loading ? "Generating..." : "Generate Passwords"}
      </button>

      <button
        onClick={handleDownload}
        disabled={generatedPasswords.length === 0}
        className={`outline-0 rounded-md p-2 w-full ${
          generatedPasswords.length === 0 ? "bg-gray-500" : "bg-gray-900"
        } text-white disabled:cursor-not-allowed`}
      >
        Download Passwords
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
