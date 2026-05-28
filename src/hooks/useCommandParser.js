import { useCallback } from "react";

export const useCommandParser = () => {
  const parseCommand = useCallback((input) => {
    const text = input.toLowerCase().trim();

    // =========================
    // ADD ITEM
    // =========================
    const addPatterns = [
      /add (?:a )?item(?: which)? name(?: will be| will)? (.+?) and description (.+)/i,

      /add (.+?) with description (.+)/i,

      /add item (.+?) description (.+)/i,

      /create item (.+?) with description (.+)/i,

      /create (.+?) with description (.+)/i,

      /add item (.+)/i,

      /create item (.+)/i,

      /add (.+)/i,

      /create (.+)/i,
    ];

    for (const pattern of addPatterns) {
      const match = input.match(pattern);

      if (match) {
        return {
          action: "add",
          title: match[1]?.trim(),
          description: match[2]?.trim() || "",
        };
      }
    }

    // =========================
    // UPDATE ITEM
    // =========================
    const updatePatterns = [
      {
        pattern:
          /(?:update|change|rename) item (.+?) to title (.+?) and description (.+)/i,
        type: "both",
      },
      {
        pattern: /(?:update|change) item (.+?) to (.+?) and description (.+)/i,
        type: "both",
      },
      {
        pattern:
          /(?:update|change) item (.+?) with title (.+?) and description (.+)/i,
        type: "both",
      },
      {
        pattern: /(?:update|change) item (.+?) description to (.+)/i,
        type: "description",
      },
      {
        pattern: /(?:update|change) description of (.+?) to (.+)/i,
        type: "description",
      },
      {
        pattern: /(?:update|change) item (.+?) to (.+)/i,
        type: "title",
      },
      {
        pattern: /(?:rename|change) item (.+?) to (.+)/i,
        type: "title",
      },
    ];

    for (const entry of updatePatterns) {
      const match = input.match(entry.pattern);

      if (match) {
        if (entry.type === "both") {
          return {
            action: "update",
            updateType: "both",
            oldTitle: match[1]?.trim(),
            title: match[2]?.trim(),
            description: match[3]?.trim(),
          };
        }

        return {
          action: "update",
          updateType: entry.type,
          oldTitle: match[1]?.trim(),
          value: match[2]?.trim(),
        };
      }
    }

    // =========================
    // DELETE ITEM
    // =========================
    const deletePatterns = [
      /delete item (.+)/i,

      /remove item (.+)/i,

      /delete (.+)/i,

      /remove (.+)/i,
    ];

    for (const pattern of deletePatterns) {
      const match = input.match(pattern);

      if (match) {
        return {
          action: "delete",
          title: match[1]?.trim(),
        };
      }
    }

    // =========================
    // SEARCH
    // =========================
    const searchPatterns = [/search (.+)/i, /find (.+)/i, /look for (.+)/i];

    for (const pattern of searchPatterns) {
      const match = input.match(pattern);

      if (match) {
        return {
          action: "search",
          query: match[1]?.trim(),
        };
      }
    }

    // =========================
    // LIST ITEMS
    // =========================
    if (
      text.includes("show all") ||
      text.includes("list all") ||
      text.includes("show items") ||
      text.includes("all items") ||
      text.includes("show all items")
    ) {
      return {
        action: "list",
      };
    }

    // =========================
    // UNKNOWN
    // =========================
    return {
      action: "unknown",
    };
  }, []);

  return { parseCommand };
};
