import { db } from "@/db";
import { albums, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
    let user;
    let userAlbums = [];

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' && params.username === 'mockuser') {
        user = {
            id: "mock-user-id",
            name: "Mock User",
            username: "mockuser",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=MockUser",
        };
        userAlbums = [
            {
                id: "album-1",
                title: "Nature Trips",
                coverPhoto: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
                isPublic: true,
            },
            {
                id: "album-2",
                title: "City Lights",
                coverPhoto: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
                isPublic: true,
            }
        ] as any[];
    } else {
        user = await db.query.users.findFirst({
            where: eq(users.username, params.username),
        });

        if (!user) {
            notFound();
        }

        userAlbums = await db.query.albums.findMany({
            where: and(
                eq(albums.userId, user.id),
                eq(albums.isPublic, true)
            ),
        });
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto py-6 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {user.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="w-12 h-12 rounded-full"
                            />
                        )}
                        <div>
                            <h1 className="text-xl font-bold">{user.name}</h1>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-10 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {userAlbums.map((album) => (
                        <Link
                            key={album.id}
                            href={`/${params.username}/${album.id}`}
                            className="group block"
                        >
                            <div className="aspect-video relative overflow-hidden rounded-lg bg-muted mb-3">
                                {album.coverPhoto && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={`${album.coverPhoto}=w800-h500-c`}
                                        alt={album.title}
                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                            <h3 className="font-semibold text-lg group-hover:underline">{album.title}</h3>
                        </Link>
                    ))}
                </div>

                {userAlbums.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        No public albums yet.
                    </div>
                )}
            </main>
        </div>
    );
}
