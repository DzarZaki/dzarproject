<?php

namespace App\Models;

use App\Models\Concerns\HasYouTubeEmbed;   // ← import
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasYouTubeEmbed;                    // ← pakai trait

    protected $fillable = ['judul', 'youtube_url', 'urutan'];

    protected $appends = ['embed_url'];
}
