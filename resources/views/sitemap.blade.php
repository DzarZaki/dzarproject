<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>{{ url('/') }}</loc>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>{{ url('/works') }}</loc>
        <priority>0.8</priority>
    </url>
    @foreach ($works as $work)
        <url>
            <loc>{{ url('/works/'.$work->slug) }}</loc>
            <lastmod>{{ $work->updated_at->toDateString() }}</lastmod>
            <priority>0.7</priority>
        </url>
    @endforeach
</urlset>