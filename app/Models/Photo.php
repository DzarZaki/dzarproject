<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Photo extends Model
{
    public const SLIDESHOW = 'slideshow';
    public const THUMB = 'thumb';
    public const COVER = 'cover';
    public const ZIGZAG = 'zigzag';

    public const PENEMPATAN = [
        self::SLIDESHOW,
        self::THUMB,
        self::COVER,
        self::ZIGZAG,
    ];

    /** Penempatan yang hanya boleh berisi SATU foto per work. */
    public const PENEMPATAN_TUNGGAL = [
        self::SLIDESHOW,
        self::THUMB,
        self::COVER,
    ];

    public const LABEL_PENEMPATAN = [
        self::SLIDESHOW => 'Foto slide show',
        self::THUMB => 'Foto kartu',
        self::COVER => 'Foto cover detail',
        self::ZIGZAG => 'Foto zigzag',
    ];

    protected $fillable = ['work_id', 'file_path', 'thumb_path', 'penempatan', 'urutan'];

    protected $appends = ['url', 'thumb_url'];

    public function work(): BelongsTo
    {
        return $this->belongsTo(Work::class);
    }

    public function getUrlAttribute(): ?string
    {
        return $this->file_path
            ? Storage::disk('public')->url($this->file_path)
            : null;
    }

    public function getThumbUrlAttribute(): ?string
    {
        return Storage::disk('public')->url($this->thumb_path ?: $this->file_path);
    }
}