<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Casts\Attribute;

trait HasYouTubeEmbed
{
    /**
     * Ubah berbagai format link YouTube menjadi URL embed.
     * watch?v= / youtu.be/ / shorts/ / live/  →  youtube.com/embed/ID
     */
    protected function embedUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (! $this->youtube_url) {
                    return null;
                }

                $cocok = preg_match(
                    '#(?:youtube\.com/(?:watch\?.*v=|shorts/|embed/|live/)|youtu\.be/)([a-zA-Z0-9_-]{11})#',
                    $this->youtube_url,
                    $m
                );

                return $cocok ? 'https://www.youtube.com/embed/'.$m[1] : null;
            }
        );
    }
}
