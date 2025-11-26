import { db } from "@/db";
import { albums, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getPhotos } from "@/lib/google-photos";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { GalleryGrid } from "@/components/gallery-grid";

export default async function AlbumPage({ params }: { params: { username: string; albumId: string } }) {
    let album;
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' && params.username === 'mockuser') {
        album = {
            id: params.albumId,
            googleId: params.albumId, // In mock, id is same as googleId for simplicity
            title: params.albumId === 'album-1' ? "Nature Trips" : "City Lights",
            isPublic: true,
            user: { username: 'mockuser' }
        };
    } else {
        album = await db.query.albums.findFirst({
            where: eq(albums.id, params.albumId),
            with: {
                // @ts-ignore
                user: true
            }
        });
    }

    if (!album || !album.isPublic) {
        notFound();
    }

    // Verify username matches
    // @ts-ignore
    if (album.user.username !== params.username) {
        notFound();
    }

    let photos = [];
    try {
        photos = await getPhotos(album.googleId);
    } catch (error) {
        console.error("Failed to fetch photos:", error);
        // Handle error (e.g. token expired, album deleted)
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-10">
                <div className="container mx-auto py-4 px-4 flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/${params.username}`}>
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">{album.title}</h1>
                        <p className="text-sm text-muted-foreground">{photos.length} photos</p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-4 px-4">
                <GalleryGrid photos={photos} />
            </main>
        </div>
    );
}
