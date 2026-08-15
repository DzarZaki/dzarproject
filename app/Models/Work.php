<?php

namespace App\Models;

use App\Models\Concerns\HasYouTubeEmbed;   
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Work extends Model
{
    use HasYouTubeEmbed;                    

    protected $fillable = [
        'category_id',
        'judul',
        'slug',
        'deskripsi',
        'lokasi',
        'youtube_url',
        'show_on_landing',
        'urutan',
    ];

    protected $appends = ['embed_url'];

    protected $casts = [
        'show_on_landing' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class)->orderBy('urutan');
    }

    public function cover(): HasOne
    {
        return $this->hasOne(Photo::class)->where('peran', 'cover');
    }
}