import { useEffect, useState } from "react";
import type { PolicyDocument } from "../types";

export function useDocuments() {
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/chat/policies` || "";
// const API_URL="https://hrpoc-fqbvc9g7gtdrb9be.southindia-01.azurewebsites.net/api/chat/policies"

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(API_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const result = await response.json();

        const mappedDocs: PolicyDocument[] = result.documents.map(
          (doc: any, index: number) => ({
            id: index + 1,
            name: doc.file_name,
            category: doc.category,
            updated: doc.location,
            url: doc.url,
          })
        );

        setDocuments(mappedDocs);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch documents");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return { documents, isLoading, error };
}