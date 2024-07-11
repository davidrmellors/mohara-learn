import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { type SanityImageSource } from '@sanity/image-url/lib/types/types';

// Configuration for the Sanity client
export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  apiVersion: '2021-10-21', // use a UTC date string
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
};

// Set up the Sanity client for fetching data
export const sanityClient = createClient(config);

// Set up a helper function for generating image URLs with only the asset reference data in your documents
export const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder(config).image(source);
