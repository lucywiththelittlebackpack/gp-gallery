import { auth } from "@/auth";
import { getAlbums } from "@/lib/google-photos";
import { db } from "@/db";
import { albums } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AlbumCard } from "@/components/album-card";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/");
    }

    // Fetch albums from Google Photos
    let googleAlbums = [];
    try {
        googleAlbums = await getAlbums();
    } catch (error) {
        console.error("Failed to fetch albums:", error);
        // Handle token expiry or other errors
    }

    // Fetch imported albums from DB
    let importedAlbums = [];
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        importedAlbums = [
            { googleId: "album-1", title: "Nature Trips" } // Simulate one imported album
        ] as any[];
    } else {
        importedAlbums = await db.query.albums.findMany({
            where: eq(albums.userId, session.user.id!),
        });
    }

    const importedIds = new Set(importedAlbums.map(a => a.googleId));

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Your Albums</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {googleAlbums.map((album: any) => (
                    <AlbumCard
                        key={album.id}
                        album={album}
                        isImported={importedIds.has(album.id)}
                    />
                ))}
            </div>
        </div>
    );
}
