<?php

namespace App\Models;

use App\Models\Concerns\HasYouTubeEmbed;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Work extends Model
{
    use HasYouTubeEmbed;

    public const JENIS_SLIDESHOW = 'slideshow';
    public const JENIS_HORIZONTAL = 'horizontal';
    public const JENIS_WORK = 'work';

    public const JENIS = [
        self::JENIS_SLIDESHOW,
        self::JENIS_HORIZONTAL,
        self::JENIS_WORK,
    ];

    public const UKURAN = ['kecil', 'sedang', 'besar'];

    /** Label untuk dropdown filter di halaman admin. */
    public const LABEL_JENIS = [
        self::JENIS_SLIDESHOW => 'Slide show',
        self::JENIS_HORIZONTAL => 'Foto horizontal',
        self::JENIS_WORK => 'Work',
    ];

    protected $fillable = [
        'category_id',
        'jenis',
        'judul',
        'slug',
        'lokasi',
        'deskripsi',
        'youtube_url',
        'ukuran',
        'urutan',
    ];

    protected $appends = ['embed_url'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class)->orderBy('urutan')->orderBy('id');
    }

    /** Foto full screen (jenis slideshow). */
    public function fotoSlideshow(): HasOne
    {
        return $this->hasOne(Photo::class)->where('penempatan', Photo::SLIDESHOW);
    }

    /** Foto kartu di strip horizontal / grid works. */
    public function fotoThumb(): HasOne
    {
        return $this->hasOne(Photo::class)->where('penempatan', Photo::THUMB);
    }

    /** Foto besar paling atas di halaman detail. */
    public function fotoCover(): HasOne
    {
        return $this->hasOne(Photo::class)->where('penempatan', Photo::COVER);
    }

    /** Galeri zigzag di halaman detail. */
    public function fotoZigzag(): HasMany
    {
        return $this->hasMany(Photo::class)
            ->where('penempatan', Photo::ZIGZAG)
            ->orderBy('urutan')
            ->orderBy('id');
    }

    public function scopeJenis(Builder $query, string $jenis): Builder
    {
        return $query->where('jenis', $jenis);
    }

    public function scopeUrut(Builder $query): Builder
    {
        return $query->orderBy('urutan')->orderBy('id');
    }

    /** Slide show tidak punya halaman detail. */
    public function punyaDetail(): bool
    {
        return $this->jenis !== self::JENIS_SLIDESHOW;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}