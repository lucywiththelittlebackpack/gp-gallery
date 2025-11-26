'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LightboxProps {
    images: { id: string; baseUrl: string; filename: string }[]
    initialIndex: number
    onClose: () => void
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
    const [index, setIndex] = useState(initialIndex)

    const next = () => setIndex((index + 1) % images.length)
    const prev = () => setIndex((index - 1 + images.length) % images.length)

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                onClick={onClose}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-white/20"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                >
                    <ChevronLeft className="w-8 h-8" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={(e) => { e.stopPropagation(); next(); }}
                >
                    <ChevronRight className="w-8 h-8" />
                </Button>

                <motion.img
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    src={`${images[index].baseUrl}=w2048`}
                    alt={images[index].filename}
                    className="max-h-[90vh] max-w-[90vw] object-contain"
                    onClick={(e) => e.stopPropagation()}
                />

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                    {index + 1} / {images.length}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
