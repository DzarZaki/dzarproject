import { Head } from '@inertiajs/react'
import PublicLayout from '@/Layouts/PublicLayout'
import HeroSlideshow from '@/Components/Landing/HeroSlideshow'
import EditorialStrip from '@/Components/Landing/EditorialStrip'
import CategoryCarousel from '@/Components/Landing/CategoryCarousel'
import PitaMono from '@/Components/Landing/PitaMono'
import VideoSection from '@/Components/Landing/VideoSection'

export default function Home({ slides = [], kategori = [], horizontal = [], pita = null, videos = [] }) {
    return (
        <PublicLayout>
            <Head title="dzarproject" />

            <HeroSlideshow slides={slides} />
            <EditorialStrip items={horizontal} />
            <CategoryCarousel kategori={kategori} />
            <PitaMono foto={pita} />
            <VideoSection videos={videos} />
        </PublicLayout>
    )
}