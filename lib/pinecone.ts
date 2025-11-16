import { Pinecone } from '@pinecone-database/pinecone';
import { FilterType } from '@/types/data';
import { searchResultsToChunks, getSourcesFromChunks, getContextFromSources } from '@/lib/sources';

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set');
}

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const pineconeIndex = pinecone.Index('bit');

export async function readDocument(
    filterType: FilterType,
    hypothetical_document: string
): Promise<string> {
    const results = await pineconeIndex.namespace('main').searchRecords({
        query: {
            inputs: {
                text: hypothetical_document,
            },
            topK: 10,
            filter: {
                source_type: { $eq: filterType },
            },
        },
        fields: ['text', 'pre_context', 'post_context', 'source_url', 'source_description', 'source_type', 'class_no', 'order'],
    });

    const chunks = searchResultsToChunks(results);
    const sources = getSourcesFromChunks(chunks);
    const context = getContextFromSources(sources);
    return `<results>${context}</results>`;
}