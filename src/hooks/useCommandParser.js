export const useCommandParser = () => {
  const parseCommand = (input) => {
    const text = input.toLowerCase().trim();

    // =========================
    // ADD ITEM
    // =========================
    const addPatterns = [
      /add (?:a )?item(?: which)? name(?: will be| will)? (.+?) and description (.+)/i,

      /add (.+?) with description (.+)/i,

      /add item (.+?) description (.+)/i,

      /create item (.+?) with description (.+)/i,

      /add item (.+)/i,

      /add (.+)/i,
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
    // LIST
    // =========================
    if (
      text.includes("show all") ||
      text.includes("list all") ||
      text.includes("show items") ||
      text.includes("all items")
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
  };

  return { parseCommand };
};
