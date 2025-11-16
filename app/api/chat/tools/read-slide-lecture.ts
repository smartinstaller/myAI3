import { tool } from "ai";
import { z } from "zod";
import { readDocument } from "@/lib/pinecone";

export const readSlideLecture = tool({
    description: 'Read a slide lecture and return the content of the lecture',
    inputSchema: z.object({
        hypothetical_document: z.string().describe('An example of what the desired text would look like'),
    }),
    execute: async ({ hypothetical_document }) => {
        return await readDocument('lecture_slide', hypothetical_document);
    },
});

