'use client'

import { useState } from 'react'
import { Lightbox } from '@/components/lightbox'
import { motion } from 'framer-motion'

interface GalleryGridProps {
    photos: { id: string; baseUrl: string; filename: string }[]
}

export function GalleryGrid({ photos }: GalleryGridProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    return (
        <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {photos.map((photo, index) => (
                    <motion.div
                        key={photo.id}
                        className="break-inside-avoid rounded-lg overflow-hidden bg-muted cursor-zoom-in relative group"
                        onClick={() => setLightboxIndex(index)}
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`${photo.baseUrl}=w800`}
                            alt={photo.filename}
                            className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </motion.div>
                ))}
            </div>

            {lightboxIndex !== null && (
                <Lightbox
                    images={photos}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </>
    )
}
