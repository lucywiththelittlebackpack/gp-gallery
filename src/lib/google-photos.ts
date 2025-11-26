import { google } from 'googleapis';
import { auth } from '@/auth';
import { db } from '@/db';
import { accounts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const MOCK_ALBUMS = [
    {
        id: "album-1",
        title: "Nature Trips",
        coverPhotoBaseUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
        mediaItemsCount: "12",
    },
    {
        id: "album-2",
        title: "City Lights",
        coverPhotoBaseUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
        mediaItemsCount: "8",
    },
    {
        id: "album-3",
        title: "Family Gathering",
        coverPhotoBaseUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300",
        mediaItemsCount: "24",
    },
];

const MOCK_PHOTOS = [
    {
        id: "photo-1",
        baseUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
        filename: "nature1.jpg",
    },
    {
        id: "photo-2",
        baseUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
        filename: "nature2.jpg",
    },
    {
        id: "photo-3",
        baseUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        filename: "nature3.jpg",
    },
    {
        id: "photo-4",
        baseUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
        filename: "city1.jpg",
    },
    {
        id: "photo-5",
        baseUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
        filename: "city2.jpg",
    },
];

export const getGooglePhotosClient = async () => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        return null; // Should not be called in mock mode ideally, or we handle it
    }

    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const account = await db.query.accounts.findFirst({
        where: and(
            eq(accounts.userId, session.user.id),
            eq(accounts.provider, "google")
        ),
    });

    if (!account || !account.refresh_token) {
        throw new Error("Google account not found or missing refresh token");
    }

    const authClient = new google.auth.OAuth2(
        process.env.AUTH_GOOGLE_ID,
        process.env.AUTH_GOOGLE_SECRET
    );

    authClient.setCredentials({
        access_token: account.access_token,
        refresh_token: account.refresh_token,
    });

    return (google as any).photoslibrary({ version: 'v1', auth: authClient });
};

export const getAlbums = async () => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        return MOCK_ALBUMS;
    }

    const client = await getGooglePhotosClient();
    const response = await client.albums.list({
        pageSize: 50,
    });
    return response.data.albums || [];
};

export const getAlbum = async (albumId: string) => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        return MOCK_ALBUMS.find(a => a.id === albumId) || MOCK_ALBUMS[0];
    }

    const client = await getGooglePhotosClient();
    const response = await client.albums.get({
        albumId,
    });
    return response.data;
};

export const getPhotos = async (albumId: string) => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        // Return random subset of mock photos for variety
        return MOCK_PHOTOS;
    }

    const client = await getGooglePhotosClient();
    const response = await client.mediaItems.search({
        resource: {
            albumId,
            pageSize: 100,
        },
    });
    return response.data.mediaItems || [];
};
