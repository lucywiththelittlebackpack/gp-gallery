'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { importAlbum } from "@/app/actions"
import { useTransition } from "react"

interface AlbumCardProps {
    album: {
        id: string;
        title: string;
        coverPhotoBaseUrl?: string;
        mediaItemsCount?: string;
    };
    isImported?: boolean;
}

export function AlbumCard({ album, isImported = false }: AlbumCardProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <Card className="overflow-hidden">
            <div className="aspect-video relative bg-muted">
                {album.coverPhotoBaseUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={`${album.coverPhotoBaseUrl}=w800-h500-c`}
                        alt={album.title}
                        className="object-cover w-full h-full"
                    />
                )}
            </div>
            <CardHeader>
                <CardTitle className="truncate" title={album.title}>{album.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{album.mediaItemsCount} items</p>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    disabled={isImported || isPending}
                    onClick={() => {
                        startTransition(async () => {
                            await importAlbum(album);
                        });
                    }}
                >
                    {isImported ? "Imported" : isPending ? "Importing..." : "Import Album"}
                </Button>
            </CardFooter>
        </Card>
    )
}
