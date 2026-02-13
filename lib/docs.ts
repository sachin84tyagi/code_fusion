import fs from "fs";
import path from "path";

export function getTutorialContent(category: string, subCategory: string): string | null {
    if (!subCategory) return null;

    // Generate filename dynamically based on subcategory name
    // Example: "Variables & Data Types" -> "variables-data-types.md"
    const fileName = category + "/" + subCategory
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        + ".md";

    if (!fileName) return null;

    const filePath = path.join(process.cwd(), "content", "tutorials", fileName);
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, "utf8");
        } else {
            console.warn(`[Docs] File not found: ${filePath}`);
        }
    } catch (error) {
        console.error(`[Docs] Error reading markdown file: ${filePath}`, error);
    }

    return null;
}
