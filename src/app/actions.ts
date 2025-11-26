'use server'

import { auth } from "@/auth";
import { db } from "@/db";
import { albums } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function importAlbum(album: { id: string; title: string; coverPhotoBaseUrl?: string }) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500));
        revalidatePath("/dashboard");
        return;
    }

    await db.insert(albums).values({
        id: crypto.randomUUID(),
        googleId: album.id,
        title: album.title,
        coverPhoto: album.coverPhotoBaseUrl,
        userId: session.user.id,
        isPublic: true,
    });

    revalidatePath("/dashboard");
}
